"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '24px', textAlign: 'center', maxWidth: '500px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-outfit)', marginBottom: '1rem' }}>Something went wrong</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>We couldn't load this section. This might be a temporary network issue or a server timeout.</p>
        <button onClick={() => reset()} style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
          Try Again
        </button>
      </div>
    </div>
  )
}
