"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts"

// Sample data - in a real app this would come from an API
const data = [
  { date: "5 Jun", frt: 35, calls: 800, csat: 91, resolution: 72 },
  { date: "12 Jun", frt: 42, calls: 750, csat: 95, resolution: 78 },
  { date: "19 Jun", frt: 55, calls: 900, csat: 93, resolution: 75 },
  { date: "26 Jun", frt: 48, calls: 950, csat: 89, resolution: 68 },
]

export default function AnalyticsTab2() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* FRT Card */}
        <Card className="border-green-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-5xl font-bold text-navy-800">49s</div>
                <div className="text-sm text-gray-600">FRT - 28d avg.</div>
                <div className="text-sm text-red-500">↑ 11s v prev</div>
              </div>
            </div>
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} tickMargin={10}/>
                  <YAxis tickLine={false} axisLine={false} unit="s" tickMargin={10} />
                  <Line type="monotone" dataKey="frt" stroke="#047857" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Calls Card */}
        <Card className="border-green-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-5xl font-bold text-navy-800">884</div>
                <div className="text-sm text-gray-600">Daily Calls - 28d avg.</div>
                <div className="text-sm text-green-500">↑ 42 vs prev</div>
              </div>
            </div>
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} tickMargin={10} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                  <Line type="monotone" dataKey="calls" stroke="#047857" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* CSAT Card */}
        <Card className="border-green-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-5xl font-bold text-navy-800">92.9%</div>
                <div className="text-sm text-gray-600">CSAT - 28d avg.</div>
                <div className="text-sm text-red-500">↓ 3.2% vs prev</div>
              </div>
            </div>
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} tickMargin={10}  />
                  <YAxis tickLine={false} axisLine={false} unit="%" domain={[80, 100]} tickMargin={10} />
                  <Line type="monotone" dataKey="csat" stroke="#047857" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Card */}
        <Card className="border-green-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-5xl font-bold text-navy-800">73.8%</div>
                <div className="text-sm text-gray-600">Resolved - 28d avg.</div>
                <div className="text-sm text-red-500">↓ 5.4% vs prev</div>
              </div>
            </div>
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} tickMargin={10}  />
                  <YAxis tickLine={false} axisLine={false} unit="%" domain={[50, 90]} tickMargin={10} />
                  <Line type="monotone" dataKey="resolution" stroke="#047857" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

