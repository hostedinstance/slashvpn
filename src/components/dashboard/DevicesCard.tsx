'use client';

import { useState } from 'react';
import { Monitor, Smartphone, Tablet, Laptop, Trash2, Circle } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'laptop';
  os: string;
  lastSeen: string;
  online: boolean;
  current: boolean;
}

const DEVICES_INIT: Device[] = [
  { id: 'd1', name: 'MacBook Pro',    type: 'laptop',  os: 'macOS 14.4',    lastSeen: 'Сейчас',     online: true,  current: true  },
  { id: 'd2', name: 'iPhone 15',      type: 'mobile',  os: 'iOS 17.4',      lastSeen: '2 ч. назад', online: false, current: false },
  { id: 'd3', name: 'iPad Air',       type: 'tablet',  os: 'iPadOS 17',     lastSeen: 'вчера',      online: false, current: false },
];

const TYPE_ICON = {
  desktop: Monitor,
  mobile:  Smartphone,
  tablet:  Tablet,
  laptop:  Laptop,
};

const MAX_DEVICES = 1; // Free plan

export function DevicesCard({ plan = 'free' }: { plan?: 'free' | 'pro' }) {
  const [devices, setDevices] = useState<Device[]>(DEVICES_INIT);
  const limit = plan === 'pro' ? 5 : MAX_DEVICES;

  const remove = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="rounded-2xl bg-[#141420] border border-white/8 p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white">Устройства</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-white/40">{devices.length}/{limit}</span>
          <div className="flex gap-0.5">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className={`w-4 h-1.5 rounded-full ${i < devices.length ? 'bg-violet-500' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Список */}
      <div className="space-y-2">
        {devices.map((d) => {
          const Icon = TYPE_ICON[d.type];
          return (
            <div key={d.id}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-all ${
                d.current
                  ? 'bg-violet-600/10 border-violet-500/20'
                  : 'bg-white/3 border-white/5 hover:bg-white/5'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                d.current ? 'bg-violet-600/25' : 'bg-white/8'
              }`}>
                <Icon className={`w-4.5 h-4.5 ${d.current ? 'text-violet-400' : 'text-white/50'}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium text-white/90 truncate">{d.name}</p>
                  {d.current && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-violet-600/30 text-violet-300 font-semibold shrink-0">
                      ЭТО УСТРОЙСТВО
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Circle className={`w-1.5 h-1.5 shrink-0 ${d.online ? 'text-emerald-400 fill-emerald-400' : 'text-white/20 fill-white/20'}`} />
                  <p className="text-[10px] text-white/30 truncate">{d.os} · {d.lastSeen}</p>
                </div>
              </div>

              {!d.current && (
                <button
                  onClick={() => remove(d.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Лимит Free */}
      {plan === 'free' && devices.length >= limit && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-amber-500/8 border border-amber-500/15">
          <span className="text-[11px] text-amber-400/80">
            Лимит устройств для Free. Upgrade → до 5 устройств
          </span>
        </div>
      )}
    </div>
  );
}
