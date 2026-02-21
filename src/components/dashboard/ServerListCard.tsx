'use client';

import { useState } from 'react';
import { Search, Star, Zap, ChevronRight } from 'lucide-react';

const C = {
  card: '#010E38', raised: '#01144A', border: 'rgba(100,140,255,0.08)',
  borderHover: 'rgba(140,170,255,0.18)', accent: '#6B2EFF',
  text: 'rgba(230,238,255,0.96)', dim: 'rgba(180,205,255,0.45)',
};

interface Server {
  id: string; country: string; city: string; flag: string;
  ping: number; load: number; favorite: boolean; premium?: boolean;
}

const SERVERS: Server[] = [
  { id: 'nl1', country: 'Нидерланды', city: 'Амстердам',  flag: '🇳🇱', ping: 18,  load: 22, favorite: true  },
  { id: 'de1', country: 'Германия',   city: 'Франкфурт', flag: '🇩🇪', ping: 24,  load: 34, favorite: true  },
  { id: 'se1', country: 'Швеция',     city: 'Стокгольм', flag: '🇸🇪', ping: 32,  load: 18, favorite: false },
  { id: 'fi1', country: 'Финляндия',  city: 'Хельсинки', flag: '🇫🇮', ping: 28,  load: 15, favorite: false },
  { id: 'us1', country: 'США',        city: 'Нью-Йорк',  flag: '🇺🇸', ping: 89,  load: 67, favorite: false, premium: true },
];

function PingBadge({ ping }: { ping: number }) {
  const color = ping < 40 ? '#34d399' : ping < 80 ? '#fbbf24' : '#f87171';
  return <span className="text-[11px] font-semibold font-inter-tight" style={{ color }}>{ping}мс</span>;
}

function LoadBar({ load }: { load: number }) {
  const bg = load < 40 ? '#34d399' : load < 70 ? '#fbbf24' : '#f87171';
  return (
    <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(100,140,255,0.12)' }}>
      <div className="h-full rounded-full" style={{ width: `${load}%`, background: bg }} />
    </div>
  );
}

export function ServerListCard() {
  const [query, setQuery] = useState('');
  const [showFav, setShowFav] = useState(false);
  const [connected, setConnected] = useState('nl1');
  const [favs, setFavs] = useState<Set<string>>(new Set(['nl1', 'de1']));

  const filtered = SERVERS.filter((s) => {
    const q = query.toLowerCase();
    return (s.country.toLowerCase().includes(q) || s.city.toLowerCase().includes(q))
      && (!showFav || favs.has(s.id));
  });

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavs((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div className="rounded-2xl p-6 flex flex-col" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold font-wix-madefor" style={{ color: C.text }}>Выбор сервера</h3>
        <button
          onClick={() => setShowFav(!showFav)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-inter-tight transition-all duration-200"
          style={{
            border: `1px solid ${showFav ? 'rgba(251,191,36,0.35)' : C.border}`,
            background: showFav ? 'rgba(251,191,36,0.10)' : 'rgba(100,140,255,0.05)',
            color: showFav ? '#fbbf24' : C.dim,
          }}
        >
          <Star className="w-3 h-3" />Избранные
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: C.dim }} />
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск страны или города..."
          className="w-full pl-8 pr-3 py-2 text-xs font-inter-tight rounded-xl focus:outline-none transition-all duration-200"
          style={{
            background: C.raised, border: `1px solid ${C.border}`,
            color: C.text,
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(107,46,255,0.40)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
        />
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-3 px-2 mb-1" style={{ color: 'rgba(140,175,255,0.28)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        <span className="flex-1">Сервер</span>
        <span className="w-10 text-right">Пинг</span>
        <span className="w-12 text-right">Нагр.</span>
        <span className="w-4" />
      </div>

      {/* Server list */}
      <div className="flex-1 space-y-0.5 max-h-56 overflow-y-auto pr-1">
        {filtered.map((s) => {
          const active = connected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setConnected(s.id)}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-xl text-left transition-all duration-200"
              style={{
                background: active ? 'rgba(107,46,255,0.16)' : 'transparent',
                border: `1px solid ${active ? 'rgba(107,46,255,0.30)' : 'transparent'}`,
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(100,140,255,0.06)'; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span className="text-lg leading-none">{s.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold font-inter-tight leading-tight"
                  style={{ color: active ? 'rgba(180,160,255,0.95)' : C.text }}>{s.country}</p>
                <p className="text-[10px] font-inter-tight truncate" style={{ color: 'rgba(140,175,255,0.35)' }}>{s.city}</p>
              </div>
              {s.premium && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold font-inter-tight"
                  style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.20)', color: '#fbbf24' }}>
                  <Zap className="w-2.5 h-2.5" />PRO
                </span>
              )}
              <PingBadge ping={s.ping} />
              <LoadBar load={s.load} />
              <button onClick={(e) => toggleFav(s.id, e)}
                className="shrink-0 transition-colors duration-200"
                style={{ color: favs.has(s.id) ? '#fbbf24' : 'rgba(140,175,255,0.20)' }}>
                <Star className="w-3.5 h-3.5" fill={favs.has(s.id) ? 'currentColor' : 'none'} />
              </button>
            </button>
          );
        })}
      </div>

      {/* Auto-select */}
      <button
        className="mt-3 flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-200 group"
        style={{ background: C.raised, border: `1px solid ${C.border}` }}
        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = C.borderHover}
        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = C.border}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" style={{ color: 'rgba(107,46,255,0.8)' }} />
          <span className="text-xs font-inter-tight" style={{ color: C.dim }}>Автовыбор оптимального сервера</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5" style={{ color: 'rgba(140,175,255,0.25)' }} />
      </button>
    </div>
  );
}
