'use client';

import { useState } from 'react';
import { Wifi, Shield, Globe, Zap, ChevronDown } from 'lucide-react';

const PROTOCOLS = ['WireGuard', 'OpenVPN UDP', 'OpenVPN TCP', 'IKEv2'];
const DNS_OPTIONS = ['Автоматически (Cloudflare)', '1.1.1.1 (Cloudflare)', '8.8.8.8 (Google)', 'Свой DNS'];

function Toggle({ value, onChange, disabled }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      } ${value ? 'bg-violet-600' : 'bg-white/15'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
        value ? 'translate-x-5' : 'translate-x-0.5'
      }`} />
    </button>
  );
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 hover:text-white hover:border-white/20 transition-all"
      >
        <span className="max-w-[130px] truncate">{value}</span>
        <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-[#1e1e2e] border border-white/12 rounded-xl shadow-xl overflow-hidden min-w-[160px]">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false); }}
              className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                o === value ? 'text-violet-300 bg-violet-600/15' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  control: React.ReactNode;
}

function SettingRow({ icon, label, description, control }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-white/35">{icon}</span>
        <div>
          <p className="text-xs font-medium text-white/80">{label}</p>
          {description && <p className="text-[10px] text-white/30 mt-0.5">{description}</p>}
        </div>
      </div>
      {control}
    </div>
  );
}

export function SettingsCard({ plan = 'free' }: { plan?: 'free' | 'pro' }) {
  const [autoConnect, setAutoConnect] = useState(true);
  const [killSwitch, setKillSwitch] = useState(false);
  const [splitTunnel, setSplitTunnel] = useState(false);
  const [protocol, setProtocol] = useState('WireGuard');
  const [dns, setDns] = useState('Автоматически (Cloudflare)');
  const isPro = plan === 'pro';

  return (
    <div className="rounded-2xl bg-[#141420] border border-white/8 p-6">
      <h3 className="text-base font-semibold text-white mb-4">Настройки</h3>

      <div className="divide-y divide-white/0">
        <SettingRow
          icon={<Zap className="w-4 h-4" />}
          label="Автоподключение"
          description="Подключаться при запуске приложения"
          control={<Toggle value={autoConnect} onChange={setAutoConnect} />}
        />
        <SettingRow
          icon={<Shield className="w-4 h-4" />}
          label="Kill Switch"
          description="Блокировать интернет при обрыве VPN"
          control={<Toggle value={killSwitch} onChange={setKillSwitch} />}
        />
        <SettingRow
          icon={<Wifi className="w-4 h-4" />}
          label="Split Tunneling"
          description={isPro ? 'Выберите приложения для VPN' : 'Только Pro'}
          control={<Toggle value={splitTunnel} onChange={setSplitTunnel} disabled={!isPro} />}
        />
        <SettingRow
          icon={<Globe className="w-4 h-4" />}
          label="Протокол"
          description="Протокол шифрования соединения"
          control={<Select value={protocol} options={PROTOCOLS} onChange={setProtocol} />}
        />
        <SettingRow
          icon={<Globe className="w-4 h-4" />}
          label="DNS-сервер"
          description="Сервер разрешения доменных имён"
          control={<Select value={dns} options={DNS_OPTIONS} onChange={setDns} />}
        />
      </div>
    </div>
  );
}
