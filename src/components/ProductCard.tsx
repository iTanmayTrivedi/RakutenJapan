import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  imageUrl?: string | null;
  rating: number;
  reviewCount: number;
  sellerName?: string | null;
  pointsMultiplier: number;
  slug: string;
}

export const ProductCard = ({
  id, name, price, originalPrice, imageUrl, rating, reviewCount, sellerName, pointsMultiplier, slug,
}: ProductCardProps) => {
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  const points = Math.floor(price * pointsMultiplier);

  return (
    <Link
      to={`/product/${slug}`}
      className="group block bg-card rounded-lg overflow-hidden shadow-card lift press animate-fade-in"
    >
      <div className="relative aspect-square overflow-hidden bg-muted shine">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No Image</div>
        )}
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold">
            -{discount}%
          </Badge>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors min-h-[2.5rem]">
          {name}
        </h3>

        {sellerName && (
          <p className="text-xs text-muted-foreground mb-1">{sellerName}</p>
        )}

        <div className="flex items-center gap-1 mb-1">
          <Star className="h-3.5 w-3.5 fill-points text-points" />
          <span className="text-xs font-medium">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-bold text-primary">¥{price.toLocaleString()}</span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">¥{originalPrice.toLocaleString()}</span>
          )}
        </div>

        {pointsMultiplier > 1 && (
          <div className="inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-semibold px-2 py-0.5 rounded-full points-badge">
            <span>🅿️ {points.toLocaleString()} pts</span>
            <span className="text-primary font-bold">x{pointsMultiplier}</span>
          </div>
        )}
      </div>
    </Link>
  );
};
