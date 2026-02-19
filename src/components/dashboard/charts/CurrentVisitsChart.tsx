'use client';

/** Pie chart — чистый SVG, без внешних зависимостей */

const DATA = [
  { name: 'Америка', value: 43.8, color: '#4361ee' },
  { name: 'Азия',    value: 31.3, color: '#f4a261' },
  { name: 'Европа',  value: 18.8, color: '#7c3aed' },
  { name: 'Африка',  value: 6.3,  color: '#ef4444' },
];

interface SliceProps {
  cx: number; cy: number; r: number;
  startAngle: number; endAngle: number;
  color: string; label: string; percent: number;
}

function PieSlice({ cx, cy, r, startAngle, endAngle, color, label, percent }: SliceProps) {
  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const large = endAngle - startAngle > 180 ? 1 : 0;
  const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;

  // Метка посередине сектора
  const mid = startAngle + (endAngle - startAngle) / 2;
  const lx = cx + r * 0.62 * Math.cos(toRad(mid));
  const ly = cy + r * 0.62 * Math.sin(toRad(mid));

  return (
    <g>
      <path d={d} fill={color} stroke="#141420" strokeWidth={2} />
      {percent > 5 && (
        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
          fill="white" fontSize={11} fontWeight={700}>
          {percent}%
        </text>
      )}
    </g>
  );
}

export function CurrentVisitsChart() {
  const cx = 130; const cy = 130; const r = 110;
  let cursor = 0;

  return (
    <div className="rounded-2xl bg-[#141420] border border-white/8 p-6">
      <h3 className="text-base font-semibold text-white mb-4">Текущие визиты</h3>

      <div className="flex flex-col items-center gap-4">
        <svg width={260} height={260} viewBox="0 0 260 260">
          {DATA.map((d) => {
            const start = cursor;
            const sweep = (d.value / 100) * 360;
            cursor += sweep;
            return (
              <PieSlice key={d.name}
                cx={cx} cy={cy} r={r}
                startAngle={start} endAngle={cursor}
                color={d.color} label={d.name} percent={d.value}
              />
            );
          })}
        </svg>

        {/* Легенда */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {DATA.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: d.color }} />
              <span className="text-xs text-white/60">{d.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
