import React from "react"
import GridPattern from "@/components/GridPattern"

export function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center overflow-hidden">
      <div className="relative w-[1200px] h-[800px]">
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          strokeDasharray="0"
          fadeSize={200}
          className="fill-transparent stroke-white/100"
        />
      </div>
    </div>
  )
}

export default GridBackground