import { GaugeChart } from './gauge-chart';
import { WeeklyBarChart } from './bar-chart';
import { MetricCard } from './metric-card';
import { CustomerSatisfactionChart } from './donut-chart';

export default function AnalyticsTab1() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto space-y-8 text-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CSAT Today */}
          <div className="p-6 rounded-lg bg-gray-100">
            <h3 className="text-black mb-4">CSAT today</h3>
            <GaugeChart value={92} />
          </div>

          {/* Inbound Calls */}
          <div className="space-y-6 pt-4">
            <MetricCard
              title="Inbound calls today"
              value="596"
              subtitle="Total"
            />
            <MetricCard
              title="Avg. wait time"
              value="58"
              subtitle="sec"
            />
          </div>

          {/* Call Metrics */}
          <div className="space-y-6">
            <MetricCard
              title="Average call time"
              value="4"
              subtitle="min"
              trend={{
                value: 8.1,
                label: "vs yday"
              }}
            />
            <MetricCard
              title="Calls resolved"
              value="75"
              subtitle="%"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CSAT Past 7 Days */}
          <div className="p-6 rounded-lg bg-gray-100">
            <h3 className="text-black mb-4">CSAT (past 7 days)</h3>
            <WeeklyBarChart />
          </div>

          {/* Abandoned Today */}
          <div className="space-y-10 pt-8 ">
            <MetricCard
              title="Abandoned today"
              value="29"
              subtitle="Total"
            />
            <MetricCard
              title="Abandonment rate"
              value="4.9"
              subtitle="%"
            />
          </div>

          {/* Customer Satisfaction */}
          <div className="p-6 rounded-lg bg-gray-100">
            <h3 className="text-black mb-4">Customer Satisfaction</h3>
            <CustomerSatisfactionChart />
          </div>
        </div>
      </div>
    </div>
  )
}
