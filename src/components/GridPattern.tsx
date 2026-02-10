"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface GridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  squares?: [number, number][]
  strokeDasharray?: string
  fadeSize?: number
  className?: string
  [key: string]: any
}

export function GridPattern({
                              width = 40,
                              height = 40,
                              x = -1,
                              y = -1,
                              strokeDasharray = "0",
                              squares,
                              fadeSize = 200,
                              className,
                              ...props
                            }: GridPatternProps) {
  const id = React.useId()
  const patternId = `pattern-${id}`
  const maskId = `mask-${id}`
  const fadeTopId = `fadeTop-${id}`
  const fadeBottomId = `fadeBottom-${id}`
  const fadeLeftId = `fadeLeft-${id}`
  const fadeRightId = `fadeRight-${id}`

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "absolute inset-0 h-full w-full",
        className,
      )}
      {...(props as any)}
    >
      <defs>
        <pattern
          height={height}
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={width}
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>

        {/* Градиенты для затемнения */}
        <linearGradient id={fadeTopId} x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="black" />
          <stop offset="100%" stopColor="white" />
        </linearGradient>

        <linearGradient id={fadeBottomId} x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </linearGradient>

        <linearGradient id={fadeLeftId} x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="black" />
          <stop offset="100%" stopColor="white" />
        </linearGradient>

        <linearGradient id={fadeRightId} x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </linearGradient>

        {/* Маска для затемнения */}
        <mask id={maskId}>
          <rect fill="white" height="100%" width="100%" />
          <rect
            fill={`url(#${fadeTopId})`}
            height={fadeSize}
            width="100%"
            x="0"
            y="0"
          />
          <rect
            fill={`url(#${fadeBottomId})`}
            height={fadeSize}
            width="100%"
            x="0"
            y={`calc(100% - ${fadeSize}px)`}
          />
          <rect
            fill={`url(#${fadeLeftId})`}
            height="100%"
            width={fadeSize}
            x="0"
            y="0"
          />
          <rect
            fill={`url(#${fadeRightId})`}
            height="100%"
            width={fadeSize}
            x={`calc(100% - ${fadeSize}px)`}
            y="0"
          />
        </mask>
      </defs>

      <rect
        fill={`url(#${patternId})`}
        height="100%"
        mask={`url(#${maskId})`}
        strokeWidth={0}
        width="100%"
      />

      {squares && (
        <g mask={`url(#${maskId})`}>
          {squares.map(([x, y], index) => (
            <rect
              height={height - 1}
              key={`${x}-${y}-${index}`}
              strokeWidth="0"
              width={width - 1}
              x={x * width + 1}
              y={y * height + 1}
            />
          ))}
        </g>
      )}
    </svg>
  )
}

export type { GridPatternProps }
export default GridPattern