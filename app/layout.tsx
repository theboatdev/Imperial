import type { ReactNode } from "react";
import "./globals.css";

/**
 * Root layout — minimal shell required by Next.js.
 * Locale-aware html/body attrs, fonts, and providers live in app/[locale]/layout.tsx.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
