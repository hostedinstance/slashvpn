"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect, useId } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Define the icon type.
type IconType = React.ElementType | React.FunctionComponent<React.SVGProps<SVGSVGElement>> | string;

// --- 📦 API (Props) Definition ---
export interface FeatureItem {
  /** A unique identifier for the feature. */
  id: string;
  /** The icon associated with the feature. Can be a React component or a Lottie file path. */
  icon: IconType;
  /** The concise title of the feature. */
  title: string;
  /** The detailed description of the feature's benefit. */
  description: string;
}

export interface FeatureGridProps {
  /** Array of feature items to display. */
  features: FeatureItem[];
  /** Optional title for the entire grid section. */
  sectionTitle?: React.ReactNode;
  /** Optional subtitle for the entire grid section. */
  sectionSubtitle?: React.ReactNode;
  /** Optional class name to apply to the main container. */
  className?: string;
}

// Grid Component
const Grid = ({ size = 20 }: { size?: number }) => {
  const [currentSquares, setCurrentSquares] = useState<number[][]>([]);
  const [nextSquares, setNextSquares] = useState<number[][]>([]);
  const [currentOpacity, setCurrentOpacity] = useState(1);
  const [nextOpacity, setNextOpacity] = useState(0);

  const generateRandomSquares = () => {
    return Array.from({ length: 5 }, () => [
      Math.floor(Math.random() * 4) + 7,
      Math.floor(Math.random() * 6) + 1,
    ]);
  };

  useEffect(() => {
    const initialSquares = generateRandomSquares();
    setCurrentSquares(initialSquares);

    const interval = setInterval(() => {
      const newSquares = generateRandomSquares();
      setNextSquares(newSquares);

      setCurrentOpacity(0);
      setNextOpacity(1);

      setTimeout(() => {
        setCurrentSquares(newSquares);
        setNextSquares([]);
        setCurrentOpacity(1);
        setNextOpacity(0);
      }, 800);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(to_bottom,white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/30 to-zinc-900/30 opacity-100 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
        <GridPattern
          width={size}
          height={size}
          x="-12"
          y="4"
          currentSquares={currentSquares}
          nextSquares={nextSquares}
          currentOpacity={currentOpacity}
          nextOpacity={nextOpacity}
          className="absolute inset-0 h-full w-full fill-white/5 stroke-white/20 opacity-50"
        />
      </div>
    </div>
  );
};

const GridPattern = ({
                       width,
                       height,
                       x,
                       y,
                       currentSquares,
                       nextSquares,
                       currentOpacity,
                       nextOpacity,
                       ...props
                     }: any) => {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {currentSquares && (
        <svg x={x} y={y} className="overflow-visible">
          {currentSquares.map(([x, y]: any, index: number) => (
            <rect
              strokeWidth="0"
              key={`current-${x}-${y}-${index}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
              className="fill-white/10"
              style={{
                transition: "opacity 800ms ease-in-out",
                opacity: currentOpacity,
              }}
            />
          ))}
        </svg>
      )}
      {nextSquares && nextSquares.length > 0 && (
        <svg x={x} y={y} className="overflow-visible">
          {nextSquares.map(([x, y]: any, index: number) => (
            <rect
              strokeWidth="0"
              key={`next-${x}-${y}-${index}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
              className="fill-white/10"
              style={{
                transition: "opacity 800ms ease-in-out",
                opacity: nextOpacity,
              }}
            />
          ))}
        </svg>
      )}
    </svg>
  );
};

/**
 * A professional, responsive grid component for showcasing key product features.
 */
export const FeatureGrid: React.FC<FeatureGridProps> = ({
                                                          features,
                                                          sectionTitle,
                                                          sectionSubtitle,
                                                          className,
                                                        }) => {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <section
      className={cn("bg-black", className)}
      role="region"
      aria-label={sectionTitle ? `Features: ${sectionTitle}` : "Product Features"}
    >
      <div className="container">
        {/* Section Header */}
        {(sectionTitle || sectionSubtitle) && (
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-5xl md:text-6xl font-medium text-center tracking-tighter text-white">
              Почему стоит выбрать
            </h2>
            <h2 className="text-5xl md:text-6xl font-medium text-center tracking-tighter text-white mb-5">
              SlashVPN?
            </h2>
            <p className="text-lg md:text-xl font-inter-tight text-white/70 text-center tracking-tight">
              Мы создали сервис, который не нужно «настраивать» — им нужно просто пользоваться.
            </p>
          </div>
        )}

        {/* Features Grid */}
        <div
          className="grid gap-4 grid-cols-1 md:grid-cols-3"
          role="list"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{ feature: FeatureItem }> = ({ feature }) => {
  const dotLottieRef = useRef<any>(null);
  const isLottie = typeof feature.icon === 'string';

  const handleHover = () => {
    if (!dotLottieRef.current || !isLottie) {
      return;
    }
    dotLottieRef.current.seek(0);
    dotLottieRef.current.play();
  };

  return (
    <div
      onMouseEnter={handleHover}
      className="relative h-full min-h-[10rem]"
      role="listitem"
    >
      <div className="relative h-full rounded-xl bg-gradient-to-b from-neutral-900 to-black p-6 overflow-hidden border-[0.75px] border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] hover:border-white/40">
        {/* Grid Background */}
        <Grid size={20} />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex-shrink-0">
            <div className="inline-flex justify-center items-center w-12 h-12 border border-white/15 rounded-lg bg-neutral-800/50">
              {isLottie ? (
                <DotLottieReact
                  dotLottieRefCallback={(ref) => { dotLottieRef.current = ref; }}
                  src={feature.icon as string}
                  className="w-5 h-5"
                  autoplay
                />
              ) : (
                React.createElement(feature.icon as React.ElementType, {
                  className: "w-5 h-5 text-white",
                  "aria-hidden": "true"
                })
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end space-y-4">
            <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
              {feature.title}
            </h3>
            <p className="text-white/70 text-sm leading-relaxed font-inter-tight md:text-base">
              {feature.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};