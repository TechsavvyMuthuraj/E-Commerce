import type { Metadata } from "next";
import { Inter, Barlow_Condensed, Space_Mono } from "next/font/google";
import ClientShell from "@/components/layout/ClientShell";
import PageTransition from "@/components/layout/PageTransition";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "EXE TOOL — Premium Windows Software Marketplace",
  description: "EXE TOOL: Premium digital tools and software for Windows optimization, debloating, and performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${barlowCondensed.variable} ${spaceMono.variable}`}>
        <ClientShell>
          <PageTransition>
            {children}
          </PageTransition>
        </ClientShell>
      </body>
    </html>
  );
}
