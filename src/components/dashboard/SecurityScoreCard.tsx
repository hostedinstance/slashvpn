'use client';

import { ShieldCheck, Eye, Wifi, Lock } from 'lucide-react';

const C = { card: '#010E38', raised: '#01144A', border: 'rgba(100,140,255,0.08)', text: 'rgba(230,238,255,0.96)', dim: 'rgba(180,205,255,0.45)' };

interface Check { label: string; status: 'ok' | 'warn' | 'fail'; detail: string; icon: React.ReactNode; }

const CHECKS: Check[] = [
  { label: 'DNS защита',    status: 'ok',   detail: 'Cloudflare 1.1.1.1',       icon: <Wifi className="w-4 h-4" /> },
  { label: 'Утечка WebRTC', status: 'ok',   detail: 'Утечек не обнаружено',     icon: <Eye className="w-4 h-4" /> },
  { label: 'Kill Switch',   status: 'warn', detail: 'Отключён — риск утечки',   icon: <Lock className="w-4 h-4" /> },
  { label: 'IPv6 утечка',   status: 'ok',   detail: 'Заблокировано',             icon: <ShieldCheck className="w-4 h-4" /> },
];

const ST = {
  ok:   { icon: '#34d399', bg: 'rgba(52,211,153,0.08)',   border: 'rgba(52,211,153,0.18)',  badge: '#34d399', lbl: 'OK' },
  warn: { icon: '#fbbf24', bg: 'rgba(251,191,36,0.08)',   border: 'rgba(251,191,36,0.20)',  badge: '#fbbf24', lbl: 'Внимание' },
  fail: { icon: '#f87171', bg: 'rgba(248,113,113,0.08)',  border: 'rgba(248,113,113,0.18)', badge: '#f87171', lbl: 'Угроза' },
};

function ScoreArc({ score }: { score: number }) {
  const R = 40, CX = 52, CY = 52, c = Math.PI * R;
  const color = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171';
  return (
    <svg width={104} height={60}>
      <path d={`M ${CX-R} ${CY} A ${R} ${R} 0 0 1 ${CX+R} ${CY}`} fill="none" stroke="rgba(100,140,255,0.10)" strokeWidth={8} strokeLinecap="round" />
      <path d={`M ${CX-R} ${CY} A ${R} ${R} 0 0 1 ${CX+R} ${CY}`} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} />
      <text x={CX} y={CY+2} textAnchor="middle" dominantBaseline="middle" fill="rgba(230,238,255,0.96)" fontSize={18} fontWeight={700}>{score}</text>
    </svg>
  );
}

export function SecurityScoreCard() {
  const passed = CHECKS.filter((c) => c.status === 'ok').length;
  const score = Math.round((passed / CHECKS.length) * 100);
  const overall = score === 100 ? 'ok' : score >= 75 ? 'warn' : 'fail';

  return (
    <div className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 mb-5">
        <ShieldCheck className="w-4 h-4" style={{ color: 'rgba(107,46,255,0.85)' }} />
        <h3 className="text-base font-semibold font-wix-madefor" style={{ color: C.text }}>Security Score</h3>
      </div>

      <div className="flex items-center gap-5 mb-5">
        <ScoreArc score={score} />
        <div>
          <p className="text-sm font-bold font-wix-madefor" style={{ color: ST[overall].badge }}>
            {overall === 'ok' ? 'Отлично' : overall === 'warn' ? 'Есть замечания' : 'Под угрозой'}
          </p>
          <p className="text-xs font-inter-tight mt-0.5" style={{ color: C.dim }}>
            {passed} из {CHECKS.length} проверок пройдено
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {CHECKS.map((ch) => {
          const s = ST[ch.status];
          return (
            <div key={ch.label} className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <span style={{ color: s.icon }}>{ch.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold font-inter-tight" style={{ color: C.text }}>{ch.label}</span>
                  <span className="text-[10px] font-bold font-inter-tight" style={{ color: s.badge }}>{s.lbl}</span>
                </div>
                <p className="text-[10px] font-inter-tight mt-0.5" style={{ color: C.dim }}>{ch.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
