'use client';

import { useState } from 'react';
import { Monitor, Smartphone, Tablet, Laptop, Trash2, Circle } from 'lucide-react';

const C = { card: '#010E38', raised: '#01144A', border: 'rgba(100,140,255,0.08)', text: 'rgba(230,238,255,0.96)', dim: 'rgba(180,205,255,0.45)' };

interface Device { id: string; name: string; type: 'desktop'|'mobile'|'tablet'|'laptop'; os: string; lastSeen: string; online: boolean; current: boolean; }

const DEVICES_INIT: Device[] = [
  { id:'d1', name:'MacBook Pro',  type:'laptop', os:'macOS 14.4',  lastSeen:'Сейчас',     online:true,  current:true  },
  { id:'d2', name:'iPhone 15',    type:'mobile', os:'iOS 17.4',    lastSeen:'2 ч. назад', online:false, current:false },
  { id:'d3', name:'iPad Air',     type:'tablet', os:'iPadOS 17',   lastSeen:'вчера',       online:false, current:false },
];

const ICONS = { desktop: Monitor, mobile: Smartphone, tablet: Tablet, laptop: Laptop };
const MAX = 1;

export function DevicesCard({ plan = 'free' }: { plan?: 'free'|'pro' }) {
  const [devices, setDevices] = useState<Device[]>(DEVICES_INIT);
  const limit = plan === 'pro' ? 5 : MAX;

  return (
    <div className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold font-wix-madefor" style={{ color: C.text }}>Устройства</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-inter-tight" style={{ color: C.dim }}>{devices.length}/{limit}</span>
          <div className="flex gap-0.5">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="w-4 h-1.5 rounded-full"
                style={{ background: i < devices.length ? '#6B2EFF' : 'rgba(100,140,255,0.12)' }} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {devices.map((d) => {
          const Icon = ICONS[d.type];
          return (
            <div key={d.id} className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
              style={{
                background: d.current ? 'rgba(107,46,255,0.12)' : C.raised,
                border: `1px solid ${d.current ? 'rgba(107,46,255,0.25)' : C.border}`,
              }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: d.current ? 'rgba(107,46,255,0.22)' : 'rgba(100,140,255,0.08)' }}>
                <Icon className="w-4 h-4" style={{ color: d.current ? 'rgba(167,139,250,0.9)' : C.dim }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold font-inter-tight truncate" style={{ color: C.text }}>{d.name}</p>
                  {d.current && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-inter-tight shrink-0"
                      style={{ background: 'rgba(107,46,255,0.22)', color: 'rgba(180,160,255,0.9)' }}>
                      ЭТО УСТРОЙСТВО
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Circle className="w-1.5 h-1.5 shrink-0"
                    style={{ color: d.online ? '#34d399' : 'rgba(140,175,255,0.20)', fill: 'currentColor' }} />
                  <p className="text-[10px] font-inter-tight truncate" style={{ color: 'rgba(140,175,255,0.35)' }}>
                    {d.os} · {d.lastSeen}
                  </p>
                </div>
              </div>
              {!d.current && (
                <button onClick={() => setDevices((p) => p.filter((x) => x.id !== d.id))}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0"
                  style={{ color: 'rgba(140,175,255,0.25)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.10)'; (e.currentTarget as HTMLElement).style.color = '#f87171'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = 'rgba(140,175,255,0.25)'; }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {plan === 'free' && devices.length >= limit && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-xl"
          style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
          <span className="text-[11px] font-inter-tight" style={{ color: 'rgba(251,191,36,0.80)' }}>
            Лимит Free. Upgrade → до 5 устройств
          </span>
        </div>
      )}
    </div>
  );
}
