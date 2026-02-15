"use client";

import React, { useRef, FC, PropsWithChildren } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  classname?: string;
  font?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
                                                             children,
                                                             classname,
                                                             font = "font-semibold font-wix-madefor tracking-tight",
                                                             href = "#",
                                                             target,
                                                             rel,
                                                           }) => {
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      xTo.current = gsap.quickTo(blobRef.current!, "x", { duration: 0.8, ease: "power3" });
      yTo.current = gsap.quickTo(blobRef.current!, "y", { duration: 0.8, ease: "power3" });

      gsap.set(blobRef.current, {
        scale: 0,
        xPercent: -50,
        yPercent: -50,
      });
    },
    { scope: buttonRef }
  );

  const handleMouseEnter = () => {
    gsap.to(blobRef.current, { scale: 1, duration: 0.3 });
  };

  const handleMouseLeave = () => {
    gsap.to(blobRef.current, { scale: 0, duration: 0.3 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (buttonRef.current && xTo.current && yTo.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      xTo.current(e.clientX - rect.left);
      yTo.current(e.clientY - rect.top);
    }
  };

  return (
    <a
      ref={buttonRef}
      href={href}
      target={target}
      rel={rel}
      className={twMerge(
        "relative inline-block py-3 px-4 text-m font-medium rounded-lg border-2 border-white/50 text-white overflow-hidden z-0 transition-colors duration-500 hover:text-black hover:border-white/0",
        font,
        classname
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={blobRef}
        className="absolute w-[400px] h-[300px] bg-white left-0 top-0 -z-10 pointer-events-none rounded-[50%]"
      />
      <span className="relative z-10">{children}</span>
    </a>
  );
};