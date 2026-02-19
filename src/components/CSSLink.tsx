import React from "react";
import { cn } from "@/lib/utils";

export type CSSLinkVariant =
  | "underline-slide"
  | "underline-grow"
  | "underline-bounce"
  | "background-slide"
  | "background-grow"
  | "fade"
  | "scale"
  | "shimmer";

interface CSSLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: CSSLinkVariant;
  children: React.ReactNode;
}

export function CSSLink({
  variant = "underline-slide",
  className,
  children,
  ...props
}: CSSLinkProps) {
  return (
    <a
      className={cn(
        "css-link",
        `css-link-${variant}`,
        "relative inline-block cursor-pointer transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

// Стили для компонента (добавьте в globals.css или используйте как CSS Module)
export const cssLinkStyles = `
/* Base styles */
.css-link {
  position: relative;
  text-decoration: none;
}

/* Underline Slide */
.css-link-underline-slide::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: currentColor;
  transition: width 0.3s ease;
}

.css-link-underline-slide:hover::after {
  width: 100%;
}

/* Underline Grow */
.css-link-underline-grow::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  background-color: currentColor;
  transition: width 0.3s ease;
}

.css-link-underline-grow:hover::after {
  width: 100%;
}

/* Underline Bounce */
.css-link-underline-bounce::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: currentColor;
  transition: width 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.css-link-underline-bounce:hover::after {
  width: 100%;
}

/* Background Slide */
.css-link-background-slide {
  overflow: hidden;
}

.css-link-background-slide::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background-color: currentColor;
  opacity: 0.1;
  transition: left 0.3s ease;
  z-index: -1;
}

.css-link-background-slide:hover::before {
  left: 0;
}

/* Background Grow */
.css-link-background-grow {
  overflow: hidden;
}

.css-link-background-grow::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 100%;
  height: 100%;
  background-color: currentColor;
  opacity: 0.1;
  transition: transform 0.3s ease;
  z-index: -1;
  border-radius: 50%;
}

.css-link-background-grow:hover::before {
  transform: translate(-50%, -50%) scale(2);
}

/* Fade */
.css-link-fade {
  transition: opacity 0.3s ease;
}

.css-link-fade:hover {
  opacity: 0.7;
}

/* Scale */
.css-link-scale {
  transition: transform 0.3s ease;
}

.css-link-scale:hover {
  transform: scale(1.05);
}

/* Shimmer */
.css-link-shimmer {
  background: linear-gradient(
    90deg,
    currentColor 0%,
    currentColor 40%,
    rgba(255, 255, 255, 0.5) 50%,
    currentColor 60%,
    currentColor 100%
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: background-position 0.5s ease;
}

.css-link-shimmer:hover {
  background-position: -100% 0;
}
`;