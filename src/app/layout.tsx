import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SkillBoard | On-Chain Talent Showcase & Skill Endorsements",
  description:
    "Discover talented people, showcase your abilities, and build your reputation on-chain on Botchain Testnet.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text antialiased min-h-screen selection:bg-purple/30 selection:text-neon">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

