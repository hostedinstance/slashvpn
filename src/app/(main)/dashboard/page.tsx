'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from '@/components/NavigationTransition';

import { DashboardLayout }  from '@/components/dashboard/DashboardLayout';
import { ProfileCard }      from '@/components/dashboard/ProfileCard';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';

type Section = 'profile' | 'billing';

export default function DashboardPage() {
  const router = useRouter();
  const { navigate } = useNavigate();
  const { user, loading, isLoggedIn, logout } = useAuth();
  const [section, setSection] = useState<Section>('profile');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) router.push('/login');
  }, [loading, isLoggedIn, router]);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleSectionChange = (id: string) => {
    setVisible(false);
    setTimeout(() => {
      setSection(id as Section);
      setVisible(true);
    }, 130);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#07070f' }}>
        <div
          className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(139,92,246,0.4)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.name || user.username;
  const plan: 'free' | 'pro' = user.verified ? 'pro' : 'free';

  return (
    <DashboardLayout
      userName={displayName}
      userPlan={plan === 'pro' ? 'Pro' : 'Free'}
      activeSection={section}
      onSectionChange={handleSectionChange}
      onLogout={handleLogout}
    >
      {/* Section transition wrapper */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.32s ease, transform 0.32s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {section === 'profile' ? (
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <ProfileCard userName={displayName} plan={plan} />
          </div>
        ) : (
          /* Billing — wider, centered */
          <SubscriptionCard plan={plan} />
        )}
      </div>
    </DashboardLayout>
  );
}
