import { useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductFilter } from "@/components/ProductFilter";

const categoryNames: Record<string, string> = {
  electronics: "Electronics",
  fashion: "Fashion",
  food: "Food & Grocery",
  home: "Home & Living",
  beauty: "Beauty",
  sports: "Sports",
  books: "Books",
  toys: "Toys & Kids",
};

const CategoryPage = () => {
  const { slug } = useParams();
  const { products, loading } = useProducts({ categorySlug: slug });
  const [filters, setFilters] = useState<{ priceRange: [number, number]; categoryIds: string[] }>({ priceRange: [0, 100000], categoryIds: [] });

  const filtered = products.filter((p) => {
    const price = Number(p.price);
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">{categoryNames[slug || ""] || slug}</h1>

        <div className="flex gap-6">
          <ProductFilter onFilterChange={setFilters} initialCategorySlug={slug} />

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-lg" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                <p className="text-lg">No products in this category yet</p>
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

export default CategoryPage;
