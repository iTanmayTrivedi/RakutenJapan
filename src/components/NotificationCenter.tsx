import { useState } from "react";
import { Bell, Package, Zap, Gift, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

interface Notification {
  id: string;
  icon: typeof Package;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "order" | "deal" | "reward" | "review";
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", icon: Package, title: "Order Shipped", description: "Your order #ord-001 has been shipped via Yamato Transport", time: "2h ago", read: false, type: "order" },
  { id: "n2", icon: Zap, title: "Flash Sale Starting!", description: "Electronics up to 70% off — limited time only", time: "3h ago", read: false, type: "deal" },
  { id: "n3", icon: Gift, title: "Points Earned: 1,500P", description: "You earned bonus points from your latest purchase", time: "1d ago", read: true, type: "reward" },
  { id: "n4", icon: Star, title: "Review Reminder", description: "How was your Sony WH-1000XM6? Share your thoughts!", time: "2d ago", read: true, type: "review" },
  { id: "n5", icon: Zap, title: "Coupon Unlocked!", description: "Use SPRING20 for 20% off your next order", time: "3d ago", read: true, type: "deal" },
];

const typeColors: Record<string, string> = {
  order: "bg-primary/10 text-primary",
  deal: "bg-destructive/10 text-destructive",
  reward: "bg-points/10 text-points",
  review: "bg-success/10 text-success",
};

export const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const { t } = useLanguage();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="text-primary-foreground hover:bg-primary-foreground/10 relative"
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground h-4 min-w-4 flex items-center justify-center p-0 text-[10px]">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full sm:mt-2 w-[calc(100vw-1rem)] sm:w-80 max-w-sm bg-card rounded-xl shadow-2xl border z-50 animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-bold text-sm">{t("notif.title")}</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">{t("notif.empty")}</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${!n.read ? "bg-accent/30" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${typeColors[n.type]}`}>
                      <n.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{n.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                    <button onClick={() => dismiss(n.id)} className="text-muted-foreground hover:text-foreground shrink-0 self-start mt-1">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
