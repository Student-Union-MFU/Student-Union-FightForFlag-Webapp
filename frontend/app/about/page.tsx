import Link from "next/link";
import Container from "../components/container";

export default function About() {
  return (
    <main className="flex flex-1 flex-col items-center">
      <Container
        className="
          relative
          flex
          min-h-[75dvh]
          w-full
          flex-col
          overflow-hidden
          pb-10
          lg:px-12
          lg:py-16
        "
      >

        {/* Hero */}
        <section className="w-full lg:mt-28">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Look Mae Fah Fight for Flags & Sports Festival 2026
          </p>

          <h2 className="mt-5 text-4xl leading-[0.95] tracking-tight lg:text-7xl">
            More than a competition.
            <span className="text-zinc-400">
              {" "}
              A tradition that brings Mae Fah Luang together.
            </span>
          </h2>

          <p className="mt-8 max-w-3xl text-base leading-7 text-zinc-500 lg:text-lg">
            Fight for Flags and Sports Festival is one of Mae Fah Luang
            University&apos;s important student traditions. The event brings
            students from across the university together through sports,
            performances, competition, and school spirit.
          </p>
        </section>

        {/* Event Information */}
        <section className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 md:grid-cols-4">
          <div className="bg-zinc-50 p-5 lg:p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-400">
              Event
            </p>
            <p className="mt-8 text-lg font-medium">
              Fight for Flags 2026
            </p>
          </div>

          <div className="bg-zinc-50 p-5 lg:p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-400">
              Date
            </p>
            <p className="mt-8 text-lg font-medium">
              2–22 February 2026
            </p>
          </div>

          <div className="bg-zinc-50 p-5 lg:p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-400">
              Location
            </p>
            <p className="mt-8 text-lg font-medium">
              MFU Sports Center
            </p>
          </div>

          <div className="bg-zinc-50 p-5 lg:p-7">
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-400">
              Schools
            </p>
            <p className="mt-8 text-lg font-medium">
              14 Schools
            </p>
          </div>
        </section>

        {/* About the Event */}
        <section className="mt-10 border-t border-zinc-200 pt-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                The Event
              </p>

              <h2 className="mt-4 text-4xl tracking-tight lg:text-5xl">
                A celebration of
                <br />
                <span className="text-zinc-400">
                  university spirit.
                </span>
              </h2>
            </div>

            <div className="space-y-6 text-sm leading-7 text-zinc-500 lg:text-base">
              <p>
                The School of Agro-Industry, Mae Fah Luang University,
                participated in the “Look Mae Fah Fight for Flags and Sports
                Festival 2026,” held from 2–22 February 2026 at the Mae Fah
                Luang University Sports Center.
              </p>

              <p>
                The event was organized through the collaboration of the
                Student Union and the Student Development Division, continuing
                an important university tradition focused on strengthening
                bonds, unity, and a sense of belonging among senior and junior
                students.
              </p>

              <p>
                Students from all 14 schools came together to represent their
                respective schools, creating an atmosphere centered around
                teamwork, enthusiasm, friendship, and pride in being Mae Fah
                Luang students.
              </p>
            </div>
          </div>
        </section>

        {/* Activities */}
        <section className="mt-10">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Festival Program
            </p>

            <h2 className="mt-4 text-4xl tracking-tight lg:text-5xl">
              What happens
              <span className="text-zinc-400"> during the festival?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                number: "01",
                title: "National Flag Ceremony",
                description:
                  "A ceremony bringing students together to begin the event and celebrate the university community.",
              },
              {
                number: "02",
                title: "Faculty Flag Assembly",
                description:
                  "Students gather and represent their respective schools through their flags and school identity.",
              },
              {
                number: "03",
                title: "Torch Lighting Ceremony",
                description:
                  "The lighting ceremony marks the beginning of the festival and symbolizes the spirit of the competition.",
              },
              {
                number: "04",
                title: "Cheerleading Performances",
                description:
                  "All 14 schools showcase their creativity, coordination, energy, and school spirit through cheerleading.",
              },
              {
                number: "05",
                title: "Student Club Performances",
                description:
                  "Various student clubs contribute performances and activities throughout the festival.",
              },
              {
                number: "06",
                title: "Sports & Competitions",
                description:
                  "Students compete in sporting activities and cheerleading competitions while representing their schools.",
              },
              {
                number: "07",
                title: "Musical Performances",
                description:
                  "Musical performances add to the festival atmosphere and give students another way to share their talents.",
              },
              {
                number: "08",
                title: "School Spirit",
                description:
                  "The festival creates opportunities for students from different years to connect, work together, and build lasting memories.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="
                  rounded-3xl
                  border
                  border-zinc-200
                  bg-zinc-50
                  p-6
                  lg:p-8
                "
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs tracking-[0.15em] text-zinc-400">
                    {item.number}
                  </span>

                  <span className="text-xs uppercase tracking-[0.15em] text-zinc-400">
                    2026
                  </span>
                </div>

                <h3 className="mt-12 text-xl font-medium">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why it matters */}
        <section className="mt-10 border-t border-zinc-200 pt-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Why it matters
              </p>

              <h2 className="mt-4 text-4xl tracking-tight lg:text-6xl">
                One university.
                <br />
                <span className="text-zinc-400">
                  Many communities.
                </span>
              </h2>
            </div>

            <div className="text-sm leading-7 text-zinc-500 lg:pt-2 lg:text-base">
              <p>
                Fight for Flags is not only about winning competitions. It
                provides students with an opportunity to work together across
                different years, build relationships, express their creativity,
                and represent the school they belong to.
              </p>

              <p className="mt-6">
                Through sports, performances, ceremonies, and school
                activities, the festival creates a shared experience for the
                Mae Fah Luang University community.
              </p>
            </div>
          </div>
        </section>

        {/* Voting CTA */}
        <section className=" mt-10 rounded-[2rem] bg-zinc-900 px-6 py-16 text-center text-white lg:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Fight For Flag 2026
          </p>

          <h2 className="mt-5 text-4xl tracking-tight lg:text-6xl">
            Represent your school.
          </h2>

          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-zinc-400">
            Support your school and be part of the Fight for Flags community.
          </p>

          <Link
            href="/voting"
            className="
              mt-8
              inline-block
              rounded-full
              border-2
              border-transparent
              bg-white
              px-8
              py-3
              text-sm
              font-medium
              text-zinc-900
              transition-all
              hover:border-white
              hover:bg-transparent
              hover:text-white
            "
          >
            Go to Voting
          </Link>
        </section>
      </Container>
    </main>
  );
}