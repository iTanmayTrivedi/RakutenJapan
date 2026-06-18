import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { PRODUCTS } from "@/data/mockData";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ProductReviews } from "@/components/ProductReviews";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const product = PRODUCTS.find((p) => p.slug === slug) || null;
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { addViewed } = useRecentlyViewed();

  useEffect(() => {
    if (product) addViewed(product.id);
  }, [product?.id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast({ title: "Please login", description: "You need to login to add items to cart", variant: "destructive" });
      return;
    }
    setAddingToCart(true);
    await new Promise((r) => setTimeout(r, 600));
    await addToCart(product!.id, quantity);
    setAddingToCart(false);
    toast({ title: "Added to cart!", description: `${product!.name} x${quantity}` });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0;
  const points = Math.floor(product.price * quantity * product.points_multiplier);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
          <div className="bg-card rounded-lg overflow-hidden shadow-card">
            <img src={product.image_url} alt={product.name} className="w-full aspect-square object-cover" />
          </div>

          <div className="space-y-4">
            {product.categories && <Badge variant="outline" className="text-xs">{product.categories.name}</Badge>}
            <h1 className="text-2xl font-bold">{product.name}</h1>
            {product.seller_name && <p className="text-sm text-muted-foreground">Sold by <span className="font-medium text-foreground">{product.seller_name}</span></p>}

            <div className="flex items-center gap-2">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-points text-points' : 'text-border'}`} />)}</div>
              <span className="text-sm text-muted-foreground">({product.review_count} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-primary">¥{product.price.toLocaleString()}</span>
              {product.original_price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">¥{product.original_price.toLocaleString()}</span>
                  <Badge className="bg-primary text-primary-foreground">-{discount}% OFF</Badge>
                </>
              )}
            </div>

            {product.points_multiplier > 1 && (
              <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg points-badge">
                <span className="font-bold">🅿️ Earn {points.toLocaleString()} points</span>
                <Badge variant="secondary" className="font-bold">x{product.points_multiplier}</Badge>
              </div>
            )}

            {product.description && <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>}

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button size="lg" className="flex-1 font-bold gap-2" onClick={handleAddToCart} disabled={addingToCart}>
                {addingToCart ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className="h-5 w-5" />}
                {addingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Button size="lg" variant="outline"><Heart className="h-5 w-5" /></Button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Truck className="h-4 w-4 text-success" /> Free shipping ¥3,980+</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-success" /> Buyer protection</div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <ProductReviews productId={product.id} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
