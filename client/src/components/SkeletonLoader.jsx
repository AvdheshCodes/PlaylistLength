export default function SkeletonLoader() {
  const Block = ({ w = '100%', h = 20, style = {} }) => (
    <div className="skeleton" style={{ width: w, height: h, borderRadius: 6, ...style }} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Main card skeleton */}
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
          <Block w={80} h={80} style={{ borderRadius: 10, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Block w="70%" h={22} />
            <Block w="45%" h={16} />
            <Block w="30%" h={14} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Block w="40%" h={14} />
          <Block w="60%" h={44} />
          <Block w="50%" h={20} />
        </div>

        <div style={{ marginTop: 24 }}>
          <Block w="35%" h={14} style={{ marginBottom: 12 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[0,1,2,3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 72, borderRadius: 10 }} />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <Block w="40%" h={14} style={{ marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 12 }}>
            <Block w={160} h={42} style={{ borderRadius: 8 }} />
            <Block w={120} h={42} style={{ borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
