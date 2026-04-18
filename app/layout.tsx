import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "./components/SidebarContext";
import ClientLayout from "./components/ClientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reachly OS | Premium Agency Business Operating System",
  description: "High-end, AI-powered internal OS for modern agencies.",
};

import { ToastProvider } from "./components/ui/ToastProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <ToastProvider>
          <SidebarProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </SidebarProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
