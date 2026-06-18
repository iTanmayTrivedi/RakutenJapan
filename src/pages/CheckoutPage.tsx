import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { mockStorage } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Landmark, Wallet, Lock, ShieldCheck, Truck } from "lucide-react";
import { CouponInput } from "@/components/CouponInput";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postalCode: "", paymentMethod: "credit-card", cardNumber: "", cardExpiry: "", cardCvc: "" });
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLabel, setCouponLabel] = useState<string | null>(null);
  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.products?.price || 0) * item.quantity, 0);
  const shipping = subtotal >= 3980 ? 0 : 500;
  const total = subtotal + shipping - couponDiscount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.name || !form.email || !form.address || !form.city || !form.postalCode) {
      toast({ title: "Missing fields", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const orderId = `ord-${Date.now()}`;
    const orders = mockStorage.getOrders();
    orders.unshift({ id: orderId, user_id: user.id, total, status: "processing", shipping_address: `${form.name}, ${form.address}, ${form.city} ${form.postalCode}`, payment_method: form.paymentMethod, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    mockStorage.setOrders(orders);

    const orderItems = mockStorage.getOrderItems();
    cartItems.forEach((item) => {
      orderItems.push({ id: `oi-${Date.now()}-${item.product_id}`, order_id: orderId, product_id: item.product_id, product_name: item.products?.name || "Unknown", price: Number(item.products?.price || 0), quantity: item.quantity });
    });
    mockStorage.setOrderItems(orderItems);
    await clearCart();
    setLoading(false);
    navigate(`/order-success/${orderId}`);
  };

  if (!user) return (<div className="min-h-screen bg-background"><Header /><div className="container py-20 text-center"><h1 className="text-2xl font-bold mb-2">Please sign in to checkout</h1><Link to="/auth"><Button>Sign In</Button></Link></div><Footer /></div>);
  if (cartItems.length === 0) return (<div className="min-h-screen bg-background"><Header /><div className="container py-20 text-center"><h1 className="text-2xl font-bold mb-2">Your cart is empty</h1><Link to="/"><Button>Continue Shopping</Button></Link></div><Footer /></div>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Shipping Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="name">Full Name *</Label><Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Taro Yamada" required /></div>
                <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="taro@example.com" required /></div>
                <div className="space-y-2"><Label htmlFor="phone">Phone *</Label><Input id="phone" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="090-1234-5678" required /></div>
                <div className="space-y-2"><Label htmlFor="postalCode">Postal Code *</Label><Input id="postalCode" value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} placeholder="100-0001" required /></div>
                <div className="sm:col-span-2 space-y-2"><Label htmlFor="address">Address *</Label><Input id="address" value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="1-1-1 Chiyoda" required /></div>
                <div className="space-y-2"><Label htmlFor="city">City *</Label><Input id="city" value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Tokyo" required /></div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Payment Method</h2>
              <RadioGroup value={form.paymentMethod} onValueChange={(v) => updateField("paymentMethod", v)} className="space-y-3">
                {[{ v: "credit-card", icon: CreditCard, label: "Credit / Debit Card", sub: "Visa, Mastercard, JCB, AMEX" }, { v: "paypal", icon: Wallet, label: "PayPal", sub: "Pay securely with PayPal" }, { v: "netbanking", icon: Landmark, label: "Net Banking", sub: "Direct bank transfer" }].map((pm) => (
                  <label key={pm.v} className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${form.paymentMethod === pm.v ? "border-primary bg-accent" : "border-border hover:border-primary/50"}`}>
                    <RadioGroupItem value={pm.v} /><pm.icon className="h-5 w-5 text-primary" /><div><p className="font-medium text-sm">{pm.label}</p><p className="text-xs text-muted-foreground">{pm.sub}</p></div>
                  </label>
                ))}
              </RadioGroup>
              {form.paymentMethod === "credit-card" && (
                <div className="mt-4 space-y-4 animate-fade-in">
                  <div className="space-y-2"><Label>Card Number</Label><Input value={form.cardNumber} onChange={(e) => updateField("cardNumber", e.target.value)} placeholder="4242 4242 4242 4242" maxLength={19} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Expiry</Label><Input value={form.cardExpiry} onChange={(e) => updateField("cardExpiry", e.target.value)} placeholder="MM/YY" maxLength={5} /></div>
                    <div className="space-y-2"><Label>CVC</Label><Input value={form.cardCvc} onChange={(e) => updateField("cardCvc", e.target.value)} placeholder="123" maxLength={4} /></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-card sticky top-32">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (<div key={item.id} className="flex justify-between text-sm"><span className="text-muted-foreground line-clamp-1 flex-1 mr-2">{item.products?.name} x{item.quantity}</span><span className="font-medium whitespace-nowrap">¥{(Number(item.products?.price || 0) * item.quantity).toLocaleString()}</span></div>))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">¥{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-medium text-success">{shipping === 0 ? "Free" : `¥${shipping}`}</span></div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Coupon</span><span className="font-medium text-success">-¥{couponDiscount.toLocaleString()}</span></div>
                )}
                <div className="border-t pt-2 flex justify-between"><span className="font-bold">Total</span><span className="font-bold text-lg text-primary">¥{Math.max(0, total).toLocaleString()}</span></div>
              </div>
              <div className="border-t pt-3 mt-3">
                <CouponInput
                  subtotal={subtotal}
                  onApply={(discount, label) => { setCouponDiscount(discount); setCouponLabel(label); }}
                  onRemove={() => { setCouponDiscount(0); setCouponLabel(null); }}
                  appliedCoupon={couponLabel}
                />
              </div>
              <Button type="submit" className="w-full mt-4 font-bold gap-2" size="lg" disabled={loading}>
                {loading ? <span className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                {loading ? "Processing Order..." : "Place Order"}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">🔒 Your payment information is secure and encrypted</p>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
