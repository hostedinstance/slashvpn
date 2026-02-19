'use client';

import { Bell, LogOut } from 'lucide-react';

interface DashboardTopbarProps {
  userName?: string;
  onLogout?: () => void;
}

export function DashboardTopbar({ userName, onLogout }: DashboardTopbarProps) {
  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header
      className="sticky top-0 z-40 flex items-center h-16 px-8 shrink-0"
      style={{
        background: 'rgba(7,7,15,0.75)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 flex-1">
        <span
          className="text-[13px] font-medium"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          SlashVPN
        </span>
        <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: 11 }}>/</span>
        <span
          className="text-[13px] font-medium"
          style={{ color: 'rgba(255,255,255,0.48)' }}
        >
          Личный кабинет
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.04)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
        >
          <Bell className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.35)' }} />
          <span
            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
            style={{
              background: '#8b5cf6',
              boxShadow: '0 0 6px rgba(139,92,246,0.8)',
            }}
          />
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.35)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)';
          }}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Выйти</span>
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer shrink-0"
          style={{
            background: 'linear-gradient(145deg, #7c3aed, #4f46e5)',
            boxShadow: '0 0 16px rgba(124,58,237,0.28)',
          }}
        >
          <span className="text-[11px] font-bold text-white">{initials}</span>
        </div>
      </div>
    </header>
  );
}
