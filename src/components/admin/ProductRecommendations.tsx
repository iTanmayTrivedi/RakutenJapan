import { useMemo } from "react";
import { Sparkles, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductRecommendationsProps {
  products: any[];
  orders: any[];
}

export const ProductRecommendations = ({ products, orders }: ProductRecommendationsProps) => {
  const recommendations = useMemo(() => {
    // Build product purchase frequency from order data
    // Since we don't have order_items in bulk, use product metrics
    const scored = products.map((p) => {
      const rating = p.rating || 0;
      const reviews = p.review_count || 0;
      const stock = p.stock || 0;
      const price = p.price || 0;

      // Composite recommendation score
      // High rating + high reviews = strong signal
      // Low stock = urgency signal  
      // Featured = boost
      const popularityScore = rating * 20 + reviews * 5;
      const urgencyScore = stock < 10 ? 30 : stock < 50 ? 15 : 0;
      const featuredBoost = p.is_featured ? 20 : 0;
      const priceScore = price > 5000 ? 10 : price > 2000 ? 5 : 0;

      const totalScore = popularityScore + urgencyScore + featuredBoost + priceScore;

      return { ...p, score: totalScore };
    });

    scored.sort((a, b) => b.score - a.score);

    // Cross-sell pairs: group by category
    const categoryGroups: Record<string, any[]> = {};
    products.forEach((p) => {
      const cat = p.categories?.name || "Other";
      if (!categoryGroups[cat]) categoryGroups[cat] = [];
      categoryGroups[cat].push(p);
    });

    const crossSellPairs: { a: any; b: any; reason: string }[] = [];
    Object.entries(categoryGroups).forEach(([cat, items]) => {
      if (items.length >= 2) {
        const sorted = items.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
        crossSellPairs.push({
          a: sorted[0],
          b: sorted[1],
          reason: `Top rated in ${cat}`,
        });
      }
    });

    return {
      topProducts: scored.slice(0, 5),
      crossSell: crossSellPairs.slice(0, 3),
      lowPerformers: scored.filter((p) => p.score < 20).slice(0, 3),
    };
  }, [products, orders]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-5 w-5 text-secondary" />
        <h3 className="font-bold text-lg">Product Recommendations</h3>
      </div>

      {/* Top Recommended */}
      <div className="bg-card rounded-xl p-4 shadow-[var(--card-shadow)]">
        <p className="text-sm font-semibold mb-3 flex items-center gap-1.5">
          <Star className="h-4 w-4 text-[hsl(var(--gold))]" /> Top Recommended Products
        </p>
        <div className="space-y-2.5">
          {recommendations.topProducts.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
              <div className="w-8 h-8 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  Score: {p.score} · ★{p.rating || 0} · {p.review_count || 0} reviews
                </p>
              </div>
              <Badge variant="secondary" className="text-xs shrink-0">
                ¥{p.price?.toLocaleString()}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-sell */}
      {recommendations.crossSell.length > 0 && (
        <div className="bg-card rounded-xl p-4 shadow-[var(--card-shadow)]">
          <p className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-primary" /> Cross-Sell Pairs
          </p>
          <div className="space-y-2">
            {recommendations.crossSell.map((pair, i) => (
              <div key={i} className="flex items-center gap-2 text-sm bg-accent/50 rounded-lg p-2.5">
                <span className="font-medium truncate">{pair.a.name}</span>
                <span className="text-muted-foreground shrink-0">+</span>
                <span className="font-medium truncate">{pair.b.name}</span>
                <Badge variant="outline" className="text-xs ml-auto shrink-0">{pair.reason}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low performers */}
      {recommendations.lowPerformers.length > 0 && (
        <div className="bg-card rounded-xl p-4 shadow-[var(--card-shadow)]">
          <p className="text-sm font-semibold mb-3 text-muted-foreground">⚠ Needs Attention</p>
          <div className="space-y-2">
            {recommendations.lowPerformers.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{p.name}</span>
                <span className="text-xs text-muted-foreground">Score: {p.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
