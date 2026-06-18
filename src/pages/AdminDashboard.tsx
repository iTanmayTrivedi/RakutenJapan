import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { mockStorage, PRODUCTS, DEMO_USERS } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Shield, Users, Package, ShoppingCart, BarChart3, TrendingUp, DollarSign, Eye, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesForecasting } from "@/components/admin/SalesForecasting";
import { ProductRecommendations } from "@/components/admin/ProductRecommendations";
import { CustomerSegmentation } from "@/components/admin/CustomerSegmentation";
import { FraudDetection } from "@/components/admin/FraudDetection";
import { AIInsights } from "@/components/admin/AIInsights";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const [orders, setOrders] = useState(() => mockStorage.getOrders());
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const products = PRODUCTS;
  const profiles = DEMO_USERS.map((u) => ({ id: u.id, user_id: u.id, display_name: u.display_name, phone: u.phone, address: u.address, created_at: u.created_at }));
  const allOrderItems = mockStorage.getOrderItems();

  const updateOrderStatus = (orderId: string, status: string) => {
    const updated = orders.map((o) => o.id === orderId ? { ...o, status } : o);
    setOrders(updated);
    mockStorage.setOrders(updated);
    toast({ title: `Order status updated to ${status}` });
  };

  if (!user) return (<div className="min-h-screen bg-background"><Header /><div className="container py-20 text-center"><Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1><p className="text-muted-foreground mb-4">Please sign in as an admin</p><Link to="/auth"><Button>Sign In</Button></Link></div><Footer /></div>);
  if (role !== "admin") return (<div className="min-h-screen bg-background"><Header /><div className="container py-20 text-center"><Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><h1 className="text-2xl font-bold mb-2">Access Denied</h1><p className="text-muted-foreground mb-4">Admin privileges required</p><Link to="/"><Button>Go Home</Button></Link></div><Footer /></div>);

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-6"><h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="h-6 w-6 text-primary" /> Admin Dashboard</h1><p className="text-sm text-muted-foreground">Platform management and analytics</p></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[{ icon: Users, label: "Users", value: profiles.length, color: "text-primary" }, { icon: Package, label: "Products", value: products.length, color: "text-blue-500" }, { icon: ShoppingCart, label: "Orders", value: orders.length, color: "text-green-500" }, { icon: DollarSign, label: "Revenue", value: `¥${totalRevenue.toLocaleString()}`, color: "text-yellow-500" }].map((s) => (
            <div key={s.label} className="bg-card rounded-xl p-4 shadow-card"><s.icon className={`h-5 w-5 ${s.color} mb-2`} /><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          ))}
        </div>

        <Tabs defaultValue="analytics">
          <TabsList className="mb-4 flex-wrap h-auto gap-1">
            <TabsTrigger value="analytics"><BarChart3 className="h-3.5 w-3.5 mr-1" /> Analytics</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
            <TabsTrigger value="users">Users ({profiles.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-8">
            <AIInsights orders={orders} products={products} profiles={profiles} />
            <SalesForecasting orders={orders} />
            <ProductRecommendations products={products} orders={orders} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomerSegmentation profiles={profiles} orders={orders} />
              <FraudDetection orders={orders} profiles={profiles} />
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-3">
            {orders.length === 0 ? (<div className="text-center py-12 bg-card rounded-xl shadow-card"><ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" /><p className="text-lg font-medium">No orders yet</p></div>
            ) : orders.map((o) => (
              <div key={o.id} className="bg-card rounded-xl p-4 shadow-card animate-fade-in">
                <div className="flex items-center justify-between">
                  <div><p className="font-bold text-sm">#{o.id.slice(0, 8)}</p><p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p><p className="text-sm font-bold mt-1">¥{o.total?.toLocaleString()}</p></div>
                  <div className="flex items-center gap-2">
                    <Select value={o.status || "pending"} onValueChange={(v) => updateOrderStatus(o.id, v)}>
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                      {expandedOrder === o.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                {expandedOrder === o.id && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    {allOrderItems.filter((i) => i.order_id === o.id).map((item) => (
                      <div key={item.id} className="flex justify-between text-sm"><span>{item.product_name} × {item.quantity}</span><span className="font-medium">¥{(item.price * item.quantity).toLocaleString()}</span></div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="products" className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4 animate-fade-in">
                <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden">{p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}</div>
                <div className="flex-1 min-w-0"><p className="font-bold truncate">{p.name}</p><div className="flex gap-2 text-xs text-muted-foreground"><span>¥{p.price?.toLocaleString()}</span><Badge variant={p.stock > 0 ? "default" : "destructive"} className="text-xs">Stock: {p.stock || 0}</Badge><span>{p.seller_name || "—"}</span></div></div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="users" className="space-y-3">
            {profiles.map((p) => (
              <div key={p.id} className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{(p.display_name || "U")[0]?.toUpperCase()}</div>
                <div className="flex-1"><p className="font-bold">{p.display_name || "User"}</p><p className="text-xs text-muted-foreground">{p.phone || "No phone"} · {p.address || "No address"}</p></div>
                <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
