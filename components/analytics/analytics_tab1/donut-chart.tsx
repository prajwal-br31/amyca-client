'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Very Satisfied', value: 35, color: '#15803d' },
  { name: 'Satisfied', value: 25, color: '#22c55e' },
  { name: 'Neutral', value: 20, color: '#fbbf24' },
  { name: 'Not Satisfied', value: 10, color: '#f97316' },
  { name: 'Very Unsatisfied', value: 5, color: '#ef4444' },
  {name:'Abondened',value:5,color:'#929698'}
]

export function CustomerSatisfactionChart() {
  return (
    <div className="rounded-lg bg-[#e5e7eb] py-4">
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 ml-8 pt-6">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-black">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
