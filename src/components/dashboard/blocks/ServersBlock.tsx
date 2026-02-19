'use client';

import { useState } from 'react';
import { Search, Star, Zap, ArrowUpDown } from 'lucide-react';

interface Server {
  country: string;
  flag: string;
  ping: number;
  load: number;
  premium: boolean;
  favorite?: boolean;
}

const SERVERS: Server[] = [
  { country: 'Германия',    flag: '🇩🇪', ping: 12,  load: 34, premium: false, favorite: true },
  { country: 'Нидерланды', flag: '🇳🇱', ping: 18,  load: 22, premium: false },
  { country: 'США (NY)',    flag: '🇺🇸', ping: 89,  load: 67, premium: false },
  { country: 'Япония',      flag: '🇯🇵', ping: 142, load: 45, premium: true  },
  { country: 'Сингапур',    flag: '🇸🇬', ping: 96,  load: 55, premium: true  },
  { country: 'Великобритания', flag: '🇬🇧', ping: 34, load: 28, premium: false },
  { country: 'Франция',     flag: '🇫🇷', ping: 22,  load: 18, premium: false },
  { country: 'Швейцария',   flag: '🇨🇭', ping: 31,  load: 31, premium: true  },
];

function LoadBar({ value }: { value: number }) {
  const color = value < 40 ? '#22c55e' : value < 70 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1 bg-white/[0.08] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] text-white/35 w-6 text-right">{value}%</span>
    </div>
  );
}

function PingBadge({ ping }: { ping: number }) {
  const color = ping < 40 ? 'text-emerald-400' : ping < 100 ? 'text-amber-400' : 'text-red-400';
  return <span className={`text-[11px] font-mono font-semibold ${color} w-14 text-right`}>{ping} мс</span>;
}

export function ServersBlock({ isPro = false }: { isPro?: boolean }) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'ping' | 'load'>('ping');
  const [favOnly, setFavOnly] = useState(false);

  const filtered = SERVERS
    .filter((s) => s.country.toLowerCase().includes(query.toLowerCase()))
    .filter((s) => !favOnly || s.favorite)
    .sort((a, b) => a[sortBy] - b[sortBy]);

  return (
    <div className="rounded-2xl bg-[#141420] border border-white/[0.07] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-white">Серверы</h3>
        <span className="text-[11px] text-white/30">{SERVERS.length} локаций</span>
      </div>

      {/* Контролы */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск страны..."
            className="w-full pl-8 pr-3 py-2 text-[12px] bg-white/[0.04] border border-white/[0.06] rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-violet-500/40"
          />
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'ping' ? 'load' : 'ping')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 text-[11px] transition-colors whitespace-nowrap"
        >
          <ArrowUpDown className="w-3 h-3" />
          {sortBy === 'ping' ? 'Пинг' : 'Нагрузка'}
        </button>
        <button
          onClick={() => setFavOnly(!favOnly)}
          className={`p-2 rounded-lg border transition-colors ${favOnly ? 'bg-amber-500/15 border-amber-500/25 text-amber-400' : 'bg-white/[0.04] border-white/[0.06] text-white/30 hover:text-white/60'}`}
        >
          <Star className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Список */}
      <div className="space-y-0.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
        {filtered.map((server) => (
          <div key={server.country}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
            <span className="text-lg leading-none">{server.flag}</span>
            <span className="flex-1 text-[13px] text-white/75 group-hover:text-white transition-colors">{server.country}</span>

            {server.premium && !isPro && (
              <span className="flex items-center gap-0.5 text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded-md font-semibold">
                <Zap className="w-2.5 h-2.5" /> Pro
              </span>
            )}
            {server.favorite && (
              <Star className="w-3 h-3 text-amber-400 fill-amber-400/50" />
            )}

            <LoadBar value={server.load} />
            <PingBadge ping={server.ping} />

            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] px-2.5 py-1 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400 font-medium whitespace-nowrap">
              {server.premium && !isPro ? 'Upgrade' : 'Подкл.'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
