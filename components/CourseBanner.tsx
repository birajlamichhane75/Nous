export function CourseBanner({ id }: { id: string }) {
  const art: Record<string, { bg: string; svg: React.ReactNode }> = {
    'math-2414': {
      bg: '#0B1D35',
      svg: (
        <svg viewBox="0 0 320 110" preserveAspectRatio="xMidYMid slice"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
          {[0,40,80,120,160,200,240,280,320].map(x =>
            <line key={x} x1={x} y1="0" x2={x} y2="110" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>)}
          {[0,22,44,66,88,110].map(y =>
            <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>)}
          <line x1="0" y1="55" x2="320" y2="55" stroke="rgba(255,255,255,0.10)" strokeWidth="1"/>
          <line x1="160" y1="0" x2="160" y2="110" stroke="rgba(255,255,255,0.10)" strokeWidth="1"/>
          <path d="M 0,55 C 32,5 64,5 96,55 C 128,105 160,105 192,55 C 224,5 256,5 288,55 C 304,80 312,90 320,55"
            stroke="rgba(147,197,253,0.55)" strokeWidth="1.5" fill="none"/>
        </svg>
      ),
    },
    'cosc-3312': {
      bg: '#081810',
      svg: (
        <svg viewBox="0 0 320 110" preserveAspectRatio="xMidYMid slice"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
          {[12, 34, 56, 78].map((y, i) =>
            <rect key={i} x="12" y={y} width="296" height="17" rx="2"
              fill={i === 0 ? 'rgba(134,239,172,0.06)' : 'rgba(255,255,255,0.02)'}
              stroke="rgba(134,239,172,0.07)" strokeWidth="0.5"/>)}
          {[100, 200].map(x =>
            <line key={x} x1={x} y1="12" x2={x} y2="95" stroke="rgba(134,239,172,0.07)" strokeWidth="0.5"/>)}
          {[[32,20],[32,42],[32,64],[32,86]].map(([cx,cy],i) =>
            <circle key={i} cx={cx} cy={cy} r="2.5" fill="rgba(134,239,172,0.18)"/>)}
        </svg>
      ),
    },
    'fren-1311': {
      bg: '#1A0B14',
      svg: (
        <svg viewBox="0 0 320 110" preserveAspectRatio="xMidYMid slice"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
          {[-80,-50,-20,10,40,70,100,130,160,190,220,250,280,310].map((x, i) =>
            <line key={i} x1={x} y1="0" x2={x + 110} y2="110"
              stroke="rgba(251,207,232,0.05)" strokeWidth="10"/>)}
          <line x1="0" y1="30" x2="320" y2="30" stroke="rgba(251,207,232,0.10)" strokeWidth="0.5"/>
          <line x1="0" y1="80" x2="320" y2="80" stroke="rgba(251,207,232,0.10)" strokeWidth="0.5"/>
        </svg>
      ),
    },
    'cosc-2327': {
      bg: '#080D18',
      svg: (
        <svg viewBox="0 0 320 110" preserveAspectRatio="xMidYMid slice"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
          {[[16,20,80],[36,20,120],[56,36,60],[76,36,100],[90,20,45]].map(([y,x,w], i) =>
            <rect key={i} x={x} y={y} width={w} height="7" rx="3.5"
              fill="rgba(165,180,252,0.09)"/>)}
          <text x="195" y="85" fontSize="64" fontFamily="'Courier New',monospace"
            fill="rgba(165,180,252,0.07)" fontWeight="700">{'</>'}</text>
        </svg>
      ),
    },
    'hist-1301': {
      bg: '#180900',
      svg: (
        <svg viewBox="0 0 320 110" preserveAspectRatio="xMidYMid slice"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
          {[14,28,42,56,70,84,98].map((y, i) =>
            <line key={i} x1="0" y1={y} x2="320" y2={y}
              stroke={i % 2 === 0 ? 'rgba(251,191,36,0.07)' : 'rgba(255,255,255,0.025)'}
              strokeWidth={i % 2 === 0 ? '1.5' : '0.5'}/>)}
          <line x1="36" y1="0" x2="36" y2="110" stroke="rgba(251,191,36,0.08)" strokeWidth="1"/>
        </svg>
      ),
    },
    'orientation': {
      bg: '#1A0303',
      svg: (
        <svg viewBox="0 0 320 110" preserveAspectRatio="xMidYMid slice"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
          {[90, 68, 46, 24].map((r, i) =>
            <circle key={i} cx="270" cy="55" r={r}
              fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>)}
          <circle cx="270" cy="55" r="12" fill="rgba(255,255,255,0.05)"/>
          <path d="M 50,15 L 90,15 L 90,60 C 90,80 70,90 70,90 C 70,90 50,80 50,60 Z"
            fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
        </svg>
      ),
    },
  };

  const c = art[id] ?? { bg: '#111827', svg: null };

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:c.bg, overflow:'hidden' }}>
      {c.svg}
    </div>
  );
}
