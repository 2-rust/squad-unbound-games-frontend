import type { Metadata } from "next";
import localFont from "next/font/local";
import { Space_Grotesk, Martian_Mono, Unbounded } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import "./squad.css";
import { SiteNav } from "@/components/SiteNav";
import { Web3Providers } from "@/components/providers";
import { AutoShapeNetwork } from "@/components/auto-shape-network";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

// Unbounded font from Google Fonts
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic", "latin-ext"],
  variable: "--font-unbounded",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Martian Mono font from Google Fonts
const martianMono = Martian_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-martian-mono",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Squad Unbound MVP",
  description:
    "Minimal Next.js recreation of squad.unbound.games for showcasing the fighter flow.",
  icons: {
    icon: "/assets/sitelogo.png",
    shortcut: "/assets/sitelogo.png",
    apple: "/assets/sitelogo.png",
  },
  openGraph: {
    images: ["/assets/sitelogo.png"],
  },
  twitter: {
    card: "summary",
    images: ["/assets/sitelogo.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${unbounded.variable} ${martianMono.variable} antialiased`}
      >
        <Web3Providers>
          <AutoShapeNetwork />
          <SiteNav />
          <div className="pt-[70px] md:pt-[70px]">{children}</div>
        </Web3Providers>
      </body>
    </html>
  );
}
