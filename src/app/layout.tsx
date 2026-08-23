import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "TI GRAPHICS | AI Prompt Library",
  description: "TI GRAPHICS personal AI prompt library — organize, preview, edit and copy your AI prompts by category.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black antialiased">
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-white">{children}</main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
