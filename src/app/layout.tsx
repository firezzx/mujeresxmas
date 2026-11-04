import type { Metadata } from "next";
import { Outfit, Poppins } from "next/font/google";
import { Suspense } from "react";

import { MotionProvider } from "@/components/motion-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader, SiteHeaderView } from "@/components/site-header/site-header";
import { SiteHeaderWithSession } from "@/components/site-header/site-header-with-session";
import { Toaster } from "@/components/toast/toaster";
import { ScrollProgress } from "@/components/ui/scroll-progress";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
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
        {/* Avisos flotantes abajo a la derecha (formularios, notificaciones nuevas) */}
        <MotionProvider>
          <Toaster>
            {/* Barra de progreso de lectura (Scroll Progress de Magic UI) */}
            <ScrollProgress className="z-[60] h-0.5 from-brand via-brand-soft to-brand-green" />
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
