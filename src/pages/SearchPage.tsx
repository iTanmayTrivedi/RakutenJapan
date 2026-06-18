import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { ProductFilter } from "@/components/ProductFilter";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [filters, setFilters] = useState<{ priceRange: [number, number]; categoryIds: string[] }>({ priceRange: [0, 100000], categoryIds: [] });
  const { products, loading } = useProducts({ searchQuery: query || undefined });

  const filtered = products.filter((p) => {
    const price = Number(p.price);
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
    if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(p.category_id)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-bold">
            {query ? `Results for "${query}"` : "All Products"}
          </h1>
          <span className="text-sm text-muted-foreground">({filtered.length} items)</span>
        </div>

        <div className="flex gap-6">
          <ProductFilter onFilterChange={setFilters} />

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-lg" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                <p className="text-lg">No products found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((p) => (
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
