import { useMemo } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FraudDetectionProps {
  orders: any[];
  profiles: any[];
}

interface FraudAlert {
  orderId: string;
  userId: string;
  type: string;
  severity: "high" | "medium" | "low";
  reason: string;
  total: number;
  date: string;
}

export const FraudDetection = ({ orders, profiles }: FraudDetectionProps) => {
  const { alerts, stats } = useMemo(() => {
    const flagged: FraudAlert[] = [];

    // Group orders by user
    const userOrders: Record<string, any[]> = {};
    orders.forEach((o) => {
      if (!userOrders[o.user_id]) userOrders[o.user_id] = [];
      userOrders[o.user_id].push(o);
    });

    // Rule 1: Unusually high order value (>3x average)
    const avgTotal = orders.length > 0 ? orders.reduce((s, o) => s + (o.total || 0), 0) / orders.length : 0;
    const highThreshold = avgTotal * 3;

    orders.forEach((o) => {
      if (o.total > highThreshold && highThreshold > 0) {
        flagged.push({
          orderId: o.id,
          userId: o.user_id,
          type: "High Value",
          severity: o.total > highThreshold * 2 ? "high" : "medium",
          reason: `Order ¥${o.total.toLocaleString()} exceeds 3x avg (¥${Math.round(avgTotal).toLocaleString()})`,
          total: o.total,
          date: o.created_at,
        });
      }
    });

    // Rule 2: Rapid successive orders (multiple orders within 5 minutes)
    Object.entries(userOrders).forEach(([userId, uOrders]) => {
      const sorted = uOrders.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      for (let i = 1; i < sorted.length; i++) {
        const diff = new Date(sorted[i].created_at).getTime() - new Date(sorted[i - 1].created_at).getTime();
        if (diff < 5 * 60 * 1000) {
          flagged.push({
            orderId: sorted[i].id,
            userId,
            type: "Rapid Orders",
            severity: "medium",
            reason: `2 orders within ${Math.round(diff / 1000)}s by same user`,
            total: sorted[i].total,
            date: sorted[i].created_at,
          });
        }
      }
    });

    // Rule 3: New account + high spend
    profiles.forEach((p) => {
      const accountAge = (Date.now() - new Date(p.created_at).getTime()) / (24 * 60 * 60 * 1000);
      const uo = userOrders[p.user_id] || [];
      const totalSpent = uo.reduce((s: number, o: any) => s + (o.total || 0), 0);

      if (accountAge < 7 && totalSpent > 50000) {
        flagged.push({
          orderId: uo[0]?.id || "",
          userId: p.user_id,
          type: "New Account",
          severity: "high",
          reason: `¥${totalSpent.toLocaleString()} spent within ${Math.round(accountAge)} days of signup`,
          total: totalSpent,
          date: p.created_at,
        });
      }
    });

    // Rule 4: Cancelled order pattern
    Object.entries(userOrders).forEach(([userId, uOrders]) => {
      const cancelled = uOrders.filter((o) => o.status === "cancelled");
      if (cancelled.length >= 3) {
        flagged.push({
          orderId: cancelled[0].id,
          userId,
          type: "Cancel Pattern",
          severity: "low",
          reason: `${cancelled.length} cancelled orders from same user`,
          total: 0,
          date: cancelled[cancelled.length - 1].created_at,
        });
      }
    });

    // Deduplicate by orderId+type
    const seen = new Set<string>();
    const unique = flagged.filter((f) => {
      const key = `${f.orderId}-${f.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    unique.sort((a, b) => {
      const sev = { high: 3, medium: 2, low: 1 };
      return sev[b.severity] - sev[a.severity];
    });

    return {
      alerts: unique,
      stats: {
        total: unique.length,
        high: unique.filter((a) => a.severity === "high").length,
        medium: unique.filter((a) => a.severity === "medium").length,
        low: unique.filter((a) => a.severity === "low").length,
        riskScore: Math.min(
          100,
          orders.length > 0
            ? Math.round((unique.length / orders.length) * 100 * 3)
            : 0
        ),
      },
    };
  }, [orders, profiles]);

  const severityConfig = {
    high: { color: "text-destructive", bg: "bg-destructive/10", icon: XCircle },
    medium: { color: "text-[hsl(var(--gold))]", bg: "bg-[hsl(var(--gold))]/10", icon: AlertTriangle },
    low: { color: "text-muted-foreground", bg: "bg-muted", icon: AlertTriangle },
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <ShieldAlert className="h-5 w-5 text-destructive" />
        <h3 className="font-bold text-lg">Fraud Detection</h3>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card rounded-xl p-3 shadow-[var(--card-shadow)]">
          <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">{stats.riskScore}%</p>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${stats.riskScore}%`,
                  backgroundColor:
                    stats.riskScore > 50
                      ? "hsl(0, 84%, 60%)"
                      : stats.riskScore > 25
                        ? "hsl(40, 85%, 55%)"
                        : "hsl(142, 70%, 40%)",
                }}
              />
            </div>
          </div>
        </div>
        {[
          { label: "Total Alerts", value: stats.total, color: "text-foreground" },
          { label: "High Risk", value: stats.high, color: "text-destructive" },
          { label: "Medium Risk", value: stats.medium, color: "text-[hsl(var(--gold))]" },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-xl p-3 shadow-[var(--card-shadow)]">
            <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
            <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Alert List */}
      <div className="bg-card rounded-xl p-4 shadow-[var(--card-shadow)]">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-10 w-10 mx-auto text-[hsl(var(--success))] mb-2" />
            <p className="text-sm font-medium">No fraud alerts detected</p>
            <p className="text-xs text-muted-foreground mt-1">All transactions look clean</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <p className="text-sm font-semibold mb-2">Recent Alerts</p>
            {alerts.slice(0, 8).map((alert, i) => {
              const cfg = severityConfig[alert.severity];
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-lg p-2.5 ${cfg.bg}`}
                >
                  <cfg.icon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={alert.severity === "high" ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {alert.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        #{alert.orderId.slice(0, 8)}
                      </span>
                    </div>
                    <p className="text-xs mt-1">{alert.reason}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(alert.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
