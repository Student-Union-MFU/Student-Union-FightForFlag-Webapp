import type { Metadata } from "next";
import { Didact_Gothic, Geist, Geist_Mono, Stack_Sans_Notch } from "next/font/google";
import "./globals.css";
import { Footer } from "./components/footer";
import Navbar from "./components/navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { Analytics } from "@vercel/analytics/next"

const stackSansNotch = Stack_Sans_Notch({
  variable: "--font-stack-sans-notch"
}) 

export const metadata: Metadata = {
  title: "Fight For Flag | Student Union",
  description: "uhh",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${stackSansNotch.variable} h-full antialiased`}
    >
      <body className="min-h-full w-screen flex flex-col">
        <Analytics />
        <AuthProvider>
          <Navbar />
          <div className="w-full h-full flex flex-col px-4 md:px-16 lg:px-30">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
