interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function MetricCard({ title, value, subtitle, trend }: MetricCardProps) {
  return (
    <div className="p-6 rounded-lg bg-[#e5e7eb]"> {/* Card background color */}
      <h3 className="text-black mb-4">{title}</h3> {/* Title text */}
      <div className="space-y-1">
        <div className="flex items-baseline">
          <span className="text-5xl font-bold text-black">{value}</span> {/* Value text */}
          {subtitle && (
            <span className="ml-2 text-black">{subtitle}</span> 
          )}
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            <span className={trend.value > 0 ? "text-red-500" : "text-green-500"}>
              {trend.value > 0 ? "▲" : "▼"} {Math.abs(trend.value)}%
            </span>
            <span className="text-black">{trend.label}</span> {/* Trend label */}
          </div>
        )}
      </div>
    </div>
  );
}
