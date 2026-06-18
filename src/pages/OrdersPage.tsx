import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { mockStorage } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Eye, FileText } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-secondary text-secondary-foreground",
  processing: "bg-points text-foreground",
  shipped: "bg-primary text-primary-foreground",
  delivered: "bg-success text-success-foreground",
};

const OrdersPage = () => {
  const { user } = useAuth();
  const orders = user ? mockStorage.getOrders().filter((o) => o.user_id === user.id) : [];
  const allItems = mockStorage.getOrderItems();

  if (!user) return (<div className="min-h-screen bg-background"><Header /><div className="container py-20 text-center"><Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><h1 className="text-2xl font-bold mb-2">Order History</h1><p className="text-muted-foreground mb-4">Please login to view your orders</p><Link to="/auth"><Button>Sign In</Button></Link></div><Footer /></div>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        {orders.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground"><Package className="h-16 w-16 mx-auto mb-4" /><p className="text-lg">No orders yet</p><Link to="/"><Button className="mt-4">Start Shopping</Button></Link></div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = allItems.filter((i) => i.order_id === order.id);
              return (
                <div key={order.id} className="bg-card rounded-xl p-5 shadow-card animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <div><p className="font-bold text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p><p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p></div>
                    <div className="text-right flex items-center gap-3">
                      <div><p className="font-bold text-primary">¥{Number(order.total).toLocaleString()}</p><Badge className={statusColors[order.status] || ""}>{order.status}</Badge></div>
                      <Link to={`/track-order/${order.id}`}><Button variant="outline" size="icon" className="h-9 w-9" title="Track Order"><Eye className="h-4 w-4" /></Button></Link>
                      <Link to={`/receipt/${order.id}`}><Button variant="outline" size="icon" className="h-9 w-9" title="View Receipt"><FileText className="h-4 w-4" /></Button></Link>
                    </div>
                  </div>
                  {items.length > 0 && (<div className="border-t pt-3 space-y-1">{items.slice(0, 3).map((item) => (<p key={item.id} className="text-xs text-muted-foreground">{item.product_name} × {item.quantity}</p>))}{items.length > 3 && <p className="text-xs text-primary font-medium">+{items.length - 3} more items</p>}</div>)}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
