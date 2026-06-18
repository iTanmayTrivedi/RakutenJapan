import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-card border-t mt-12">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-sm mb-3">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/category/electronics" className="hover:text-primary">Electronics</Link></li>
              <li><Link to="/category/fashion" className="hover:text-primary">Fashion</Link></li>
              <li><Link to="/category/food" className="hover:text-primary">Food & Grocery</Link></li>
              <li><Link to="/category/home" className="hover:text-primary">Home & Living</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-3">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/category/beauty" className="hover:text-primary">Beauty</Link></li>
              <li><Link to="/category/sports" className="hover:text-primary">Sports</Link></li>
              <li><Link to="/category/books" className="hover:text-primary">Books</Link></li>
              <li><Link to="/category/toys" className="hover:text-primary">Toys & Kids</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/auth" className="hover:text-primary">Login / Register</Link></li>
              <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
              <li><Link to="/orders" className="hover:text-primary">Order History</Link></li>
              <li><Link to="/wishlist" className="hover:text-primary">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary">Returns</a></li>
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
          <p>© 2026 楽天市場 Clone — Portfolio Project. Not affiliated with Rakuten, Inc.</p>
        </div>
      </div>
    </footer>
  );
};
