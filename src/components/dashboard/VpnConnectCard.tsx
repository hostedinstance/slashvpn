'use client';

import { useState } from 'react';
import { Shield, ShieldOff, Clock, Lock, Zap, Globe } from 'lucide-react';

// Цвета проекта
const C = {
  card:   '#010E38',
  raised: '#01144A',
  border: 'rgba(100,140,255,0.08)',
  accent: '#6B2EFF',
  text:   'rgba(230,238,255,0.96)',
  dim:    'rgba(180,205,255,0.45)',
};

type Status = 'connected' | 'disconnected' | 'connecting';

const CFG = {
  connected: {
    ringColor: 'rgba(52,211,153,0.25)',
    dot: '#34d399',
    label: 'Подключено',
    labelColor: '#34d399',
    btnBg: 'linear-gradient(135deg, #059669, #34d399)',
    btnShadow: '0 6px 24px rgba(52,211,153,0.35)',
    btnTxt: 'Отключить',
  },
  disconnected: {
    ringColor: 'rgba(107,46,255,0.18)',
    dot: 'rgba(180,205,255,0.35)',
    label: 'Не подключено',
    labelColor: C.dim,
    btnBg: 'linear-gradient(135deg, #6B2EFF, #4A1FBE)',
    btnShadow: '0 6px 24px rgba(107,46,255,0.40)',
    btnTxt: 'Подключить',
  },
  connecting: {
    ringColor: 'rgba(251,191,36,0.20)',
    dot: '#fbbf24',
    label: 'Подключение...',
    labelColor: '#fbbf24',
    btnBg: 'linear-gradient(135deg, #d97706, #fbbf24)',
    btnShadow: '0 6px 24px rgba(251,191,36,0.30)',
    btnTxt: 'Подключение...',
  },
};

function InfoRow({ icon, label, value, dim }: { icon: React.ReactNode; label: string; value: string; dim?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2" style={{ color: C.dim }}>
        {icon}
        <span className="text-xs font-inter-tight">{label}</span>
      </div>
      <span className="text-xs font-medium font-inter-tight" style={{ color: dim ? 'rgba(140,175,255,0.28)' : C.text }}>
        {value}
      </span>
    </div>
  );
}

export function VpnConnectCard() {
  const [status, setStatus] = useState<Status>('disconnected');
  const [killSwitch, setKillSwitch] = useState(true);
  const [sessionTime] = useState('00:00:00');
  const cfg = CFG[status];

  const toggle = () => {
    if (status === 'disconnected') {
      setStatus('connecting');
      setTimeout(() => setStatus('connected'), 1800);
    } else if (status === 'connected') {
      setStatus('disconnected');
    }
  };

  return (
    <div className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            {status !== 'disconnected' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ background: cfg.dot }} />
            )}
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: cfg.dot }} />
          </span>
          <span className="text-sm font-semibold font-inter-tight" style={{ color: cfg.labelColor }}>{cfg.label}</span>
        </div>
        <button
          onClick={() => setKillSwitch(!killSwitch)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-inter-tight transition-all duration-200"
          style={{
            border: `1px solid ${killSwitch ? 'rgba(107,46,255,0.35)' : C.border}`,
            background: killSwitch ? 'rgba(107,46,255,0.14)' : 'rgba(255,255,255,0.04)',
            color: killSwitch ? 'rgba(180,160,255,0.9)' : C.dim,
          }}
        >
          <Zap className="w-3 h-3" />
          Kill Switch {killSwitch ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Big connect button + rings */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-36 h-36 rounded-full opacity-40"
          style={{ background: `radial-gradient(circle, ${cfg.ringColor}, transparent 70%)` }} />
        <div className="absolute w-28 h-28 rounded-full opacity-25"
          style={{ background: `radial-gradient(circle, ${cfg.ringColor}, transparent 70%)` }} />
        <button
          onClick={toggle}
          disabled={status === 'connecting'}
          className="relative z-10 w-24 h-24 rounded-full text-white font-semibold text-sm flex items-center justify-center transition-all duration-300 disabled:cursor-wait"
          style={{ background: cfg.btnBg, boxShadow: cfg.btnShadow }}
        >
          {status === 'connecting'
            ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : status === 'connected'
            ? <ShieldOff className="w-8 h-8" />
            : <Shield className="w-8 h-8" />}
        </button>
      </div>

      {/* Info rows */}
      <div className="space-y-2.5 mb-5">
        <InfoRow icon={<Globe className="w-3.5 h-3.5" />} label="IP адрес"
          value={status === 'connected' ? '185.220.101.47' : '—'} dim={status !== 'connected'} />
        <InfoRow icon={<Globe className="w-3.5 h-3.5" />} label="Сервер"
          value={status === 'connected' ? '🇩🇪 Германия, Франкфурт' : '—'} dim={status !== 'connected'} />
        <InfoRow icon={<Clock className="w-3.5 h-3.5" />} label="Время сессии"
          value={status === 'connected' ? sessionTime : '—'} dim={status !== 'connected'} />
        <InfoRow icon={<Lock className="w-3.5 h-3.5" />} label="Шифрование" value="AES-256-GCM" />
      </div>

      {/* CTA button */}
      <button
        onClick={toggle}
        disabled={status === 'connecting'}
        className="w-full py-2.5 rounded-xl text-white text-sm font-semibold font-inter-tight transition-all duration-200 disabled:opacity-60"
        style={{ background: cfg.btnBg, boxShadow: cfg.btnShadow }}
        onMouseEnter={(e) => { if (status !== 'connecting') (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
      >
        {cfg.btnTxt}
      </button>
    </div>
  );
}
