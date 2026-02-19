'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import {
  Pencil, Check, X, Mail, Calendar,
  Shield, Crown, Zap, Wallet, Clock,
} from 'lucide-react';

interface ProfileCardProps {
  userName: string;
  plan: 'free' | 'pro';
}

// ─── Font tokens ─────────────────────────────────────────────────────────────
const F_DISPLAY = 'var(--font-wix-madefor), sans-serif';   // headings, names, labels
const F_MONO    = 'var(--font-inter-tight), sans-serif';    // numbers, meta, dates

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ initial }: { initial: string }) {
  return (
    <div
      className="relative w-20 h-20 rounded-[22px] flex items-center justify-center shrink-0 select-none"
      style={{
        background: 'linear-gradient(145deg, #7c3aed 0%, #4f46e5 55%, #3730a3 100%)',
        boxShadow: '0 0 0 1px rgba(139,92,246,0.3), 0 16px 48px -8px rgba(124,58,237,0.5)',
      }}
    >
      <span style={{ fontFamily: F_MONO, fontSize: 28, fontWeight: 800, color: 'white', lineHeight: 1 }}>
        {initial}
      </span>
      {/* Online dot */}
      <span
        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
        style={{ background: '#07070f' }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.7)' }} />
      </span>
    </div>
  );
}

// ─── Plan badge — Free gets a vivid orange-amber to stand out ─────────────────

function PlanBadge({ plan }: { plan: 'free' | 'pro' }) {
  if (plan === 'pro') {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
        style={{
          fontFamily: F_MONO, fontSize: 11, fontWeight: 700,
          background: 'rgba(251,191,36,0.14)', color: '#fbbf24',
          boxShadow: '0 0 16px rgba(251,191,36,0.18)',
        }}
      >
        <Crown className="w-3 h-3" /> Pro
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{
        fontFamily: F_MONO, fontSize: 11, fontWeight: 700,
        background: 'rgba(249,115,22,0.16)', color: '#fb923c',
        boxShadow: '0 0 14px rgba(249,115,22,0.2)',
      }}
    >
      <Zap className="w-3 h-3" /> Free
    </span>
  );
}

// ─── Subscription time-remaining block ───────────────────────────────────────

function SubscriptionBlock({ plan }: { plan: 'free' | 'pro' }) {
  // Mock data — replace with real API values
  const subCount   = 3;                       // кол-во подписок всего
  const totalDays  = plan === 'pro' ? 30 : 7;
  const usedDays   = plan === 'pro' ? 8 : 2;
  const leftDays   = totalDays - usedDays;
  const pct        = Math.round((usedDays / totalDays) * 100);

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + leftDays);
  const endStr = endDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  // Color based on time left
  const urgency =
    leftDays <= 2  ? { bar: '#ef4444', glow: 'rgba(239,68,68,0.35)',   text: '#ef4444' } :
    leftDays <= 7  ? { bar: '#f59e0b', glow: 'rgba(245,158,11,0.3)',   text: '#f59e0b' } :
                     { bar: '#8b5cf6', glow: 'rgba(139,92,246,0.35)',  text: 'rgba(167,139,250,0.9)' };

  return (
    <div
      className="rounded-2xl overflow-hidden mb-2"
      style={{ background: 'rgba(255,255,255,0.028)', boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4" style={{ color: urgency.text }} />
          <span style={{ fontFamily: F_DISPLAY, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
            Подписка
          </span>
        </div>
        <span
          className="px-2.5 py-1 rounded-lg"
          style={{
            fontFamily: F_MONO, fontSize: 10, fontWeight: 700,
            background: plan === 'pro' ? 'rgba(139,92,246,0.16)' : 'rgba(249,115,22,0.14)',
            color: plan === 'pro' ? 'rgba(167,139,250,0.9)' : '#fb923c',
          }}
        >
          {plan === 'pro' ? 'Мульти' : 'Free'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-2">
        <div className="flex justify-between mb-1.5">
          <span style={{ fontFamily: F_MONO, fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
            Использовано {usedDays} из {totalDays} дней
          </span>
          <span style={{ fontFamily: F_MONO, fontSize: 11, fontWeight: 600, color: urgency.text }}>
            Осталось {leftDays} {leftDays === 1 ? 'день' : leftDays < 5 ? 'дня' : 'дней'}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: urgency.bar,
              boxShadow: `0 0 8px ${urgency.glow}`,
            }}
          />
        </div>
      </div>

      {/* End date */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span style={{ fontFamily: F_MONO, fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>
          Действует до
        </span>
        <span style={{ fontFamily: F_MONO, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
          {endStr}
        </span>
      </div>

      {/* Sub count */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span style={{ fontFamily: F_MONO, fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>
          Всего подписок оформлено
        </span>
        <span style={{ fontFamily: F_MONO, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)' }}>
          {subCount}
        </span>
      </div>
    </div>
  );
}

// ─── Balance block ────────────────────────────────────────────────────────────

function BalanceBlock() {
  // Mock data — replace with real values
  const balance     = 390;   // текущий баланс ₽
  const topupCount  = 4;     // кол-во пополнений
  const lastTopup   = '14 июня 2025';

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.028)', boxShadow: '0 0 0 1px rgba(255,255,255,0.05)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <Wallet className="w-4 h-4" style={{ color: 'rgba(52,211,153,0.8)' }} />
          <span style={{ fontFamily: F_DISPLAY, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
            Баланс
          </span>
        </div>
        <span
          style={{
            fontFamily: F_MONO, fontSize: 20, fontWeight: 800,
            letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.88)',
          }}
        >
          {balance} ₽
        </span>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div
          className="px-4 py-3"
          style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p style={{ fontFamily: F_MONO, fontSize: 10, color: 'rgba(255,255,255,0.24)', marginBottom: 4 }}>
            Пополнений
          </p>
          <p style={{ fontFamily: F_MONO, fontSize: 18, fontWeight: 800, color: '#34d399' }}>
            {topupCount}
          </p>
        </div>
        <div className="px-4 py-3">
          <p style={{ fontFamily: F_MONO, fontSize: 10, color: 'rgba(255,255,255,0.24)', marginBottom: 4 }}>
            Последнее
          </p>
          <p style={{ fontFamily: F_MONO, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
            {lastTopup}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MetaRow ─────────────────────────────────────────────────────────────────

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-2xl cursor-default"
      style={{ background: 'rgba(255,255,255,0.028)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.028)'; }}
    >
      <div className="flex items-center gap-3">
        <span style={{ color: 'rgba(255,255,255,0.22)' }}>{icon}</span>
        <span style={{ fontFamily: F_DISPLAY, fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{label}</span>
      </div>
      <span style={{ fontFamily: F_MONO, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
        {value}
      </span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ProfileCard({ userName, plan }: ProfileCardProps) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(userName);
  const [draft, setDraft]     = useState(userName);
  const inputRef = useRef<HTMLInputElement>(null);

  const initial  = (name[0] ?? 'U').toUpperCase();
  const email    = user?.email ?? 'user@slashvpn.app';
  const joinDate = user?.created
    ? new Date(user.created).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    : 'Недавно';

  const startEdit = () => { setDraft(name); setEditing(true); setTimeout(() => inputRef.current?.focus(), 0); };
  const save      = () => { setName(draft.trim() || name); setEditing(false); };
  const cancel    = () => { setDraft(name); setEditing(false); };

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: 'linear-gradient(160deg, #0f0f22 0%, #09090f 60%, #0b0915 100%)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px -20px rgba(0,0,0,0.7)',
      }}
    >
      {/* Orbs */}
      <div className="absolute pointer-events-none" style={{ top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: -60, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)' }} />

      <div className="relative p-7">

        {/* ── Identity ───────────────────────────────────────────────────── */}
        <div className="flex items-start gap-5 mb-7">
          <Avatar initial={initial} />

          <div className="flex-1 min-w-0 pt-1">
            {/* Name */}
            {editing ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
                  className="flex-1 px-3 py-1.5 rounded-xl focus:outline-none"
                  style={{
                    fontFamily: F_DISPLAY, fontSize: 18, fontWeight: 700, color: 'white',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.4)',
                  }}
                />
                <button onClick={save} className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(52,211,153,0.15)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(52,211,153,0.25)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(52,211,153,0.15)'; }}
                >
                  <Check className="w-4 h-4" style={{ color: '#34d399' }} />
                </button>
                <button onClick={cancel} className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
                >
                  <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontFamily: F_DISPLAY, fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.02em' }}>
                  {name}
                </span>
                <button
                  onClick={startEdit}
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  title="Редактировать имя"
                >
                  <Pencil className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.35)' }} />
                </button>
              </div>
            )}

            {/* Email */}
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }} />
              <span style={{ fontFamily: F_MONO, fontSize: 13, color: 'rgba(255,255,255,0.42)' }}>{email}</span>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <PlanBadge plan={plan} />
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{ fontFamily: F_MONO, fontSize: 11, fontWeight: 700, background: 'rgba(52,211,153,0.1)', color: '#34d399' }}
              >
                <Shield className="w-3 h-3" /> Верифицирован
              </span>
            </div>
          </div>
        </div>

        {/* ── Subscription ────────────────────────────────────────────────── */}
        <div className="mb-3">
          <p style={{ fontFamily: F_MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: 10 }}>
            Текущая подписка
          </p>
          <SubscriptionBlock plan={plan} />
        </div>

        {/* ── Balance ─────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <p style={{ fontFamily: F_MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: 10 }}>
            Баланс
          </p>
          <BalanceBlock />
        </div>

        {/* ── Account info ─────────────────────────────────────────────────── */}
        <div>
          <p style={{ fontFamily: F_MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: 10 }}>
            Аккаунт
          </p>
          <div className="space-y-1.5">
            <MetaRow icon={<Calendar className="w-4 h-4" />} label="Присоединился" value={joinDate} />
            <MetaRow icon={<Mail className="w-4 h-4" />}     label="Email"          value={email}   />
            <MetaRow icon={<Shield className="w-4 h-4" />}   label="Статус"         value="Верифицирован" />
          </div>
        </div>
      </div>
    </div>
  );
}
