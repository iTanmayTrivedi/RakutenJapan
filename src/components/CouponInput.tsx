import { useState } from "react";
import { Tag, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const COUPONS: Record<string, { discount: number; type: "percent" | "fixed"; label: string }> = {
  WELCOME10: { discount: 10, type: "percent", label: "10% off welcome discount" },
  SAVE500: { discount: 500, type: "fixed", label: "¥500 off" },
  SPRING20: { discount: 20, type: "percent", label: "20% spring sale" },
  RAKUTEN15: { discount: 15, type: "percent", label: "15% member discount" },
};

interface CouponInputProps {
  subtotal: number;
  onApply: (discount: number, label: string) => void;
  onRemove: () => void;
  appliedCoupon: string | null;
}

export const CouponInput = ({ subtotal, onApply, onRemove, appliedCoupon }: CouponInputProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const handleApply = () => {
    const coupon = COUPONS[code.toUpperCase().trim()];
    if (!coupon) {
      setError(t("coupon.invalid"));
      return;
    }
    setError("");
    const discount = coupon.type === "percent" ? Math.round(subtotal * (coupon.discount / 100)) : coupon.discount;
    onApply(discount, `${code.toUpperCase()} — ${coupon.label}`);
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-accent rounded-lg px-3 py-2 animate-fade-in">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-success" />
          <span className="text-xs font-medium text-accent-foreground">{appliedCoupon}</span>
        </div>
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(""); }}
            placeholder={t("coupon.placeholder")}
            className="pl-8 h-9 text-sm"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApply())}
          />
        </div>
        <Button size="sm" variant="outline" onClick={handleApply} disabled={!code.trim()} className="h-9 text-xs font-bold">
          {t("coupon.apply")}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-[10px] text-muted-foreground">{t("coupon.hint")}</p>
    </div>
  );
};
