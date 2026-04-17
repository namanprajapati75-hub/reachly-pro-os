import { SkeletonRow, GhostCard } from "@/app/components/ui/Skeleton";

export default function TasksLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="skeleton" style={{ width: '120px', height: '18px', marginBottom: '0.5rem' }}></div>
          <div className="skeleton" style={{ width: '250px', height: '36px' }}></div>
        </div>
        <div className="skeleton" style={{ width: '150px', height: '44px', borderRadius: '12px' }}></div>
      </header>

      {/* View Toggle Skeleton */}
      <div className="glass" style={{ width: '240px', height: '44px', borderRadius: '12px', padding: '4px', display: 'flex' }}>
         <div className="skeleton" style={{ flex: 1, borderRadius: '8px' }}></div>
         <div style={{ flex: 1 }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
         {[...Array(6)].map((_, i) => (
           <div key={i} className="glass skeleton" style={{ height: '180px', borderRadius: '20px' }}></div>
         ))}
      </div>
    </div>
  );
}
