import { History } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { PRODUCTS } from "@/data/mockData";
import { useLanguage } from "@/hooks/useLanguage";

export const RecentlyViewed = () => {
  const { viewedIds } = useRecentlyViewed();
  const { t } = useLanguage();

  if (viewedIds.length === 0) return null;

  const products = viewedIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 8);

  if (products.length === 0) return null;

  return (
    <section className="container py-6">
      <div className="flex items-center gap-2 mb-5">
        <History className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-bold">{t("section.recent")}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard
            key={p!.id}
            id={p!.id}
            name={p!.name}
            price={p!.price}
            originalPrice={p!.original_price}
            imageUrl={p!.image_url}
            rating={p!.rating}
            reviewCount={p!.review_count}
            sellerName={p!.seller_name}
            pointsMultiplier={p!.points_multiplier}
            slug={p!.slug}
          />
        ))}
      </div>
    </section>
  );
};
