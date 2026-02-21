'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import logotext from '@/assets/logotext.png';
import { useNavigate } from '@/components/NavigationTransition';
import { UserCircle2, CreditCard, LogOut } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  children: ReactNode;
  userName?: string;
  userPlan?: string;
  onLogout?: () => void;
  activeSection?: string;
  onSectionChange?: (id: string) => void;
}

const NAV = [
  { id: 'profile', label: 'Профиль',    icon: UserCircle2 },
  { id: 'billing', label: 'Купить VPN', icon: CreditCard  },
] as const;

// ─── Floating pill navbar ─────────────────────────────────────────────────────

function FloatingNav({
  userName,
  userPlan,
  activeSection,
  onSectionChange,
  onLogout,
}: {
  userName?: string;
  userPlan?: string;
  activeSection?: string;
  onSectionChange?: (id: string) => void;
  onLogout?: () => void;
}) {
  const { navigate } = useNavigate();
  const initial = (userName?.[0] ?? 'U').toUpperCase();
  const isPro = userPlan?.toLowerCase() === 'pro';

  return (
    /* Sticky wrapper — centres the pill */
    <div
      className="sticky top-0 z-50 w-full flex justify-center"
      style={{ padding: '16px 24px 0' }}
    >
      <nav
        className="flex items-center gap-1"
        style={{
          height: 52,
          padding: '0 8px',
          borderRadius: 26,
          background: 'rgba(0,9,43,0.92)',
          backdropFilter: 'blur(24px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.07), 0 8px 32px -8px rgba(0,0,0,0.6), 0 2px 8px -2px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center opacity-80 hover:opacity-100 transition-opacity duration-200 shrink-0"
          style={{ height: 20, marginRight: 12, marginLeft: 6 }}
        >
          <Image
            src={logotext}
            alt="SlashVPN"
            className="h-full w-auto object-contain"
            priority
          />
        </button>

        {/* Divider */}
        <div
          className="shrink-0"
          style={{
            width: 1,
            height: 20,
            background: 'rgba(255,255,255,0.08)',
            marginRight: 8,
          }}
        />

        {/* Nav tabs */}
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => onSectionChange?.(id)}
              className="flex items-center gap-2 rounded-2xl text-[13px] font-medium transition-all duration-200"
              style={{
                /* Inter Tight для навигационных меток — чёткий, compact */
                fontFamily: 'var(--font-inter-tight), sans-serif',
                letterSpacing: '-0.01em',
                padding: '7px 14px',
                ...(active
                  ? {
                      background: 'rgba(1,20,74,0.95)',
                      color: 'rgba(100,160,255,0.95)',
                      boxShadow: '0 0 0 1px rgba(100,140,255,0.30)',
                    }
                  : { color: 'rgba(255,255,255,0.38)' }),
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = 'rgba(255,255,255,0.06)';
                  el.style.color = 'rgba(255,255,255,0.65)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = '';
                  el.style.color = 'rgba(255,255,255,0.38)';
                }
              }}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </button>
          );
        })}

        {/* Divider */}
        <div
          className="shrink-0"
          style={{
            width: 1,
            height: 20,
            background: 'rgba(255,255,255,0.08)',
            marginLeft: 8,
          }}
        />

        {/* Plan badge */}
        <span
          className="shrink-0"
          style={{
            fontFamily: 'var(--font-inter-tight), sans-serif',
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 8,
            marginLeft: 4,
            ...(isPro
              ? { background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }
              : { background: 'rgba(249,115,22,0.18)', color: '#fb923c', boxShadow: '0 0 10px rgba(249,115,22,0.2)' }),
          }}
        >
          {isPro ? '⚡ Pro' : 'Free'}
        </span>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ml-1"
          style={{
            background: 'linear-gradient(145deg, rgba(1,20,74,0.98), rgba(20,60,160,0.90))',
            boxShadow: '0 0 10px rgba(100,140,255,0.22)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-inter-tight), sans-serif',
              fontSize: 11,
              fontWeight: 700,
              color: 'white',
            }}
          >
            {initial}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center rounded-xl transition-all duration-200 shrink-0 ml-0.5 mr-1"
          style={{
            padding: '7px 10px',
            color: 'rgba(255,255,255,0.25)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = 'rgba(255,255,255,0.06)';
            el.style.color = 'rgba(255,255,255,0.55)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = '';
            el.style.color = 'rgba(255,255,255,0.25)';
          }}
          title="Выйти"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </nav>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export function DashboardLayout({
  children,
  userName,
  userPlan = 'Free',
  onLogout,
  activeSection,
  onSectionChange,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: '#00092B' }}>
      <FloatingNav
        userName={userName}
        userPlan={userPlan}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        onLogout={onLogout}
      />

      {/* Page content — centred, breathing room below nav */}
      <main
        className="mx-auto"
        style={{
          maxWidth: 960,
          padding: '40px 24px 80px',
        }}
      >
        {children}
      </main>
    </div>
  );
}
