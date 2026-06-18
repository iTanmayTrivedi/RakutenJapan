import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Heart, Menu, X, Store, Shield, Globe, Package } from "lucide-react";
import { NotificationCenter } from "@/components/NotificationCenter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/hooks/useLanguage";

const categoryKeys = [
  { key: "cat.electronics", slug: "electronics" },
  { key: "cat.fashion", slug: "fashion" },
  { key: "cat.food", slug: "food" },
  { key: "cat.home", slug: "home" },
  { key: "cat.beauty", slug: "beauty" },
  { key: "cat.sports", slug: "sports" },
  { key: "cat.books", slug: "books" },
  { key: "cat.toys", slug: "toys" },
];

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { cartCount } = useCart();
  const { isSeller, isAdmin, loading: roleLoading } = useUserRole();
  const { language, setLanguage, t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ja" : "en");
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="rakuten-header-gradient">
        <div className="container flex items-center justify-between gap-2 py-2.5 sm:py-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-primary-foreground">楽天市場</span>
            <span className="hidden text-xs text-primary-foreground/80 sm:block">Rakuten Ichiba</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden flex-1 max-w-xl mx-6 md:flex">
            <div className="flex w-full">
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("search.placeholder")} className="rounded-r-none border-none bg-primary-foreground text-foreground h-10" />
              <Button type="submit" variant="secondary" className="rounded-l-none h-10 px-6"><Search className="h-4 w-4" /></Button>
            </div>
          </form>

          <div className="flex items-center gap-0.5 sm:gap-2">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 text-xs gap-1 font-bold px-2 sm:px-3" onClick={toggleLanguage}>
              <Globe className="h-4 w-4" />
              <span className="hidden xs:inline sm:inline">{language === "en" ? "日本語" : "EN"}</span>
            </Button>
            {authLoading ? (
              <Skeleton className="h-8 w-16 rounded-md bg-primary-foreground/20" />
            ) : user ? (
              <>
                {isSeller && (
                  <Link to="/seller"><Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 text-xs hidden sm:inline-flex gap-1"><Store className="h-4 w-4" /> {t("nav.seller")}</Button></Link>
                )}
                {isAdmin && (
                  <Link to="/admin"><Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 text-xs hidden sm:inline-flex gap-1 border border-primary-foreground/30"><Shield className="h-4 w-4" /> {t("nav.admin")}</Button></Link>
                )}
                <Link to="/profile"><Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9"><User className="h-5 w-5" /></Button></Link>
                <Link to="/orders"><Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 text-xs hidden sm:inline-flex">{t("nav.orders")}</Button></Link>
                <NotificationCenter />
                <Link to="/wishlist"><Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9 hidden xs:inline-flex sm:inline-flex"><Heart className="h-5 w-5" /></Button></Link>
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-0.5 -right-0.5 bg-secondary text-secondary-foreground h-4 min-w-4 px-1 flex items-center justify-center p-0 text-[10px] font-bold">{cartCount}</Badge>
                    )}
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/auth"><Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 gap-1 px-2 sm:px-3"><User className="h-4 w-4" /><span className="hidden sm:inline text-xs">{t("nav.login")}</span></Button></Link>
            )}
            <Button variant="ghost" size="icon" className="text-primary-foreground md:hidden hover:bg-primary-foreground/10 h-9 w-9" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="container pb-3 md:hidden">
          <div className="flex w-full">
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("search.placeholder")} className="rounded-r-none border-none bg-primary-foreground text-foreground h-9" />
            <Button type="submit" variant="secondary" className="rounded-l-none h-9 px-4"><Search className="h-4 w-4" /></Button>
          </div>
        </form>
      </div>

      <nav className="bg-card border-b shadow-sm">
        <div className="container">
          <ul className="hidden md:flex items-center gap-0 overflow-x-auto">
            {categoryKeys.map((cat) => (
              <li key={cat.slug}>
                <Link to={`/category/${cat.slug}`} className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent transition-colors whitespace-nowrap">{t(cat.key)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-b shadow-lg animate-fade-in">
          <div className="container py-3 space-y-3">
            {user && (
              <div className="grid grid-cols-2 gap-2 pb-3 border-b">
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
                  <Package className="h-4 w-4 text-primary" /> {t("nav.orders")}
                </Link>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
                  <Heart className="h-4 w-4 text-primary" /> Wishlist
                </Link>
                {isSeller && (
                  <Link to="/seller" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
                    <Store className="h-4 w-4 text-primary" /> {t("nav.seller")}
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
                    <Shield className="h-4 w-4 text-primary" /> {t("nav.admin")}
                  </Link>
                )}
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 px-1">Categories</p>
              <ul className="grid grid-cols-2 gap-0.5">
                {categoryKeys.map((cat) => (
                  <li key={cat.slug}>
                    <Link to={`/category/${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-md text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent transition-colors">
                      {t(cat.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
