import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono, Bebas_Neue, Cormorant_Garamond, IBM_Plex_Mono, Syne } from "next/font/google";
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

const cormorant = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      <body className={`${playfair.variable} ${jetbrains.variable} ${bebas.variable} ${cormorant.variable} ${ibmMono.variable} ${syne.variable}`}>
        <ClientShell>
          <PageTransition>
            {children}
          </PageTransition>
        </ClientShell>
      </body>
    </html>
  );
}
