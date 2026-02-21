'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import logotext from '@/assets/logotext.png';
import { useNavigate } from '@/components/NavigationTransition';
import { UserCircle2, CreditCard, LogOut } from 'lucide-react';
import { dashboardStyles } from '@/config/theme.config';

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
    <div
      className="sticky top-0 z-50 w-full flex justify-center"
      style={{ padding: dashboardStyles.navWrapperPadding }}
    >
      <nav
        className="flex items-center gap-1"
        style={{
          height:               dashboardStyles.navHeight,
          padding:              dashboardStyles.navPadding,
          borderRadius:         dashboardStyles.navRadius,
          background:           dashboardStyles.navBg,
          backdropFilter:       dashboardStyles.navBackdrop,
          WebkitBackdropFilter: dashboardStyles.navBackdrop,
          boxShadow:            dashboardStyles.navShadow,
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
          style={{ width: 1, height: 20, background: dashboardStyles.divider, marginRight: 8 }}
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
                fontFamily: 'var(--font-inter-tight), sans-serif',
                letterSpacing: '-0.01em',
                padding: '7px 14px',
                ...(active
                  ? {
                      background: dashboardStyles.tabActiveBg,
                      color: dashboardStyles.tabActiveColor,
                      boxShadow: dashboardStyles.tabActiveShadow,
                    }
                  : { color: dashboardStyles.tabColor }),
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = dashboardStyles.tabHoverBg;
                  el.style.color = dashboardStyles.tabHoverColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = '';
                  el.style.color = dashboardStyles.tabColor;
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
          style={{ width: 1, height: 20, background: dashboardStyles.divider, marginLeft: 8 }}
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
              ? { background: dashboardStyles.proBadgeBg, color: dashboardStyles.proBadgeColor }
              : { background: dashboardStyles.freeBadgeBg, color: dashboardStyles.freeBadgeColor, boxShadow: dashboardStyles.freeBadgeShadow }),
          }}
        >
          {isPro ? '⚡ Pro' : 'Free'}
        </span>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ml-1"
          style={{
            background: dashboardStyles.avatarBg,
            boxShadow: dashboardStyles.avatarShadow,
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
          style={{ padding: '7px 10px', color: dashboardStyles.logoutColor }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = dashboardStyles.logoutHoverBg;
            el.style.color = dashboardStyles.logoutHoverColor;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = '';
            el.style.color = dashboardStyles.logoutColor;
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
    <div className="min-h-screen" style={{ background: dashboardStyles.pageBg }}>
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
          maxWidth: dashboardStyles.contentMaxWidth,
          padding: dashboardStyles.contentPadding,
        }}
      >
        {children}
      </main>
    </div>
  );
}
