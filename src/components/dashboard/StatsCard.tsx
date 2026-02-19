'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;  // процент, например 2.6 или -0.1
  icon: ReactNode;
  /** Tailwind gradient классы для фона */
  gradient: string;
  /** Tailwind цвет иконки */
  iconBg: string;
  /** sparkline данные (7 значений) */
  sparkline: number[];
  sparkColor: string;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 36;
  const step = w / (data.length - 1);

  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline
        points={points}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  gradient,
  iconBg,
  sparkline,
  sparkColor,
}: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <div className={`relative rounded-2xl p-5 overflow-hidden ${gradient}`}>
      {/* Шапка */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'text-emerald-600 bg-emerald-500/15' : 'text-red-500 bg-red-500/15'}`}>
          {isPositive
            ? <TrendingUp className="w-3 h-3" />
            : <TrendingDown className="w-3 h-3" />
          }
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>

      {/* Значение */}
      <p className="text-sm text-black/50 font-medium mb-0.5">{title}</p>
      <p className="text-2xl font-bold text-black/80">{value}</p>

      {/* Sparkline */}
      <div className="absolute bottom-4 right-4 opacity-70">
        <Sparkline data={sparkline} color={sparkColor} />
      </div>
    </div>
  );
}
