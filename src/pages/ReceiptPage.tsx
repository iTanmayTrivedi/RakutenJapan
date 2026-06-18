import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { mockStorage } from "@/data/mockData";
import { Printer, ArrowLeft, FileText } from "lucide-react";

const ReceiptPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const receiptRef = useRef<HTMLDivElement>(null);
  const order = user ? mockStorage.getOrders().find((o) => o.id === orderId && o.user_id === user.id) : null;
  const items = mockStorage.getOrderItems().filter((i) => i.order_id === orderId);

  if (!user) return (<div className="min-h-screen bg-background"><Header /><div className="container py-20 text-center"><p>Please sign in to view receipts.</p><Link to="/auth"><Button className="mt-4">Sign In</Button></Link></div><Footer /></div>);
  if (!order) return (<div className="min-h-screen bg-background"><Header /><div className="container py-20 text-center"><h1 className="text-2xl font-bold">Order not found</h1><Link to="/orders"><Button className="mt-4">View Orders</Button></Link></div><Footer /></div>);

  const subtotal = items.reduce((s, i) => s + Number(i.price) * (i.quantity || 1), 0);
  const shipping = subtotal >= 3980 ? 0 : 500;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link to="/orders"><Button variant="ghost" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Orders</Button></Link>
          <Button onClick={() => window.print()} className="gap-2 font-bold"><Printer className="h-4 w-4" /> Print Receipt</Button>
        </div>
        <div ref={receiptRef} className="bg-card rounded-xl p-8 shadow-card animate-fade-in print:shadow-none print:rounded-none">
          <div className="text-center border-b border-border pb-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2"><FileText className="h-6 w-6 text-primary" /><h1 className="text-2xl font-black text-primary">Receipt</h1></div>
            <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-xs text-muted-foreground mt-1">{new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
          {order.shipping_address && (<div className="mb-6"><h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Ship To</h3><p className="text-sm">{order.shipping_address}</p></div>)}
          <table className="w-full text-sm mb-6"><thead><tr className="border-b border-border"><th className="text-left py-2 font-semibold">Item</th><th className="text-center py-2 font-semibold">Qty</th><th className="text-right py-2 font-semibold">Price</th><th className="text-right py-2 font-semibold">Total</th></tr></thead><tbody>{items.map((item) => (<tr key={item.id} className="border-b border-border/50"><td className="py-3">{item.product_name}</td><td className="py-3 text-center">{item.quantity || 1}</td><td className="py-3 text-right">¥{Number(item.price).toLocaleString()}</td><td className="py-3 text-right font-medium">¥{(Number(item.price) * (item.quantity || 1)).toLocaleString()}</td></tr>))}</tbody></table>
          <div className="space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>¥{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-success">{shipping === 0 ? "Free" : `¥${shipping}`}</span></div>
            <div className="flex justify-between border-t border-border pt-2 text-base"><span className="font-bold">Total</span><span className="font-black text-primary">¥{Number(order.total).toLocaleString()}</span></div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center"><p className="text-xs text-muted-foreground">Thank you for your purchase!</p></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReceiptPage;
