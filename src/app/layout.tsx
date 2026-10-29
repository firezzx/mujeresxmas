import type { Metadata } from "next";
import { Outfit, Poppins } from "next/font/google";
import { Suspense } from "react";

import { SiteHeader } from "@/components/site-header/site-header";
import { SiteHeaderWithSession } from "@/components/site-header/site-header-with-session";
import "./globals.css";

// Textos y botones
const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Títulos
const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Mujeres x Más",
    template: "%s | Mujeres x Más",
  },
  description:
    "Capacitamos, relacionamos e incluimos a mujeres y emprendedoras. Sumate a la comunidad.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${poppins.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={<SiteHeader user={null} pending />}>
          <SiteHeaderWithSession />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
