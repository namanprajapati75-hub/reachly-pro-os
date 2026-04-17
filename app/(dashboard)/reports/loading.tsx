import { SkeletonRow, GhostCard } from "@/app/components/ui/Skeleton";

export default function ReportsLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <div className="skeleton" style={{ width: '150px', height: '20px', marginBottom: '0.5rem' }}></div>
        <div className="skeleton" style={{ width: '300px', height: '40px' }}></div>
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <GhostCard />
        <GhostCard />
        <GhostCard />
      </div>

      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <div style={{ height: '60px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '2rem' }}>
           {[...Array(6)].map((_, i) => (
             <div key={i} className="skeleton" style={{ width: '100px', height: '14px' }}></div>
           ))}
        </div>
        <div>
          {[...Array(5)].map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
