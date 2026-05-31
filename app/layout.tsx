import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GRAILS — Suis tes pièces. Calcule tes flips. Flex tes stats.",
  description: "Dashboard premium pour resellers de sneakers et streetwear, avec IA Claude intégrée.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="ambient min-h-screen">{children}</body>
    </html>
  );
}
