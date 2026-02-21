'use client';

import Image from 'next/image';
import logo from '@/assets/logo.png';
import { useNavigate } from '@/components/NavigationTransition';
import { UserCircle2, CreditCard, LogOut } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DashboardSidebarProps {
  activeSection?: string;
  onSectionChange?: (id: string) => void;
  userName?: string;
  userPlan?: string;
  onLogout?: () => void;
}

const NAV = [
  { id: 'profile', label: 'Профиль',   icon: UserCircle2 },
  { id: 'billing', label: 'Купить VPN', icon: CreditCard  },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export function DashboardSidebar({
  activeSection = 'profile',
  onSectionChange,
  userName = 'Пользователь',
  userPlan = 'Free',
  onLogout,
}: DashboardSidebarProps) {
  const { navigate } = useNavigate();
  const initial = (userName[0] ?? 'U').toUpperCase();
  const isPro = userPlan.toLowerCase() === 'pro';

  return (
    <aside
      className="flex flex-col w-[210px] shrink-0 min-h-screen select-none"
      style={{
        background: '#010E38',
        borderRight: '1px solid rgba(100,140,255,0.08)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center h-16 px-5 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center h-6 opacity-80 hover:opacity-100 transition-opacity duration-200"
        >
          <Image src={logo} alt="SlashVPN" className="h-full w-auto object-contain" priority />
        </button>
      </div>

      {/* User identity */}
      <div className="px-3 pt-5 pb-4">
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(109,40,217,0.14) 0%, rgba(79,70,229,0.06) 100%)',
            boxShadow: '0 0 0 1px rgba(139,92,246,0.1)',
          }}
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(145deg, #7c3aed, #4f46e5)',
              boxShadow: '0 0 16px rgba(124,58,237,0.3)',
            }}
          >
            <span className="text-[13px] font-bold text-white">{initial}</span>
          </div>

          {/* Name + plan */}
          <div className="flex-1 min-w-0">
            <p
              className="text-[13px] font-semibold truncate leading-tight"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {userName}
            </p>
            <p
              className="text-[11px] font-medium mt-0.5"
              style={{ color: isPro ? 'rgba(167,139,250,0.7)' : 'rgba(255,255,255,0.28)' }}
            >
              {isPro ? '⚡ Pro' : 'Free'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        <p
          className="text-[10px] font-bold uppercase tracking-widest px-3 mb-3"
          style={{ color: 'rgba(255,255,255,0.16)', fontFamily: 'inherit' }}
        >
          Меню
        </p>

        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => onSectionChange?.(id)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-[13px] font-medium transition-all duration-200"
              style={active
                ? {
                    background: 'linear-gradient(135deg, rgba(109,40,217,0.22) 0%, rgba(79,70,229,0.1) 100%)',
                    boxShadow: '0 0 0 1px rgba(139,92,246,0.18)',
                    color: 'rgba(255,255,255,0.9)',
                  }
                : { color: 'rgba(255,255,255,0.35)' }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = '';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)';
                }
              }}
            >
              <Icon
                className="w-[18px] h-[18px] shrink-0"
                style={{ color: active ? 'rgba(167,139,250,0.9)' : 'rgba(255,255,255,0.25)' }}
              />
              <span className="flex-1 text-left">{label}</span>
              {active && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: '#8b5cf6',
                    boxShadow: '0 0 6px rgba(139,92,246,0.7)',
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Upgrade nudge — free only */}
      {!isPro && (
        <div className="px-3 mb-3">
          <div
            className="p-4 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(109,40,217,0.16) 0%, rgba(79,70,229,0.07) 100%)',
              boxShadow: '0 0 0 1px rgba(139,92,246,0.14)',
            }}
          >
            <p className="text-[12px] font-bold mb-0.5" style={{ color: 'rgba(167,139,250,0.85)' }}>
              Upgrade to Pro
            </p>
            <p className="text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.28)' }}>
              От <span className="font-bold text-white">$9</span>/мес
            </p>
            <button
              onClick={() => onSectionChange?.('billing')}
              className="w-full py-2 rounded-xl text-white text-[11px] font-bold transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            >
              Выбрать план →
            </button>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="px-3 pb-5 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 12 }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-[13px] font-medium transition-all duration-200"
          style={{ color: 'rgba(255,255,255,0.28)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.28)';
          }}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Выйти
        </button>
      </div>
    </aside>
  );
}
