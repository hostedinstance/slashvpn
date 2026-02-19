'use client';

import { useState } from 'react';
import { Shield, ShieldOff, Clock, Lock, Zap, Globe } from 'lucide-react';

type Status = 'connected' | 'disconnected' | 'connecting';

const STATUS_CONFIG = {
  connected: {
    ring:   'from-emerald-500/30 via-emerald-500/10 to-transparent',
    dot:    'bg-emerald-500',
    pulse:  'bg-emerald-500/30',
    label:  'Подключено',
    color:  'text-emerald-400',
    btn:    'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
    btnTxt: 'Отключить',
  },
  disconnected: {
    ring:   'from-white/10 via-white/5 to-transparent',
    dot:    'bg-white/30',
    pulse:  'transparent',
    label:  'Не подключено',
    color:  'text-white/40',
    btn:    'from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500',
    btnTxt: 'Подключить',
  },
  connecting: {
    ring:   'from-amber-500/30 via-amber-500/10 to-transparent',
    dot:    'bg-amber-400',
    pulse:  'bg-amber-500/30',
    label:  'Подключение...',
    color:  'text-amber-400',
    btn:    'from-amber-600 to-orange-600',
    btnTxt: 'Подключение...',
  },
};

interface InfoRowProps { icon: React.ReactNode; label: string; value: string; dim?: boolean }
function InfoRow({ icon, label, value, dim }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-white/40">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className={`text-xs font-medium ${dim ? 'text-white/30' : 'text-white/80'}`}>{value}</span>
    </div>
  );
}

export function VpnConnectCard() {
  const [status, setStatus] = useState<Status>('disconnected');
  const [killSwitch, setKillSwitch] = useState(true);
  const [sessionTime, setSessionTime] = useState('00:00:00');

  const cfg = STATUS_CONFIG[status];

  const toggle = () => {
    if (status === 'disconnected') {
      setStatus('connecting');
      setTimeout(() => { setStatus('connected'); setSessionTime('00:00:01'); }, 1800);
    } else if (status === 'connected') {
      setStatus('disconnected');
      setSessionTime('00:00:00');
    }
  };

  return (
    <div className="rounded-2xl bg-[#141420] border border-white/8 p-6">
      {/* Статус-заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            {status !== 'disconnected' && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${cfg.pulse}`} />
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cfg.dot}`} />
          </span>
          <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
        </div>
        {/* Kill Switch */}
        <button
          onClick={() => setKillSwitch(!killSwitch)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${
            killSwitch
              ? 'bg-violet-600/20 border-violet-500/30 text-violet-300'
              : 'bg-white/5 border-white/10 text-white/30'
          }`}
        >
          <Zap className="w-3 h-3" />
          Kill Switch {killSwitch ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Большая кнопка */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Кольца */}
        <div className={`absolute w-36 h-36 rounded-full bg-gradient-to-b ${cfg.ring}`} />
        <div className={`absolute w-28 h-28 rounded-full bg-gradient-to-b ${cfg.ring} opacity-60`} />
        <button
          onClick={toggle}
          disabled={status === 'connecting'}
          className={`relative z-10 w-24 h-24 rounded-full bg-gradient-to-br ${cfg.btn} text-white font-semibold text-sm shadow-xl transition-all duration-300 flex items-center justify-center disabled:cursor-wait`}
        >
          {status === 'connecting' ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : status === 'connected' ? (
            <ShieldOff className="w-8 h-8" />
          ) : (
            <Shield className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* Инфо */}
      <div className="space-y-2.5">
        <InfoRow
          icon={<Globe className="w-3.5 h-3.5" />}
          label="IP адрес"
          value={status === 'connected' ? '185.220.101.47' : '—'}
          dim={status !== 'connected'}
        />
        <InfoRow
          icon={<Globe className="w-3.5 h-3.5" />}
          label="Сервер"
          value={status === 'connected' ? '🇩🇪 Германия, Франкфурт' : '—'}
          dim={status !== 'connected'}
        />
        <InfoRow
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Время сессии"
          value={status === 'connected' ? sessionTime : '—'}
          dim={status !== 'connected'}
        />
        <InfoRow
          icon={<Lock className="w-3.5 h-3.5" />}
          label="Шифрование"
          value="AES-256-GCM"
        />
      </div>

      {/* Кнопка */}
      <button
        onClick={toggle}
        disabled={status === 'connecting'}
        className={`mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r ${cfg.btn} text-white text-sm font-semibold transition-all duration-200 disabled:opacity-60`}
      >
        {cfg.btnTxt}
      </button>
    </div>
  );
}
