'use client';

import { ShieldCheck, ShieldAlert, AlertTriangle, Eye, Wifi, Lock } from 'lucide-react';

interface Check {
  label: string;
  status: 'ok' | 'warn' | 'fail';
  detail: string;
  icon: React.ReactNode;
}

const CHECKS: Check[] = [
  { label: 'DNS защита',      status: 'ok',   detail: 'Используется 1.1.1.1 (Cloudflare)', icon: <Wifi    className="w-4 h-4" /> },
  { label: 'Утечка WebRTC',   status: 'ok',   detail: 'Утечек не обнаружено',              icon: <Eye     className="w-4 h-4" /> },
  { label: 'Kill Switch',     status: 'warn', detail: 'Отключён — трафик не защищён',       icon: <Lock    className="w-4 h-4" /> },
  { label: 'IPv6 утечка',     status: 'ok',   detail: 'Заблокировано',                      icon: <ShieldCheck className="w-4 h-4" /> },
];

const STATUS_STYLE = {
  ok:   { icon: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/15', badge: 'text-emerald-400', label: 'OK' },
  warn: { icon: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/15',     badge: 'text-amber-400',   label: 'Внимание' },
  fail: { icon: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/15',         badge: 'text-red-400',     label: 'Угроза' },
};

function ScoreArc({ score }: { score: number }) {
  const R = 40; const CX = 52; const CY = 52;
  const circumference = Math.PI * R; // полуокружность
  const offset = circumference * (1 - score / 100);
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={104} height={60} viewBox="0 0 104 60">
      {/* Фон */}
      <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} strokeLinecap="round" />
      {/* Прогресс */}
      <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
        fill="none" stroke={color} strokeWidth={8} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset} />
      <text x={CX} y={CY + 2} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize={18} fontWeight={700}>{score}</text>
    </svg>
  );
}

export function SecurityScoreCard() {
  const passedCount = CHECKS.filter((c) => c.status === 'ok').length;
  const score = Math.round((passedCount / CHECKS.length) * 100);
  const overallStatus = score === 100 ? 'ok' : score >= 75 ? 'warn' : 'fail';

  return (
    <div className="rounded-2xl bg-[#141420] border border-white/8 p-6">
      {/* Заголовок */}
      <div className="flex items-center gap-2 mb-5">
        <ShieldCheck className="w-4 h-4 text-violet-400" />
        <h3 className="text-base font-semibold text-white">Security Score</h3>
      </div>

      {/* Счётчик */}
      <div className="flex items-center gap-5 mb-5">
        <ScoreArc score={score} />
        <div>
          <p className={`text-sm font-bold ${STATUS_STYLE[overallStatus].badge}`}>
            {overallStatus === 'ok' ? 'Отлично' : overallStatus === 'warn' ? 'Есть замечания' : 'Под угрозой'}
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            {passedCount} из {CHECKS.length} проверок пройдено
          </p>
        </div>
      </div>

      {/* Проверки */}
      <div className="space-y-2">
        {CHECKS.map((c) => {
          const s = STATUS_STYLE[c.status];
          return (
            <div key={c.label} className={`flex items-start gap-3 p-3 rounded-xl border ${s.bg}`}>
              <span className={s.icon}>{c.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/80">{c.label}</span>
                  <span className={`text-[10px] font-semibold ${s.badge}`}>{s.label}</span>
                </div>
                <p className="text-[10px] text-white/35 mt-0.5">{c.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
