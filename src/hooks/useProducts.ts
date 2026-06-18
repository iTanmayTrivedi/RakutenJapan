import { useEffect, useState } from "react";
import { PRODUCTS, CATEGORIES, type MockProduct } from "@/data/mockData";

export function useProducts(options?: { categorySlug?: string; searchQuery?: string; featured?: boolean; limit?: number }) {
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let result = [...PRODUCTS];

    if (options?.categorySlug) {
      const cat = CATEGORIES.find((c) => c.slug === options.categorySlug);
      if (cat) result = result.filter((p) => p.category_id === cat.id);
    }

    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (options?.featured) {
      result = result.filter((p) => p.is_featured);
    }

    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    // Simulate async
    setTimeout(() => {
      setProducts(result);
      setLoading(false);
    }, 100);
  }, [options?.categorySlug, options?.searchQuery, options?.featured, options?.limit]);

  return { products, loading };
}
