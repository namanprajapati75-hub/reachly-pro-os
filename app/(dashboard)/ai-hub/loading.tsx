import { Search, Loader2 } from "lucide-react";

export default function AIHubLoading() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', height: 'calc(100vh - 120px)' }}>
      {/* Skeleton Left Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflow: 'hidden' }}>
        <header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '150px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} className="skeleton" />
            <div className="glass skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          </div>
          
          <div className="glass skeleton" style={{ height: '40px', borderRadius: '12px', marginBottom: '1.5rem' }} />
          
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', borderRadius: '12px' }}>
            <Search size={16} color="var(--text-muted)" />
            <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} className="skeleton" />
          </div>
        </header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="glass skeleton" style={{ padding: '1.25rem', borderRadius: '16px', height: '100px' }} />
          ))}
        </div>
      </div>

      {/* Skeleton Right Column */}
      <div className="glass" style={{ height: '100%', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="spinner" size={48} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem', animation: 'spin 2s linear infinite' }} />
        <div style={{ color: 'var(--text-muted)' }}>Loading Smart Inbox data...</div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
