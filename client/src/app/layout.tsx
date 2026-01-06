import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GENESIS | Self-Healing AI Interface",
  description: "Experimental autonomous interface that detects user frustration via vector entropy analysis and repairs itself using Generative AI (GPT-4o). Built with Next.js & Python.",
  keywords: ["Generative UI", "System Design", "Next.js", "Python", "AI Engineering", "Vercel AI SDK"],
  authors: [{ name: "Gowtham Angeeru" }], 
  openGraph: {
    title: "GENESIS | Self-Healing AI Interface",
    description: "An AI system that watches cursor movements to detect rage/confusion and rewrites its own code to help you.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
