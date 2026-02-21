'use client';

import { useState } from 'react';
import { Download, Upload, Activity } from 'lucide-react';

const C = { card: '#010E38', raised: '#01144A', border: 'rgba(100,140,255,0.08)', accent: '#6B2EFF', text: 'rgba(230,238,255,0.96)', dim: 'rgba(180,205,255,0.45)' };

const PERIODS = ['7 дней', '30 дней', '3 месяца'] as const;
const DATA_7 = [
  { label: 'Пн', dl: 420, ul: 120 }, { label: 'Вт', dl: 680, ul: 210 },
  { label: 'Ср', dl: 310, ul: 95  }, { label: 'Чт', dl: 890, ul: 280 },
  { label: 'Пт', dl: 560, ul: 175 }, { label: 'Сб', dl: 240, ul: 70  },
  { label: 'Вс', dl: 720, ul: 230 },
];

function AreaChart({ data }: { data: typeof DATA_7 }) {
  const W = 440, H = 100, P = { t: 8, r: 8, b: 20, l: 4 };
  const CW = W - P.l - P.r, CH = H - P.t - P.b;
  const maxVal = Math.max(...data.map((d) => d.dl)) * 1.15;
  const xy = (i: number, v: number) => ({ x: P.l + (i / (data.length - 1)) * CW, y: P.t + CH - (v / maxVal) * CH });
  const dlPts = data.map((d, i) => xy(i, d.dl));
  const ulPts = data.map((d, i) => xy(i, d.ul));
  const buildArea = (pts: { x: number; y: number }[]) => {
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return `${line} L ${pts[pts.length - 1].x} ${P.t + CH} L ${pts[0].x} ${P.t + CH} Z`;
  };
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="dlG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B2EFF" stopOpacity={0.40} />
          <stop offset="100%" stopColor="#6B2EFF" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="ulG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(100,180,255,1)" stopOpacity={0.25} />
          <stop offset="100%" stopColor="rgba(100,180,255,1)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={buildArea(dlPts)} fill="url(#dlG)" />
      <path d={buildArea(ulPts)} fill="url(#ulG)" />
      <polyline points={dlPts.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#6B2EFF" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={ulPts.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="rgba(100,160,255,0.8)" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const { x } = xy(i, 0);
        return <text key={d.label} x={x} y={H - 4} textAnchor="middle" fill="rgba(140,175,255,0.28)" fontSize={9}>{d.label}</text>;
      })}
    </svg>
  );
}

const fmtMb = (mb: number) => mb >= 1024 ? `${(mb / 1024).toFixed(1)} ГБ` : `${mb} МБ`;

export function TrafficStatsCard() {
  const [period, setPeriod] = useState<typeof PERIODS[number]>('7 дней');
  const data = DATA_7;
  const totalDl = data.reduce((s, d) => s + d.dl, 0);
  const totalUl = data.reduce((s, d) => s + d.ul, 0);

  return (
    <div className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" style={{ color: 'rgba(107,46,255,0.85)' }} />
          <h3 className="text-base font-semibold font-wix-madefor" style={{ color: C.text }}>Использование трафика</h3>
        </div>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium font-inter-tight transition-all duration-200"
              style={{
                background: period === p ? 'rgba(107,46,255,0.18)' : 'transparent',
                border: `1px solid ${period === p ? 'rgba(107,46,255,0.35)' : 'transparent'}`,
                color: period === p ? 'rgba(180,160,255,0.95)' : C.dim,
              }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5 mb-4">
        {[
          { bar: '#6B2EFF', icon: <Download className="w-3 h-3" />, lbl: 'Загружено', val: fmtMb(totalDl) },
          { bar: 'rgba(100,160,255,0.8)', icon: <Upload className="w-3 h-3" />, lbl: 'Отправлено', val: fmtMb(totalUl) },
        ].map(({ bar, icon, lbl, val }) => (
          <div key={lbl} className="flex items-center gap-2">
            <div className="w-1.5 h-8 rounded-full" style={{ background: bar }} />
            <div>
              <p className="text-[10px] font-inter-tight flex items-center gap-1" style={{ color: C.dim }}>{icon}{lbl}</p>
              <p className="text-sm font-bold font-wix-madefor" style={{ color: C.text }}>{val}</p>
            </div>
          </div>
        ))}
        <div className="ml-auto text-right">
          <p className="text-[10px] font-inter-tight" style={{ color: C.dim }}>Всего</p>
          <p className="text-sm font-bold font-wix-madefor" style={{ color: C.text }}>{fmtMb(totalDl + totalUl)}</p>
        </div>
      </div>

      <AreaChart data={data} />
    </div>
  );
}
