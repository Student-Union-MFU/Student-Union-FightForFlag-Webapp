"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface SchoolOption {
  id: string;
  name: string;
  subtitle: string;
  color: string; // hex, e.g. "#C92A2A"
}

interface VotingCardSceneProps {
  schools: SchoolOption[];
  onVote: (schoolId: string) => void;
}

// Draws a card's front face onto a canvas and returns it as a Three.js texture.
function createCardTexture(school: SchoolOption): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 720;
  const ctx = canvas.getContext("2d")!;

  // background
  ctx.fillStyle = "#150B0B";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // top color band (school's color)
  ctx.fillStyle = school.color;
  ctx.fillRect(0, 0, canvas.width, 220);

  // subtle border
  ctx.strokeStyle = "#7A1A1F";
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);

  // school name
  ctx.fillStyle = "#F5F0EC";
  ctx.font = "bold 52px sans-serif";
  ctx.textAlign = "center";
  wrapText(ctx, school.name, canvas.width / 2, 320, 440, 58);

  // subtitle
  ctx.fillStyle = "#9C8A85";
  ctx.font = "28px sans-serif";
  wrapText(ctx, school.subtitle, canvas.width / 2, 500, 420, 36);

  // "vote" hint at bottom
  ctx.fillStyle = "#C92A2A";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("SWIPE TO VOTE", canvas.width / 2, canvas.height - 60);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;
  for (const word of words) {
    const testLine = line + word + " ";
    if (ctx.measureText(testLine).width > maxWidth && line !== "") {
      ctx.fillText(line, x, lineY);
      line = word + " ";
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, lineY);
}

export default function VotingCardScene({ schools, onVote }: VotingCardSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || schools.length === 0) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // --- Scene setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0A0505");

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight("#FF6B4A", 0.8);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    // --- Build card stack ---
    const cardGeometry = new THREE.PlaneGeometry(2.4, 3.4);
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    type CardMesh = THREE.Mesh & { material: THREE.MeshStandardMaterial };
    const cardMeshes: CardMesh[] = [];

    schools.forEach((school, i) => {
      const texture = createCardTexture(school);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(cardGeometry, material) as CardMesh;

      // stack cards behind each other with slight offset, top card = index 0
      mesh.position.set(0, -i * 0.05, -i * 0.15);
      mesh.userData.baseZ = -i * 0.15;
      mesh.userData.stackIndex = i;
      mesh.renderOrder = schools.length - i;
      cardGroup.add(mesh);
      cardMeshes.push(mesh);
    });

    // --- Drag / swipe state ---
    let dragging = false;
    let dragStartX = 0;
    let dragCurrentX = 0;
    let dragStartY = 0;
    let dragCurrentY = 0;
    const SWIPE_THRESHOLD = 1.4; // world units before a swipe "commits"

    function getTopCard(): CardMesh | undefined {
      return cardMeshes.find((m) => m.userData.stackIndex === currentIndexRef.current);
    }

    function onPointerDown(e: PointerEvent) {
      if (!getTopCard()) return;
      dragging = true;
      dragStartX = e.clientX;
      dragCurrentX = e.clientX;
      dragStartY = e.clientY;
      dragCurrentY = e.clientY;
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragging) return;
      dragCurrentX = e.clientX;
      dragCurrentY = e.clientY;

      const card = getTopCard();
      if (!card) return;

      const deltaX = (dragCurrentX - dragStartX) / 100;
      const deltaY = (dragCurrentY - dragStartY) / 100;

      card.position.x = deltaX;
      card.position.y = card.userData.baseZ !== undefined ? -deltaY * 0.3 : -deltaY * 0.3;
      card.rotation.z = -deltaX * 0.25;
    }

    function onPointerUp() {
      if (!dragging) return;
      dragging = false;

      const card = getTopCard();
      if (!card) return;

      const deltaX = (dragCurrentX - dragStartX) / 100;

      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        // committed swipe: animate off screen, then advance
        const direction = deltaX > 0 ? 1 : -1;
        const school = schools[card.userData.stackIndex];
        animateSwipeOut(card, direction, () => {
          onVote(school.id);
          setCurrentIndex((prev) => prev + 1);
        });
      } else {
        // snap back
        animateSnapBack(card);
      }
    }

    function animateSwipeOut(card: CardMesh, direction: number, onDone: () => void) {
      const startX = card.position.x;
      const startRotZ = card.rotation.z;
      const targetX = direction * 6;
      let t = 0;
      function step() {
        t += 0.06;
        const eased = t;
        card.position.x = THREE.MathUtils.lerp(startX, targetX, eased);
        card.rotation.z = THREE.MathUtils.lerp(startRotZ, direction * 0.6, eased);
        card.material.opacity = THREE.MathUtils.lerp(1, 0, eased);
        card.material.transparent = true;
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          card.visible = false;
          onDone();
        }
      }
      step();
    }

    function animateSnapBack(card: CardMesh) {
      const startX = card.position.x;
      const startY = card.position.y;
      const startRotZ = card.rotation.z;
      let t = 0;
      function step() {
        t += 0.12;
        card.position.x = THREE.MathUtils.lerp(startX, 0, t);
        card.position.y = THREE.MathUtils.lerp(startY, 0, t);
        card.rotation.z = THREE.MathUtils.lerp(startRotZ, 0, t);
        if (t < 1) requestAnimationFrame(step);
      }
      step();
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // --- Render loop: settle non-top cards toward their stacked position ---
    let frameId: number;
    const animate = () => {
      cardMeshes.forEach((card) => {
        if (card.userData.stackIndex === currentIndexRef.current) return; // top card handled by drag/animate fns
        if (!dragging) {
          const offset = card.userData.stackIndex - currentIndexRef.current;
          if (offset >= 0) {
            card.position.z = THREE.MathUtils.lerp(card.position.z, -offset * 0.15, 0.15);
            card.position.y = THREE.MathUtils.lerp(card.position.y, -offset * 0.05, 0.15);
          }
        }
      });
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      cardGeometry.dispose();
      cardMeshes.forEach((m) => {
        m.material.map?.dispose();
        m.material.dispose();
      });
    };
  }, [schools, onVote]);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <canvas ref={canvasRef} className="w-full h-full rounded-lg cursor-grab active:cursor-grabbing" />
      {currentIndex >= schools.length && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-text text-xl font-semibold">
            You&apos;ve voted on every school. Thanks!
          </p>
        </div>
      )}
    </div>
  );
}