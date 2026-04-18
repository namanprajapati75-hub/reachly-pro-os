"use client";

import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
          <div className="glass" style={{ padding: '3rem', borderRadius: '24px', textAlign: 'center', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-outfit)', marginBottom: '1rem', color: '#ef4444' }}>A Fatal Error Occurred</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>We apologize, but something went seriously wrong while loading the core application structure.</p>
            <button onClick={() => reset()} style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
