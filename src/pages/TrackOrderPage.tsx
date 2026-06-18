import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { mockStorage } from "@/data/mockData";
import { Package, Truck, CheckCircle, Clock, MapPin, ArrowLeft } from "lucide-react";

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock, description: "Your order has been received" },
  { key: "processing", label: "Processing", icon: Package, description: "We're preparing your items" },
  { key: "shipped", label: "Shipped", icon: Truck, description: "Your order is on its way" },
  { key: "delivered", label: "Delivered", icon: CheckCircle, description: "Order delivered successfully" },
];

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const order = user ? mockStorage.getOrders().find((o) => o.id === orderId && o.user_id === user.id) : null;
  const orderItems = mockStorage.getOrderItems().filter((i) => i.order_id === orderId);
  const currentStepIndex = statusSteps.findIndex((s) => s.key === order?.status) ?? 0;

  if (!user) return (<div className="min-h-screen bg-background"><Header /><div className="container py-20 text-center"><h1 className="text-2xl font-bold mb-4">Please sign in to track orders</h1><Link to="/auth"><Button>Sign In</Button></Link></div><Footer /></div>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 max-w-3xl">
        <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back to Orders</Link>
        {!order ? (
          <div className="py-20 text-center text-muted-foreground"><Package className="h-16 w-16 mx-auto mb-4" /><p className="text-lg font-bold">Order not found</p></div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between"><div><h1 className="text-xl font-bold">Order #{order.id.slice(0, 8).toUpperCase()}</h1><p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p></div><span className="text-lg font-bold text-primary">¥{Number(order.total).toLocaleString()}</span></div>
            <div className="bg-card rounded-xl p-6 shadow-card"><h2 className="font-bold mb-6">Order Status</h2><div className="relative">{statusSteps.map((step, i) => { const isCompleted = i <= currentStepIndex; const isCurrent = i === currentStepIndex; const Icon = step.icon; return (<div key={step.key} className="flex gap-4 pb-8 last:pb-0 relative">{i < statusSteps.length - 1 && <div className={`absolute left-5 top-10 w-0.5 h-full ${i < currentStepIndex ? "bg-primary" : "bg-border"}`} />}<div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} ${isCurrent ? "ring-4 ring-primary/20" : ""}`}><Icon className="h-5 w-5" /></div><div className="pt-1.5"><p className={`font-medium text-sm ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p><p className="text-xs text-muted-foreground">{step.description}</p>{isCurrent && <p className="text-xs text-primary font-medium mt-1">Current status</p>}</div></div>); })}</div></div>
            {order.shipping_address && (<div className="bg-card rounded-xl p-6 shadow-card"><h2 className="font-bold mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Shipping Address</h2><p className="text-sm text-muted-foreground">{order.shipping_address}</p></div>)}
            <div className="bg-card rounded-xl p-6 shadow-card"><h2 className="font-bold mb-4">Items ({orderItems.length})</h2><div className="space-y-3">{orderItems.map((item) => (<div key={item.id} className="flex justify-between items-center text-sm py-2 border-b last:border-0"><div><p className="font-medium">{item.product_name}</p><p className="text-xs text-muted-foreground">Qty: {item.quantity}</p></div><span className="font-bold text-primary">¥{(item.price * item.quantity).toLocaleString()}</span></div>))}</div></div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TrackOrderPage;
