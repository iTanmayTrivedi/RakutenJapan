import { useMemo } from "react";
import { Users, Crown, UserCheck, UserMinus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface CustomerSegmentationProps {
  profiles: any[];
  orders: any[];
}

const SEGMENT_COLORS = [
  "hsl(350, 80%, 45%)",
  "hsl(35, 90%, 55%)",
  "hsl(142, 70%, 40%)",
  "hsl(220, 70%, 55%)",
];

interface Segment {
  name: string;
  count: number;
  icon: typeof Crown;
  description: string;
  color: string;
}

export const CustomerSegmentation = ({ profiles, orders }: CustomerSegmentationProps) => {
  const segments = useMemo(() => {
    // Group orders by user
    const userOrders: Record<string, { count: number; totalSpent: number; lastOrder: string }> = {};
    orders.forEach((o) => {
      if (!userOrders[o.user_id]) {
        userOrders[o.user_id] = { count: 0, totalSpent: 0, lastOrder: "" };
      }
      userOrders[o.user_id].count++;
      userOrders[o.user_id].totalSpent += o.total || 0;
      if (o.created_at > (userOrders[o.user_id].lastOrder || "")) {
        userOrders[o.user_id].lastOrder = o.created_at;
      }
    });

    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    let vip = 0, active = 0, atRisk = 0, dormant = 0;

    profiles.forEach((p) => {
      const uo = userOrders[p.user_id];
      if (!uo) {
        dormant++;
        return;
      }
      const daysSince = (now - new Date(uo.lastOrder).getTime()) / (24 * 60 * 60 * 1000);

      if (uo.count >= 3 && uo.totalSpent >= 10000) {
        vip++;
      } else if (daysSince < 30) {
        active++;
      } else if (daysSince < 90) {
        atRisk++;
      } else {
        dormant++;
      }
    });

    const result: Segment[] = [
      { name: "VIP", count: vip, icon: Crown, description: "3+ orders, ¥10k+ spent", color: SEGMENT_COLORS[0] },
      { name: "Active", count: active, icon: UserCheck, description: "Ordered in last 30 days", color: SEGMENT_COLORS[1] },
      { name: "At Risk", count: atRisk, icon: UserMinus, description: "30-90 days inactive", color: SEGMENT_COLORS[2] },
      { name: "Dormant", count: dormant, icon: Users, description: "90+ days or no orders", color: SEGMENT_COLORS[3] },
    ];

    return result;
  }, [profiles, orders]);

  const pieData = segments.filter((s) => s.count > 0).map((s) => ({ name: s.name, value: s.count }));
  const total = segments.reduce((a, s) => a + s.count, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <Users className="h-5 w-5 text-[hsl(220,70%,55%)]" />
        <h3 className="font-bold text-lg">Customer Segmentation</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="bg-card rounded-xl p-4 shadow-[var(--card-shadow)] flex items-center justify-center">
          {total > 0 ? (
            <div className="relative w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl font-bold">{total}</p>
                  <p className="text-xs text-muted-foreground">Users</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8">No user data yet</p>
          )}
        </div>

        {/* Segment Cards */}
        <div className="space-y-2.5">
          {segments.map((seg) => (
            <div
              key={seg.name}
              className="bg-card rounded-xl p-3 shadow-[var(--card-shadow)] flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${seg.color}15` }}
              >
                <seg.icon className="h-4 w-4" style={{ color: seg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">{seg.name}</p>
                  <p className="text-sm font-bold">{seg.count}</p>
                </div>
                <p className="text-xs text-muted-foreground">{seg.description}</p>
                {total > 0 && (
                  <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(seg.count / total) * 100}%`,
                        backgroundColor: seg.color,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
