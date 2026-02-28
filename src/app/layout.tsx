import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono, Bebas_Neue } from "next/font/google";
import ClientShell from "@/components/layout/ClientShell";
import PageTransition from "@/components/layout/PageTransition";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
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
      <body className={`${playfair.variable} ${jetbrains.variable} ${bebas.variable}`}>
        <ClientShell>
          <PageTransition>
            {children}
          </PageTransition>
        </ClientShell>
      </body>
    </html>
  );
}
