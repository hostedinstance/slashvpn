'use client';

/** Area chart — чистый SVG, без внешних зависимостей */

const DATA = [
  { month: 'Янв', rate: 35 },
  { month: 'Фев', rate: 52 },
  { month: 'Мар', rate: 41 },
  { month: 'Апр', rate: 63 },
  { month: 'Май', rate: 47 },
  { month: 'Июн', rate: 78 },
  { month: 'Июл', rate: 58 },
  { month: 'Авг', rate: 69 },
  { month: 'Сен', rate: 82 },
];

const W = 480; const H = 180;
const PAD = { top: 12, right: 12, bottom: 28, left: 32 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;
const MIN = 0; const MAX = 100;
const TICKS = [0, 25, 50, 75, 100];

function toXY(i: number, v: number) {
  const x = PAD.left + (i / (DATA.length - 1)) * CHART_W;
  const y = PAD.top + CHART_H - ((v - MIN) / (MAX - MIN)) * CHART_H;
  return { x, y };
}

export function ConversionChart() {
  const pts = DATA.map((d, i) => toXY(i, d.rate));

  // polyline stroke path
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // closed area fill
  const first = pts[0];
  const last = pts[pts.length - 1];
  const bottom = PAD.top + CHART_H;
  const areaPath = `${linePath} L ${last.x} ${bottom} L ${first.x} ${bottom} Z`;

  return (
    <div className="rounded-2xl bg-[#141420] border border-white/8 p-6">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-white">Конверсии</h3>
        <p className="text-xs text-white/40 mt-0.5">(+43%) по сравнению с прошлым годом</p>
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7c3aed" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0}    />
          </linearGradient>
        </defs>

        {/* Сетка */}
        {TICKS.map((t) => {
          const y = PAD.top + CHART_H - ((t - MIN) / (MAX - MIN)) * CHART_H;
          return (
            <g key={t}>
              <line x1={PAD.left} y1={y} x2={PAD.left + CHART_W} y2={y}
                stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <text x={PAD.left - 6} y={y} textAnchor="end" dominantBaseline="middle"
                fill="rgba(255,255,255,0.3)" fontSize={9}>{t}</text>
            </g>
          );
        })}

        {/* Область */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Линия */}
        <path d={linePath} fill="none" stroke="#7c3aed" strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Точки */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.5}
            fill="#7c3aed" stroke="#141420" strokeWidth={1.5} />
        ))}

        {/* Подписи X */}
        {DATA.map((d, i) => {
          const { x } = toXY(i, 0);
          return (
            <text key={d.month} x={x} y={PAD.top + CHART_H + 15} textAnchor="middle"
              fill="rgba(255,255,255,0.3)" fontSize={9}>{d.month}</text>
          );
        })}
      </svg>
    </div>
  );
}
