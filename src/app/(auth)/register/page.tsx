/**
 * /register — страница регистрации.
 * Все настройки — в src/config/site.config.ts
 */
import { AuthPageLayout } from '@/components/AuthPageLayout';
import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { aurora, authLayout } from '@/config/site.config';

export default function RegisterPage() {
  return (
    <AuthPageLayout
      aurora={aurora.register}
      backLabel={authLayout.register.backLabel}
      backHref={authLayout.register.backHref}
      footerNote={authLayout.register.footerNote}
    >
      <RegistrationForm />
    </AuthPageLayout>
  );
}
