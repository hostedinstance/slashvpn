'use client';

import { useState } from 'react';
import { Download, Upload, Activity } from 'lucide-react';

const PERIODS = ['7 дней', '30 дней', '3 месяца'] as const;

// Дни → { download MB, upload MB }
const DATA_7 = [
  { label: 'Пн', dl: 420, ul: 120 },
  { label: 'Вт', dl: 680, ul: 210 },
  { label: 'Ср', dl: 310, ul: 95  },
  { label: 'Чт', dl: 890, ul: 280 },
  { label: 'Пт', dl: 560, ul: 175 },
  { label: 'Сб', dl: 240, ul: 70  },
  { label: 'Вс', dl: 720, ul: 230 },
];

function AreaChart({ data, dlKey, ulKey }: {
  data: { label: string; dl: number; ul: number }[];
  dlKey: 'dl'; ulKey: 'ul';
}) {
  const W = 440; const H = 100;
  const PAD = { t: 8, r: 8, b: 20, l: 4 };
  const CW = W - PAD.l - PAD.r;
  const CH = H - PAD.t - PAD.b;
  const maxVal = Math.max(...data.map((d) => d[dlKey])) * 1.15;

  const xy = (i: number, v: number) => ({
    x: PAD.l + (i / (data.length - 1)) * CW,
    y: PAD.t + CH - (v / maxVal) * CH,
  });

  const dlPts = data.map((d, i) => xy(i, d[dlKey]));
  const ulPts = data.map((d, i) => xy(i, d[ulKey]));

  const buildArea = (pts: { x: number; y: number }[]) => {
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const last = pts[pts.length - 1];
    const first = pts[0];
    return `${line} L ${last.x} ${PAD.t + CH} L ${first.x} ${PAD.t + CH} Z`;
  };

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={buildArea(dlPts)} fill="url(#dlGrad)" />
      <path d={buildArea(ulPts)} fill="url(#ulGrad)" />
      <polyline points={dlPts.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none" stroke="#7c3aed" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={ulPts.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none" stroke="#06b6d4" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      {/* X-labels */}
      {data.map((d, i) => {
        const { x } = xy(i, 0);
        return <text key={d.label} x={x} y={H - 4} textAnchor="middle"
          fill="rgba(255,255,255,0.25)" fontSize={9}>{d.label}</text>;
      })}
    </svg>
  );
}

function fmtMb(mb: number) {
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} ГБ` : `${mb} МБ`;
}

export function TrafficStatsCard() {
  const [period, setPeriod] = useState<typeof PERIODS[number]>('7 дней');
  const data = DATA_7;
  const totalDl = data.reduce((s, d) => s + d.dl, 0);
  const totalUl = data.reduce((s, d) => s + d.ul, 0);

  return (
    <div className="rounded-2xl bg-[#141420] border border-white/8 p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-400" />
          <h3 className="text-base font-semibold text-white">Использование трафика</h3>
        </div>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                period === p
                  ? 'bg-violet-600/30 border border-violet-500/30 text-violet-300'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Итоги */}
      <div className="flex gap-5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-8 rounded-full bg-violet-600" />
          <div>
            <p className="text-[10px] text-white/30 flex items-center gap-1">
              <Download className="w-3 h-3" /> Загружено
            </p>
            <p className="text-sm font-bold text-white">{fmtMb(totalDl)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-8 rounded-full bg-cyan-500" />
          <div>
            <p className="text-[10px] text-white/30 flex items-center gap-1">
              <Upload className="w-3 h-3" /> Отправлено
            </p>
            <p className="text-sm font-bold text-white">{fmtMb(totalUl)}</p>
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[10px] text-white/30">Всего</p>
          <p className="text-sm font-bold text-white">{fmtMb(totalDl + totalUl)}</p>
        </div>
      </div>

      {/* График */}
      <AreaChart data={data} dlKey="dl" ulKey="ul" />
    </div>
  );
}
