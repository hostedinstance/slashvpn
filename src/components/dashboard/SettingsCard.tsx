'use client';

import { useState } from 'react';
import { Wifi, Shield, Globe, Zap, ChevronDown } from 'lucide-react';

const C = { card: '#010E38', raised: '#01144A', border: 'rgba(100,140,255,0.08)', text: 'rgba(230,238,255,0.96)', dim: 'rgba(180,205,255,0.45)' };

const PROTOCOLS = ['WireGuard', 'OpenVPN UDP', 'OpenVPN TCP', 'IKEv2'];
const DNS_OPTIONS = ['Автоматически (Cloudflare)', '1.1.1.1 (Cloudflare)', '8.8.8.8 (Google)', 'Свой DNS'];

function Toggle({ value, onChange, disabled }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button onClick={() => !disabled && onChange(!value)}
      className="relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0"
      style={{ background: value ? '#6B2EFF' : 'rgba(100,140,255,0.14)', opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
        style={{ transform: value ? 'translateX(21px)' : 'translateX(2px)' }} />
    </button>
  );
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-inter-tight transition-all duration-200"
        style={{ background: C.raised, border: `1px solid ${C.border}`, color: C.dim }}>
        <span className="max-w-[130px] truncate">{value}</span>
        <ChevronDown className="w-3 h-3 shrink-0 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 rounded-xl shadow-xl overflow-hidden min-w-[160px]"
          style={{ background: '#010E38', border: `1px solid rgba(100,140,255,0.15)` }}>
          {options.map((o) => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }}
              className="w-full px-3 py-2 text-left text-xs font-inter-tight transition-colors duration-200"
              style={{ color: o === value ? 'rgba(180,160,255,0.95)' : C.dim, background: o === value ? 'rgba(107,46,255,0.12)' : 'transparent' }}
              onMouseEnter={(e) => { if (o !== value) (e.currentTarget as HTMLElement).style.background = 'rgba(100,140,255,0.06)'; }}
              onMouseLeave={(e) => { if (o !== value) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ icon, label, desc, control }: { icon: React.ReactNode; label: string; desc?: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b" style={{ borderColor: 'rgba(100,140,255,0.06)' }}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5" style={{ color: 'rgba(140,175,255,0.35)' }}>{icon}</span>
        <div>
          <p className="text-xs font-semibold font-inter-tight" style={{ color: C.text }}>{label}</p>
          {desc && <p className="text-[10px] font-inter-tight mt-0.5" style={{ color: 'rgba(140,175,255,0.30)' }}>{desc}</p>}
        </div>
      </div>
      {control}
    </div>
  );
}

export function SettingsCard({ plan = 'free' }: { plan?: 'free'|'pro' }) {
  const [auto, setAuto] = useState(true);
  const [kill, setKill] = useState(false);
  const [split, setSplit] = useState(false);
  const [proto, setProto] = useState('WireGuard');
  const [dns, setDns] = useState('Автоматически (Cloudflare)');

  return (
    <div className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <h3 className="text-base font-semibold font-wix-madefor mb-4" style={{ color: C.text }}>Настройки</h3>
      <div>
        <Row icon={<Zap className="w-4 h-4" />} label="Автоподключение" desc="При запуске приложения" control={<Toggle value={auto} onChange={setAuto} />} />
        <Row icon={<Shield className="w-4 h-4" />} label="Kill Switch" desc="Блокировать интернет при обрыве VPN" control={<Toggle value={kill} onChange={setKill} />} />
        <Row icon={<Wifi className="w-4 h-4" />} label="Split Tunneling" desc={plan === 'pro' ? 'Выбор приложений для VPN' : 'Только Pro'} control={<Toggle value={split} onChange={setSplit} disabled={plan !== 'pro'} />} />
        <Row icon={<Globe className="w-4 h-4" />} label="Протокол" desc="Протокол шифрования" control={<Select value={proto} options={PROTOCOLS} onChange={setProto} />} />
        <Row icon={<Globe className="w-4 h-4" />} label="DNS-сервер" desc="Сервер разрешения имён" control={<Select value={dns} options={DNS_OPTIONS} onChange={setDns} />} />
      </div>
    </div>
  );
}
