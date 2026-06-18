import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { AIChatbot } from "@/components/AIChatbot";
import { FlashSaleCountdown } from "@/components/FlashSaleCountdown";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift, Truck, ShieldCheck, Coins } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const featureKeys = [
  { icon: Coins, titleKey: "feat.points", descKey: "feat.points.desc" },
  { icon: Truck, titleKey: "feat.shipping", descKey: "feat.shipping.desc" },
  { icon: ShieldCheck, titleKey: "feat.protection", descKey: "feat.protection.desc" },
  { icon: Gift, titleKey: "feat.deals", descKey: "feat.deals.desc" },
];

const Index = () => {
  const { t } = useLanguage();
  const { products: featured, loading: loadingFeatured } = useProducts({ featured: true, limit: 12 });
  const { products: latest, loading: loadingLatest } = useProducts({ limit: 20 });

  const featuresRef = useScrollReveal<HTMLElement>();
  const categoryRef = useScrollReveal<HTMLDivElement>();
  const flashRef = useScrollReveal<HTMLDivElement>();
  const recentRef = useScrollReveal<HTMLDivElement>();
  const featuredRef = useScrollReveal<HTMLElement>();
  const latestRef = useScrollReveal<HTMLElement>();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />

      {/* Features strip */}
      <section ref={featuresRef} className="bg-card border-b reveal">
        <div className="container py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featureKeys.map((f) => (
              <div key={f.titleKey} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[8deg]">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t(f.titleKey)}</p>
                  <p className="text-xs text-muted-foreground">{t(f.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div ref={categoryRef} className="reveal">
        <CategoryGrid />
      </div>

      <div ref={flashRef} className="reveal">
        <FlashSaleCountdown />
      </div>

      <div ref={recentRef} className="reveal">
        <RecentlyViewed />
      </div>

      {/* Featured Products */}
      <section ref={featuredRef} className="container py-6 reveal">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">{t("section.featured")}</h2>
        </div>
        {loadingFeatured ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p, i) => (
              <div
                key={p.id}
                className="reveal is-revealed"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <ProductCard
                  id={p.id}
                  name={p.name}
                  price={Number(p.price)}
                  originalPrice={p.original_price ? Number(p.original_price) : null}
                  imageUrl={p.image_url}
                  rating={Number(p.rating)}
                  reviewCount={p.review_count}
                  sellerName={p.seller_name}
                  pointsMultiplier={p.points_multiplier}
                  slug={p.slug}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Latest Products */}
      <section ref={latestRef} className="container py-6 reveal">
        <h2 className="text-xl font-bold mb-5">{t("section.new")}</h2>
        {loadingLatest ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latest.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={Number(p.price)}
                originalPrice={p.original_price ? Number(p.original_price) : null}
                imageUrl={p.image_url}
                rating={Number(p.rating)}
                reviewCount={p.review_count}
                sellerName={p.seller_name}
                pointsMultiplier={p.points_multiplier}
                slug={p.slug}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
