import { GhostCard, ChartSkeleton } from "@/app/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      <header>
        <div className="skeleton" style={{ width: '200px', height: '20px', marginBottom: '0.5rem' }}></div>
        <div className="skeleton" style={{ width: '350px', height: '40px' }}></div>
      </header>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(241px, 1fr))', gap: '1.5rem' }}>
        <GhostCard />
        <GhostCard />
        <GhostCard />
        <GhostCard />
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <ChartSkeleton />
           <div style={{ display: 'flex', gap: '1.5rem' }}>
             <div className="glass skeleton" style={{ flex: 1, height: '100px', borderRadius: '20px' }}></div>
             <div className="glass skeleton" style={{ flex: 1, height: '100px', borderRadius: '20px' }}></div>
           </div>
        </div>
        <div style={{ flex: 1, minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass skeleton" style={{ height: '300px', borderRadius: '24px' }}></div>
          <div className="glass skeleton" style={{ height: '400px', borderRadius: '24px' }}></div>
        </div>
      </div>
    </div>
  );
}
