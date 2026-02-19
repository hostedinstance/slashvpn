/**
 * /login — страница входа.
 * Все настройки (aurora, тексты, отступы) — в src/config/site.config.ts
 */
import { AuthPageLayout } from '@/components/AuthPageLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { aurora, authLayout } from '@/config/site.config';

export default function LoginPage() {
  return (
    <AuthPageLayout
      aurora={aurora.login}
      backLabel={authLayout.login.backLabel}
      backHref={authLayout.login.backHref}
      footerNote={authLayout.login.footerNote}
    >
      <LoginForm />
    </AuthPageLayout>
  );
}
