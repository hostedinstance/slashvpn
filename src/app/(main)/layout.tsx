import React from "react";
import { PageTransition } from "@/components/ui/PageTransition";

/**
 * MainLayout — layout для группы (main): главная + dashboard
 *
 * PageTransition регистрирует framer-motion variants для enter/exit.
 * AnimatePresence в LayoutWrapper (выше в дереве) оркеструет смену страниц.
 *
 * Для stagger-анимации внутри страниц — используй <TransitionItem>:
 *   import { TransitionItem } from "@/components/ui/PageTransition"
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition>
      {children}
    </PageTransition>
  );
}
