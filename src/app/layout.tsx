import type { Metadata } from "next";
import { Caveat, Jost, Saira } from "next/font/google";
import { Suspense } from "react";

import { MotionProvider } from "@/components/motion-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader, SiteHeaderView } from "@/components/site-header/site-header";
import { SiteHeaderWithSession } from "@/components/site-header/site-header-with-session";
import { Toaster } from "@/components/toast/toaster";
import "./globals.css";

// Textos y botones
const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Títulos y rótulos
const display = Saira({
  variable: "--font-display",
  subsets: ["latin"],
});

// Acentos manuscritos: solo palabras sueltas, hashtag o rótulos de foto
const script = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Mujeres x Más",
    template: "%s | Mujeres x Más",
  },
  description:
    "Una comunidad de emprendedoras que se acompañan para vender más, ordenar sus números y crecer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${jost.variable} ${display.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Avisos flotantes abajo a la derecha (formularios, notificaciones nuevas) */}
        <MotionProvider>
          <Toaster>
            <Suspense
              fallback={
                <Suspense fallback={<SiteHeaderView user={null} pending pathname={null} />}>
                  <SiteHeader user={null} pending />
                </Suspense>
              }
            >
              <SiteHeaderWithSession />
            </Suspense>
            {children}
            <SiteFooter />
          </Toaster>
        </MotionProvider>
      </body>
    </html>
  );
}
