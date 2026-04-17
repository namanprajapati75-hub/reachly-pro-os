import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <Sidebar />
        <Header />
        <main style={{
          marginLeft: '280px',
          marginTop: '70px',
          padding: '2rem',
          minHeight: 'calc(100vh - 70px)',
          background: 'var(--background)',
          overflowY: 'auto'
        }}>
          {children}
        </main>
      </body>
    </html>
  );
}
