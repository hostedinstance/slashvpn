'use client';

/** Bar chart — чистый SVG, без внешних зависимостей */

const DATA = [
  { month: 'Янв', a: 40,  b: 55 },
  { month: 'Фев', a: 20,  b: 70 },
  { month: 'Мар', a: 35,  b: 45 },
  { month: 'Апр', a: 38,  b: 42 },
  { month: 'Май', a: 60,  b: 65 },
  { month: 'Июн', a: 62,  b: 40 },
  { month: 'Июл', a: 58,  b: 35 },
  { month: 'Авг', a: 22,  b: 60 },
  { month: 'Сен', a: 48,  b: 25 },
];

const W = 480; const H = 220;
const PAD = { top: 10, right: 10, bottom: 28, left: 28 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;
const MAX = 100;
const TICKS = [0, 20, 40, 60, 80, 100];

const groupW = CHART_W / DATA.length;
const barW = Math.max((groupW / 2) * 0.42, 6);
const gap = 3;

export function WebsiteVisitsChart() {
  return (
    <div className="rounded-2xl bg-[#141420] border border-white/8 p-6">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-white">Визиты на сайт</h3>
        <p className="text-xs text-white/40 mt-0.5">(+43%) по сравнению с прошлым годом</p>
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        {/* Сетка */}
        {TICKS.map((t) => {
          const y = PAD.top + CHART_H - (t / MAX) * CHART_H;
          return (
            <g key={t}>
              <line x1={PAD.left} y1={y} x2={PAD.left + CHART_W} y2={y}
                stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <text x={PAD.left - 4} y={y} textAnchor="end" dominantBaseline="middle"
                fill="rgba(255,255,255,0.3)" fontSize={9}>{t}</text>
            </g>
          );
        })}

        {/* Бары */}
        {DATA.map((d, i) => {
          const cx = PAD.left + groupW * i + groupW / 2;
          const hA = (d.a / MAX) * CHART_H;
          const hB = (d.b / MAX) * CHART_H;
          const yA = PAD.top + CHART_H - hA;
          const yB = PAD.top + CHART_H - hB;
          return (
            <g key={d.month}>
              <rect x={cx - barW - gap / 2} y={yA} width={barW} height={hA}
                fill="#1e3a8a" rx={3} />
              <rect x={cx + gap / 2} y={yB} width={barW} height={hB}
                fill="#93c5fd" rx={3} />
              <text x={cx} y={PAD.top + CHART_H + 14} textAnchor="middle"
                fill="rgba(255,255,255,0.3)" fontSize={9}>{d.month}</text>
            </g>
          );
        })}
      </svg>

      {/* Легенда */}
      <div className="flex gap-5 mt-1">
        {[{ label: 'Команда A', color: '#1e3a8a' }, { label: 'Команда B', color: '#93c5fd' }].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: l.color }} />
            <span className="text-xs text-white/60">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
