import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Clock, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { PRODUCTS } from "@/data/mockData";

const FLASH_SALE_PRODUCTS = PRODUCTS.filter((p) => p.original_price && p.original_price > p.price).slice(0, 6);

const getEndOfDay = () => {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return end.getTime() - now.getTime();
};

export const FlashSaleCountdown = () => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(getEndOfDay());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getEndOfDay());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <section className="container py-6">
      <div className="bg-gradient-to-r from-primary to-destructive rounded-xl p-3 sm:p-5 shadow-lg overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-20 w-24 h-24 bg-primary-foreground/5 rounded-full translate-y-1/2" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-black text-primary-foreground flex items-center gap-1.5">
                  <Flame className="h-4 w-4" />
                  {t("flash.title")}
                </h2>
                <p className="text-xs text-primary-foreground/80">{t("flash.subtitle")}</p>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary-foreground/80" />
              <div className="flex gap-1">
                {[
                  { value: hours, label: "H" },
                  { value: minutes, label: "M" },
                  { value: seconds, label: "S" },
                ].map((unit, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="bg-primary-foreground text-primary font-mono font-black text-sm sm:text-lg w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg flex items-center justify-center shadow-md">
                      {String(unit.value).padStart(2, "0")}
                    </div>
                    {i < 2 && <span className="text-primary-foreground font-bold text-sm sm:text-lg">:</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {FLASH_SALE_PRODUCTS.map((product) => {
              const discount = product.original_price
                ? Math.round((1 - product.price / product.original_price) * 100)
                : 0;
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="bg-primary-foreground rounded-lg p-2 hover:shadow-lg transition-all hover:scale-[1.03] group"
                >
                  <div className="relative aspect-square rounded overflow-hidden mb-1.5">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-1 left-1 bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0">
                      -{discount}%
                    </Badge>
                  </div>
                  <p className="text-[11px] font-medium line-clamp-1 text-foreground">{product.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-primary">¥{product.price.toLocaleString()}</span>
                    {product.original_price && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        ¥{product.original_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
