import { useMemo } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

interface SalesForecastingProps {
  orders: any[];
}

const chartConfig: ChartConfig = {
  actual: { label: "Actual", color: "hsl(350, 80%, 45%)" },
  forecast: { label: "Forecast", color: "hsl(35, 90%, 55%)" },
};

export const SalesForecasting = ({ orders }: SalesForecastingProps) => {
  const { chartData, metrics } = useMemo(() => {
    // Group orders by month
    const monthly: Record<string, number> = {};
    orders.forEach((o) => {
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthly[key] = (monthly[key] || 0) + (o.total || 0);
    });

    const sortedKeys = Object.keys(monthly).sort();
    const values = sortedKeys.map((k) => monthly[k]);

    // Simple moving average forecast (3-period)
    const forecastMonths = 3;
    const avg =
      values.length >= 3
        ? values.slice(-3).reduce((a, b) => a + b, 0) / 3
        : values.length > 0
          ? values.reduce((a, b) => a + b, 0) / values.length
          : 0;

    // Growth trend
    const growthRate =
      values.length >= 2
        ? ((values[values.length - 1] - values[values.length - 2]) / (values[values.length - 2] || 1)) * 100
        : 0;

    const data = sortedKeys.map((k, i) => ({
      month: k,
      actual: Math.round(values[i]),
      forecast: null as number | null,
    }));

    // Add forecast periods
    const lastDate = sortedKeys.length > 0 ? new Date(sortedKeys[sortedKeys.length - 1] + "-01") : new Date();
    for (let i = 1; i <= forecastMonths; i++) {
      const fd = new Date(lastDate);
      fd.setMonth(fd.getMonth() + i);
      const key = `${fd.getFullYear()}-${String(fd.getMonth() + 1).padStart(2, "0")}`;
      const projected = Math.round(avg * (1 + (growthRate / 100) * (i * 0.5)));
      data.push({ month: key, actual: null as any, forecast: projected > 0 ? projected : Math.round(avg) });
    }

    const totalRevenue = values.reduce((a, b) => a + b, 0);
    const nextMonthForecast = data.find((d) => d.forecast)?.forecast || 0;

    return {
      chartData: data,
      metrics: {
        totalRevenue,
        avgMonthly: values.length > 0 ? Math.round(totalRevenue / values.length) : 0,
        growthRate: Math.round(growthRate),
        nextMonthForecast,
      },
    };
  }, [orders]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-lg">Sales Forecasting</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue", value: `¥${metrics.totalRevenue.toLocaleString()}`, icon: null },
          { label: "Monthly Avg", value: `¥${metrics.avgMonthly.toLocaleString()}`, icon: null },
          {
            label: "Growth Trend",
            value: `${metrics.growthRate > 0 ? "+" : ""}${metrics.growthRate}%`,
            icon: metrics.growthRate >= 0 ? ArrowUpRight : ArrowDownRight,
            positive: metrics.growthRate >= 0,
          },
          { label: "Next Month", value: `¥${metrics.nextMonthForecast.toLocaleString()}`, icon: null },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-xl p-3 shadow-[var(--card-shadow)]">
            <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
            <div className="flex items-center gap-1">
              <p className="text-sm font-bold">{m.value}</p>
              {m.icon && (
                <m.icon
                  className={`h-3.5 w-3.5 ${m.positive ? "text-[hsl(var(--success))]" : "text-destructive"}`}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="bg-card rounded-xl p-4 shadow-[var(--card-shadow)]">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => v.slice(5)}
                className="fill-muted-foreground"
              />
              <YAxis tick={{ fontSize: 10 }} className="fill-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="hsl(350, 80%, 45%)"
                fill="hsl(350, 80%, 45%)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="hsl(35, 90%, 55%)"
                fill="hsl(35, 90%, 55%)"
                fillOpacity={0.15}
                strokeWidth={2}
                strokeDasharray="6 3"
              />
            </AreaChart>
          </ChartContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-primary rounded" /> Actual
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-secondary rounded border-dashed" /> Forecast
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
