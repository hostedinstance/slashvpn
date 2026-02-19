'use client';

import { useState } from 'react';
import { Search, Star, Zap, ChevronRight } from 'lucide-react';

interface Server {
  id: string;
  country: string;
  city: string;
  flag: string;
  ping: number;   // ms
  load: number;   // %
  favorite: boolean;
  premium?: boolean;
}

const SERVERS: Server[] = [
  { id: 'de1', country: 'Германия',    city: 'Франкфурт', flag: '🇩🇪', ping: 12,  load: 34, favorite: true  },
  { id: 'nl1', country: 'Нидерланды', city: 'Амстердам', flag: '🇳🇱', ping: 18,  load: 22, favorite: true  },
  { id: 'fi1', country: 'Финляндия',  city: 'Хельсинки', flag: '🇫🇮', ping: 28,  load: 15, favorite: false },
  { id: 'fr1', country: 'Франция',    city: 'Париж',     flag: '🇫🇷', ping: 35,  load: 48, favorite: false },
  { id: 'us1', country: 'США',        city: 'Нью-Йорк',  flag: '🇺🇸', ping: 89,  load: 67, favorite: false },
  { id: 'sg1', country: 'Сингапур',   city: 'Сингапур',  flag: '🇸🇬', ping: 112, load: 55, favorite: false, premium: true },
  { id: 'jp1', country: 'Япония',     city: 'Токио',     flag: '🇯🇵', ping: 142, load: 45, favorite: false, premium: true },
];

function PingBadge({ ping }: { ping: number }) {
  const color = ping < 40 ? 'text-emerald-400' : ping < 80 ? 'text-amber-400' : 'text-red-400';
  return <span className={`text-[11px] font-medium ${color}`}>{ping}мс</span>;
}

function LoadBar({ load }: { load: number }) {
  const bg = load < 40 ? '#22c55e' : load < 70 ? '#f59e0b' : '#ef4444';
  return (
    <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${load}%`, backgroundColor: bg }} />
    </div>
  );
}

export function ServerListCard() {
  const [query, setQuery] = useState('');
  const [showFav, setShowFav] = useState(false);
  const [connected, setConnected] = useState('de1');
  const [favs, setFavs] = useState<Set<string>>(new Set(['de1', 'nl1']));

  const filtered = SERVERS.filter((s) => {
    const q = query.toLowerCase();
    const match = s.country.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
    return match && (!showFav || favs.has(s.id));
  });

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavs((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div className="rounded-2xl bg-[#141420] border border-white/8 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white">Выбор сервера</h3>
        <button
          onClick={() => setShowFav(!showFav)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-all ${
            showFav
              ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
              : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
          }`}
        >
          <Star className="w-3 h-3" />
          Избранные
        </button>
      </div>

      {/* Поиск */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск страны или города..."
          className="w-full pl-8 pr-3 py-2 text-xs bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-violet-500/40 transition-colors"
        />
      </div>

      {/* Заголовок колонок */}
      <div className="flex items-center gap-3 px-2 mb-1.5 text-[10px] text-white/25 font-medium uppercase tracking-wider">
        <span className="flex-1">Сервер</span>
        <span className="w-10 text-right">Пинг</span>
        <span className="w-12 text-right">Нагрузка</span>
        <span className="w-4" />
      </div>

      {/* Список */}
      <div className="flex-1 space-y-0.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
        {filtered.map((s) => {
          const isActive = connected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setConnected(s.id)}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl text-left transition-all ${
                isActive ? 'bg-violet-600/20 border border-violet-500/25' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="text-lg leading-none">{s.flag}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium leading-tight ${isActive ? 'text-violet-300' : 'text-white/80'}`}>
                  {s.country}
                </p>
                <p className="text-[10px] text-white/30 truncate">{s.city}</p>
              </div>

              {s.premium && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/20 text-[9px] font-semibold text-amber-400">
                  <Zap className="w-2.5 h-2.5" />PRO
                </span>
              )}

              <PingBadge ping={s.ping} />
              <LoadBar load={s.load} />

              <button
                onClick={(e) => toggleFav(s.id, e)}
                className={`shrink-0 transition-colors ${favs.has(s.id) ? 'text-amber-400' : 'text-white/15 hover:text-white/40'}`}
              >
                <Star className="w-3.5 h-3.5" fill={favs.has(s.id) ? 'currentColor' : 'none'} />
              </button>
            </button>
          );
        })}
      </div>

      {/* Автовыбор */}
      <button className="mt-3 flex items-center justify-between w-full px-3 py-2 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors group">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">Автовыбор оптимального сервера</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
      </button>
    </div>
  );
}
