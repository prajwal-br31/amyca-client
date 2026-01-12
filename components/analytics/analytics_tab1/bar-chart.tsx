'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'M', value: 90 },
  { name: 'T', value: 88 },
  { name: 'W', value: 92 },
  { name: 'T', value: 89 },
  { name: 'F', value: 85 },
  { name: 'S', value: 94 },
  { name: 'S', value: 87 }
]

export function WeeklyBarChart() {
  return (
    <div className="p-6 rounded-lg bg-[#e5e7eb]">
      <h3 className="text-black mb-4">Weekly Performance</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8' }}
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
          />
          <Bar
            dataKey="value"
            fill="#38bdf8"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
