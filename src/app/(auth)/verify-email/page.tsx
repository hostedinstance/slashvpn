/**
 * /verify-email — страница подтверждения email.
 * Все настройки — в src/config/site.config.ts
 */
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthPageLayout } from '@/components/AuthPageLayout';
import { EmailVerificationForm } from '@/components/auth/EmailVerificationForm';
import { aurora, authLayout } from '@/config/site.config';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (!emailParam) { router.push('/register'); return; }
    setEmail(emailParam);
  }, [searchParams, router]);

  if (!email) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60">Загрузка...</div>
      </main>
    );
  }

  return (
    <AuthPageLayout
      aurora={aurora.verifyEmail}
      backLabel={authLayout.verifyEmail.backLabel}
      backHref={authLayout.verifyEmail.backHref}
      footerNote={authLayout.verifyEmail.footerNote}
    >
      <EmailVerificationForm email={email} />
    </AuthPageLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60">Загрузка...</div>
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
