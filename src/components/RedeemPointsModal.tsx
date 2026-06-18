import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Award, Sparkles, Truck, Gift, Tag, Check, Coins } from "lucide-react";

interface Reward {
  type: string;
  label: string;
  desc: string;
  cost: number;
  icon: typeof Gift;
}

const REWARDS: Reward[] = [
  { type: "shipping", label: "Free Shipping", desc: "On your next order", cost: 500, icon: Truck },
  { type: "coupon_500", label: "¥500 Coupon", desc: "Site-wide discount", cost: 500, icon: Tag },
  { type: "coupon_1000", label: "¥1,000 Coupon", desc: "Min. order ¥3,000", cost: 1000, icon: Tag },
  { type: "mystery", label: "Mystery Gift", desc: "Surprise reward 🎁", cost: 2000, icon: Gift },
];

interface RedeemPointsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentPoints: number;
  onRedeemed: (newBalance: number) => void;
}

export const RedeemPointsModal = ({
  open, onOpenChange, userId, currentPoints, onRedeemed,
}: RedeemPointsModalProps) => {
  const { toast } = useToast();
  const [selected, setSelected] = useState<Reward | null>(null);
  const [step, setStep] = useState<"choose" | "celebrating">("choose");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemedReward, setRedeemedReward] = useState<Reward | null>(null);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSelected(null);
        setStep("choose");
        setRedeemedReward(null);
      }, 300);
    }
  }, [open]);

  const confettiPieces = useMemo(
    () => Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 1.4 + Math.random() * 1.2,
      rotation: Math.random() * 360,
      color: ["bg-primary", "bg-secondary", "bg-yellow-400", "bg-pink-500", "bg-purple-500"][i % 5],
      size: 6 + Math.random() * 8,
    })),
    [step]
  );

  const handleRedeem = async () => {
    if (!selected) return;
    if (currentPoints < selected.cost) {
      toast({ title: "Not enough points", variant: "destructive" });
      return;
    }
    setRedeeming(true);
    try {
      const newBalance = currentPoints - selected.cost;
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ points: newBalance })
        .eq("user_id", userId);
      if (updateErr) throw updateErr;

      const { error: insertErr } = await supabase
        .from("point_redemptions")
        .insert({
          user_id: userId,
          points_redeemed: selected.cost,
          reward_type: selected.type,
          reward_label: selected.label,
        });
      if (insertErr) throw insertErr;

      setRedeemedReward(selected);
      setStep("celebrating");
      onRedeemed(newBalance);
    } catch (err) {
      console.error(err);
      toast({ title: "Redemption failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-0">
        {step === "choose" ? (
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl">Redeem Your Points</DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You have <span className="font-bold text-primary">{currentPoints.toLocaleString()}</span> points
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {REWARDS.map((r) => {
                const Icon = r.icon;
                const isSelected = selected?.type === r.type;
                const affordable = currentPoints >= r.cost;
                return (
                  <button
                    key={r.type}
                    onClick={() => affordable && setSelected(r)}
                    disabled={!affordable}
                    className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-accent shadow-lg scale-[1.02]"
                        : affordable
                        ? "border-border/40 hover:border-primary/40 bg-muted/20"
                        : "border-border/30 bg-muted/10 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    <Icon className={`h-6 w-6 mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="font-bold text-sm">{r.label}</p>
                    <p className="text-xs text-muted-foreground mb-2">{r.desc}</p>
                    <Badge variant={affordable ? "secondary" : "outline"} className="text-[10px] gap-1 px-1.5 py-0">
                      <Coins className="h-2.5 w-2.5" />
                      {r.cost.toLocaleString()} pts
                    </Badge>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleRedeem}
              disabled={!selected || redeeming}
              className="w-full mt-5 h-11 rounded-xl font-bold gap-2"
            >
              {redeeming ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {selected ? `Redeem for ${selected.cost.toLocaleString()} pts` : "Select a reward"}
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground p-10 text-center overflow-hidden min-h-[420px] flex flex-col items-center justify-center">
            {/* Confetti */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {confettiPieces.map((p) => (
                <div
                  key={p.id}
                  className={`absolute top-0 ${p.color} rounded-sm`}
                  style={{
                    left: `${p.left}%`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
                    transform: `rotate(${p.rotation}deg)`,
                  }}
                />
              ))}
            </div>

            {/* Pulse rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-32 h-32 rounded-full border-2 border-primary-foreground/30 animate-ping" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ animationDelay: "0.3s" }}>
              <div className="w-48 h-48 rounded-full border-2 border-primary-foreground/20 animate-ping" />
            </div>

            {/* Trophy icon */}
            <div
              className="relative w-24 h-24 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mb-5"
              style={{ animation: "trophyPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
            >
              <Award className="h-12 w-12" style={{ animation: "iconSpin 1s ease-out" }} />
            </div>

            <h2 className="text-3xl font-black mb-2 relative" style={{ animation: "slideUp 0.5s 0.2s both" }}>
              Congratulations! 🎉
            </h2>
            <p className="text-lg opacity-95 mb-1 relative" style={{ animation: "slideUp 0.5s 0.3s both" }}>
              You redeemed
            </p>
            <p className="text-2xl font-bold mb-6 relative" style={{ animation: "slideUp 0.5s 0.4s both" }}>
              {redeemedReward?.label}
            </p>

            <Button
              onClick={() => onOpenChange(false)}
              variant="secondary"
              className="font-bold relative"
              style={{ animation: "slideUp 0.5s 0.6s both" }}
            >
              <Check className="h-4 w-4 mr-1" /> Awesome!
            </Button>
          </div>
        )}
      </DialogContent>

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
        }
        @keyframes trophyPop {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        @keyframes iconSpin {
          0% { transform: rotate(-180deg) scale(0); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </Dialog>
  );
};
