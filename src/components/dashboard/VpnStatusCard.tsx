'use client';

import { Wifi, WifiOff, Server, Globe } from 'lucide-react';

interface VpnServer {
  country: string;
  flag: string;
  ping: number;
  load: number;
}

const SERVERS: VpnServer[] = [
  { country: 'Германия',   flag: '🇩🇪', ping: 12,  load: 34 },
  { country: 'США',        flag: '🇺🇸', ping: 89,  load: 67 },
  { country: 'Нидерланды', flag: '🇳🇱', ping: 18,  load: 22 },
  { country: 'Япония',     flag: '🇯🇵', ping: 142, load: 45 },
];

function LoadBar({ value }: { value: number }) {
  const color = value < 40 ? '#22c55e' : value < 70 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-white/40 w-7 text-right">{value}%</span>
    </div>
  );
}

export function VpnStatusCard() {
  return (
    <div className="rounded-2xl bg-[#141420] border border-white/8 p-6">
      {/* Статус */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-white">VPN Серверы</h3>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400">Активен</span>
        </div>
      </div>

      {/* Список серверов */}
      <div className="space-y-3">
        {SERVERS.map((server) => (
          <div key={server.country} className="group">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-xl leading-none">{server.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80 font-medium">{server.country}</span>
                  <span className="text-xs text-white/40">{server.ping} мс</span>
                </div>
                <LoadBar value={server.load} />
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 px-2.5 py-1 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400 text-xs font-medium">
                Подключить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/8 flex items-center gap-4 text-xs text-white/40">
        <div className="flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5" />
          <span>50+ серверов</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          <span>30 стран</span>
        </div>
      </div>
    </div>
  );
}
