function SkeletonBlock({ width, height, radius = 10 }: { width?: string; height: number; radius?: number }) {
  return (
    <div
      className="skeleton"
      style={{ width: width ?? "100%", height, borderRadius: radius }}
    />
  );
}

function CardSkeleton() {
  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: 20,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <SkeletonBlock width="40px" height={40} radius={11} />
        <SkeletonBlock width="60px" height={24} radius={6} />
      </div>
      <SkeletonBlock width="100px" height={12} radius={4} />
      <SkeletonBlock width="140px" height={32} radius={6} />
      <SkeletonBlock height={4} radius={2} />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div
      style={{
        padding: "1.75rem",
        borderRadius: 24,
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <SkeletonBlock width="100px" height={10} radius={4} />
          <SkeletonBlock width="160px" height={22} radius={6} />
        </div>
        <SkeletonBlock width="70px" height={26} radius={6} />
      </div>
      <SkeletonBlock height={200} radius={12} />
    </div>
  );
}

function RowSkeleton() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0" }}>
      <SkeletonBlock width="34px" height={34} radius={9} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        <SkeletonBlock width="60%" height={13} radius={4} />
        <SkeletonBlock width="40%" height={10} radius={4} />
      </div>
      <SkeletonBlock width="50px" height={20} radius={6} />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "4rem" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <SkeletonBlock width="180px" height={11} radius={4} />
          <SkeletonBlock width="320px" height={38} radius={8} />
          <SkeletonBlock width="260px" height={13} radius={4} />
        </div>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <SkeletonBlock width="100px" height={36} radius={10} />
          <SkeletonBlock width="100px" height={36} radius={10} />
          <SkeletonBlock width="130px" height={36} radius={10} />
        </div>
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>

      {/* Growth metrics label */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <SkeletonBlock width="120px" height={10} radius={4} />
            <SkeletonBlock width="180px" height={22} radius={6} />
          </div>
          <SkeletonBlock width="90px" height={26} radius={6} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Pipeline / Activity / AI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {[280, 360, 320].map((h, i) => (
          <div key={i} style={{ padding: "1.75rem", borderRadius: 24, background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <SkeletonBlock width="80px" height={10} radius={4} />
                <SkeletonBlock width="160px" height={20} radius={6} />
              </div>
              <SkeletonBlock width="60px" height={24} radius={6} />
            </div>
            {Array.from({ length: 4 }).map((_, j) => <RowSkeleton key={j} />)}
          </div>
        ))}
      </div>
    </div>
  );
}
