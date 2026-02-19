'use client';

import { useState, useEffect } from 'react';
import { SquareLoader } from 'react-spinners';

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleLoad = () => {
      // Fade out после загрузки
      setTimeout(() => {
        setOpacity(0);
        setTimeout(() => setVisible(false), 600);
      }, 2000);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'black',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transition: 'opacity 0.6s ease-out',
        pointerEvents: opacity === 0 ? 'none' : 'all',
      }}
    >
      <SquareLoader color="#fff" />
    </div>
  );
}
