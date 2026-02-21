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

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) router.push('/login');
  }, [loading, isLoggedIn, router]);

  const handleLogout = () => { logout(); navigate('/'); };
  const handleSectionChange = (id: string) => setSection(id as Section);

  if (loading || !user) return null;

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
      {section === 'profile' ? (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <ProfileCard userName={displayName} plan={plan} />
        </div>
      ) : (
        <SubscriptionCard plan={plan} />
      )}
    </DashboardLayout>
  );
}
