'use client';

import { useState, useEffect } from 'react';
import { Shield, Clock, Eye, EyeOff, Power } from 'lucide-react';

type VpnState = 'connected' | 'disconnected' | 'connecting';

const SERVERS = [
  { country: 'Германия',   code: 'de', ip: '185.220.101.47', flag: '🇩🇪' },
  { country: 'Нидерланды', code: 'nl', ip: '185.107.56.22',  flag: '🇳🇱' },
  { country: 'Швейцария',  code: 'ch', ip: '77.234.55.10',   flag: '🇨🇭' },
];

function formatTime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

const COLORS: Record<VpnState, { ring: string; glow: string; text: string; badge: string; label: string }> = {
  connected:    { ring: '#22c55e', glow: 'rgba(34,197,94,0.14)',  text: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400', label: 'Защищён' },
  connecting:   { ring: '#f59e0b', glow: 'rgba(245,158,11,0.14)', text: 'text-amber-400',   badge: 'bg-amber-500/10 border-amber-500/25 text-amber-400',     label: 'Подключение...' },
  disconnected: { ring: '#ef4444', glow: 'rgba(239,68,68,0.12)',  text: 'text-red-400',     badge: 'bg-red-500/10 border-red-500/25 text-red-400',           label: 'Не защищён' },
};

export function VpnStatusHero() {
  const [state, setState] = useState<VpnState>('disconnected');
  const [elapsed, setElapsed] = useState(0);
  const [ipVisible, setIpVisible] = useState(true);
  const [killSwitch, setKillSwitch] = useState(false);
  const [selectedServer, setSelectedServer] = useState(SERVERS[0]);

  useEffect(() => {
    if (state !== 'connected') { setElapsed(0); return; }
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  const handleToggle = () => {
    if (state === 'disconnected') {
      setState('connecting');
      setTimeout(() => setState('connected'), 1800);
    } else {
      setState('disconnected');
    }
  };

  const isConnected  = state === 'connected';
  const isConnecting = state === 'connecting';
  const c = COLORS[state];

  return (
    <div className="rounded-2xl bg-[#141420] border border-white/[0.07] overflow-hidden">
      <div className="relative p-6">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${c.glow} 0%, transparent 70%)` }} />

        <div className="relative flex flex-col lg:flex-row items-center gap-7">

          {/* Power button */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative">
              {isConnected && (
                <span className="absolute inset-[-10px] rounded-full animate-ping opacity-20"
                  style={{ border: `2px solid ${c.ring}` }} />
              )}
              <button onClick={handleToggle}
                className="relative w-[84px] h-[84px] rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  border: `2px solid ${c.ring}`,
                  boxShadow: `0 0 30px ${c.glow}, inset 0 0 20px ${c.glow}`,
                  background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`,
                }}
              >
                <Power className={`w-8 h-8 ${c.text} ${isConnecting ? 'animate-pulse' : ''}`} strokeWidth={1.8} />
              </button>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold ${c.badge}`}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.ring }} />
              {c.label}
            </div>
          </div>

          {/* Info grid */}
          <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-2.5">

            {/* IP */}
            <div className="col-span-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold block mb-1">IP адрес</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-mono text-white">
                  {isConnected
                    ? (ipVisible ? selectedServer.ip : '●●●.●●●.●●●.●●')
                    : (ipVisible ? '92.168.1.1' : '●●●.●●●.●●●.●')
                  }
                </span>
                <button onClick={() => setIpVisible(!ipVisible)} className="text-white/25 hover:text-white/50 transition-colors ml-1">
                  {ipVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
              {isConnected && <span className="text-[10px] text-emerald-400 mt-0.5 block">{selectedServer.flag} {selectedServer.country}</span>}
            </div>

            {/* Сессия */}
            <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3" /> Сессия
              </span>
              <span className="text-[13px] font-mono text-white">{isConnected ? formatTime(elapsed) : '—'}</span>
            </div>

            {/* Протокол */}
            <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold block mb-1">Протокол</span>
              <span className="text-[13px] font-mono text-white">WireGuard</span>
              <span className="text-[10px] text-white/35 block mt-0.5">AES-256-GCM</span>
            </div>

            {/* Kill Switch */}
            <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold flex items-center gap-1 mb-2">
                <Shield className="w-3 h-3" /> Kill Switch
              </span>
              <button onClick={() => setKillSwitch(!killSwitch)}
                className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${killSwitch ? 'bg-violet-600' : 'bg-white/10'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm ${killSwitch ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
              <span className="text-[10px] text-white/30 block mt-1">{killSwitch ? 'Включён' : 'Выключен'}</span>
            </div>

            {/* Серверы */}
            <div className="col-span-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold block mb-2">Сервер</span>
              <div className="flex items-center gap-2 flex-wrap">
                {SERVERS.map((s) => (
                  <button key={s.code} onClick={() => setSelectedServer(s)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] transition-all ${
                      selectedServer.code === s.code
                        ? 'bg-violet-600/25 border border-violet-500/40 text-white'
                        : 'bg-white/[0.04] border border-white/[0.06] text-white/45 hover:text-white/70'
                    }`}>
                    {s.flag} {s.country}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
