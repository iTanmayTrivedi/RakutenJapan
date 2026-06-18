import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, FileText } from "lucide-react";

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-16 max-w-lg mx-auto text-center animate-fade-in">
        <div className="bg-card rounded-2xl p-8 shadow-card space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center animate-scale-in">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-foreground">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mt-2">Thank you for your purchase</p>
          </div>

          <div className="bg-muted rounded-lg p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono font-bold text-primary">#{orderId?.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-success">Processing</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span className="font-medium">3-5 business days</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your email address. You can track your order status at any time.
          </p>

          <div className="flex flex-col gap-3">
            <Link to={`/track-order/${orderId}`}>
              <Button className="w-full font-bold gap-2" size="lg">
                <Package className="h-5 w-5" /> Track Order
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="outline" className="w-full gap-2" size="lg">
                View All Orders <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to={`/receipt/${orderId}`}>
              <Button variant="outline" className="w-full gap-2" size="lg">
                <FileText className="h-4 w-4" /> View Receipt
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="w-full" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
