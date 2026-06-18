import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/hooks/useAuth";
import { mockStorage, PRODUCTS } from "@/data/mockData";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const WishlistPage = () => {
  const { user } = useAuth();
  const [wishlistIds] = useState(() => mockStorage.getWishlist());
  const items = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  if (!user) return (<div className="min-h-screen bg-background"><Header /><div className="container py-20 text-center"><Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><h1 className="text-2xl font-bold mb-2">Your wishlist</h1><p className="text-muted-foreground mb-4">Please login to view your wishlist</p><Link to="/auth"><Button>Sign In</Button></Link></div><Footer /></div>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        {items.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground"><Heart className="h-16 w-16 mx-auto mb-4" /><p className="text-lg">Your wishlist is empty</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((p) => (<ProductCard key={p.id} id={p.id} name={p.name} price={p.price} originalPrice={p.original_price} imageUrl={p.image_url} rating={p.rating} reviewCount={p.review_count} sellerName={p.seller_name} pointsMultiplier={p.points_multiplier} slug={p.slug} />))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
