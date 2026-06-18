import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CartPage = () => {
  const { user } = useAuth();
  const { cartItems, loading, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.products?.price || 0) * item.quantity;
  }, 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-4">Please login to view your cart</p>
          <Link to="/auth"><Button>Sign In</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart ({cartItems.length})</h1>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <Link to="/"><Button>Continue Shopping</Button></Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 sm:gap-4 bg-card rounded-lg p-3 sm:p-4 shadow-card animate-fade-in">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {item.products?.image_url ? (
                      <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.products?.slug}`} className="text-sm font-medium hover:text-primary line-clamp-2">
                      {item.products?.name}
                    </Link>
                    <p className="text-base sm:text-lg font-bold text-primary mt-1">¥{Number(item.products?.price || 0).toLocaleString()}</p>
                    <div className="flex items-center justify-between mt-2 sm:hidden">
                      <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end justify-between">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center border rounded-md">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-card rounded-lg p-5 sm:p-6 shadow-card h-fit lg:sticky lg:top-32">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">¥{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-success">{subtotal >= 3980 ? "Free" : "¥500"}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg text-primary">
                    ¥{(subtotal + (subtotal >= 3980 ? 0 : 500)).toLocaleString()}
                  </span>
                </div>
              </div>
              <Link to="/checkout">
                <Button className="w-full mt-4 font-bold" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
