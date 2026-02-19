'use client';

/**
 * NavigationTransition
 *
 * Надёжная анимация переходов между страницами.
 *
 * Проблема с предыдущей реализацией:
 * React 18 Concurrent Mode батчит setState-вызовы. Когда мы делали:
 *   setOverlay({ phase: 'exit' })     // opacity: 0, монтирование
 *   rAF → rAF → setOverlay({ phase: 'enter' })  // opacity: 1
 * React мог объединить оба вызова в один рендер — браузер никогда не видел
 * элемент в состоянии opacity:0, CSS transition не срабатывал, анимация была рваной.
 *
 * Решение: flushSync() — заставляет React сделать синхронный рендер немедленно,
 * после чего браузер гарантированно красит элемент в opacity:0.
 * Затем requestAnimationFrame изменяет opacity:1 и CSS transition плавно анимирует.
 *
 * Два типа анимации:
 * • full-loader (главная ↔ другие): чёрный экран + SquareLoader
 * • blur-fade (второстепенные ↔ второстепенные): blur + затемнение
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { flushSync } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import { SquareLoader } from 'react-spinners';

const MAIN_ROUTES = ['/'];
const isMain = (path: string) => MAIN_ROUTES.includes(path);

type TransitionKind = 'full-loader' | 'blur-fade';

interface OverlayState {
  kind: TransitionKind;
  visible: boolean;
}

interface NavContextValue {
  navigate: (href: string) => void;
}

const NavContext = createContext<NavContextValue>({ navigate: () => {} });
export function useNavigate() { return useContext(NavContext); }

// ─── Overlay (всегда в DOM пока active, не размонтируется между фазами) ──────

function TransitionOverlay({ state }: { state: OverlayState | null }) {
  if (!state) return null;

  const { kind, visible } = state;

  if (kind === 'full-loader') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Начинаем с opacity 0 (invisible=true → visible=false),
          // переходим в 1 через rAF после paint
          opacity: visible ? 1 : 0,
          transition: 'opacity 400ms ease',
          pointerEvents: visible ? 'all' : 'none',
          willChange: 'opacity',
        }}
      >
        <SquareLoader color="#ffffff" size={28} />
      </div>
    );
  }

  // blur-fade
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 9998,
        opacity: visible ? 1 : 0,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'opacity 260ms ease',
        pointerEvents: visible ? 'all' : 'none',
        willChange: 'opacity',
      }}
    />
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function NavigationTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const busy = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      if (busy.current) return;
      if (href === pathname) return;

      busy.current = true;

      const kind: TransitionKind =
        isMain(pathname) || isMain(href) ? 'full-loader' : 'blur-fade';

      const ENTER = kind === 'full-loader' ? 400 : 260;
      const EXIT  = kind === 'full-loader' ? 360 : 220;

      // Шаг 1: монтируем оверлей с visible=false (opacity:0).
      // flushSync() заставляет React немедленно сделать DOM-мутацию и синхронно
      // отдать её браузеру — элемент окажется в DOM на opacity:0 до следующей строки.
      flushSync(() => {
        setOverlay({ kind, visible: false });
      });

      // Шаг 2: в следующем rAF браузер уже покрасил элемент в opacity:0.
      // Меняем на visible=true — CSS transition плавно анимирует до opacity:1.
      requestAnimationFrame(() => {
        setOverlay({ kind, visible: true });

        // Шаг 3: после завершения анимации появления — переходим
        setTimeout(() => {
          router.push(href);

          // Шаг 4: даём новой странице чуть времени смонтироваться
          setTimeout(() => {
            // Шаг 5: плавно скрываем оверлей
            setOverlay({ kind, visible: false });

            // Шаг 6: после анимации исчезновения — убираем из DOM
            setTimeout(() => {
              setOverlay(null);
              busy.current = false;
            }, EXIT + 50);
          }, 60);
        }, ENTER);
      });
    },
    [pathname, router]
  );

  return (
    <NavContext.Provider value={{ navigate }}>
      {children}
      <TransitionOverlay state={overlay} />
    </NavContext.Provider>
  );
}
