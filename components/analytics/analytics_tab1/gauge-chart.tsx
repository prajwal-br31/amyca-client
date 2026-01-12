'use client'

import { PieChart, Pie, Cell } from 'recharts'

interface GaugeChartProps {
  value: number
}

export function GaugeChart({ value }: GaugeChartProps) {
  const data = [
    { name: 'value', value: value },
    { name: 'empty', value: 100 - value }
  ]

  const startAngle = 180
  const endAngle = 0

  return (
    <div className="relative w-full h-[200px] bg-[#e5e7eb] p-4 rounded-lg"> {/* Added background color */}
      <PieChart width={200} height={200} className="mx-auto">
        <Pie
          data={data}
          cx={100}
          cy={100}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={0}
          dataKey="value"
        >
          <Cell key="cell-0" fill="#6366f1" />
          <Cell key="cell-1" fill="#e0e0e0" />
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold text-black">{value}%</span> {/* Text color changed to black */}
      </div>
    </div>
  )
}
