import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { RedeemPointsModal } from "@/components/RedeemPointsModal";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Package, Heart, ShoppingCart,
  Edit2, Save, X, LogOut, Store, Shield, Camera, Bell,
  Globe, Moon, Lock, CreditCard, Award, ChevronRight, Check,
} from "lucide-react";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [points, setPoints] = useState(2840);
  const [pointsAnimating, setPointsAnimating] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url ?? null);
  const [form, setForm] = useState({
    display_name: user?.display_name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    smsNotifications: false,
    promoEmails: true,
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("points")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.points != null) setPoints(data.points);
      });
  }, [user]);

  const handlePointsRedeemed = (newBalance: number) => {
    setPointsAnimating(true);
    setPoints(newBalance);
    setTimeout(() => setPointsAnimating(false), 800);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
          <Link to="/auth"><Button>Sign In</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: form.display_name,
          phone: form.phone,
          address: form.address,
        })
        .eq("user_id", user.id);
      if (error) throw error;
      toast({ title: "Profile updated", description: "Your changes have been saved." });
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Save failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
    toast({ title: "Avatar updated", description: "Looking good!" });
  };

  const initial = user.display_name?.[0]?.toUpperCase() ?? "U";
  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      {/* Hero band */}
      <div className="rakuten-header-gradient">
        <div className="container py-6 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-card border-4 border-card shadow-xl flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl sm:text-4xl font-black text-primary">{initial}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-card border-2 border-card shadow-lg flex items-center justify-center text-primary hover:scale-110 transition-transform"
                aria-label="Change avatar"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
            </div>

            <div className="flex-1 text-primary-foreground min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight break-words">{user.display_name || "Welcome"}</h1>
                {role && (
                  <Badge variant="secondary" className="capitalize gap-1 text-xs font-semibold">
                    {role === "seller" && <Store className="h-3 w-3" />}
                    {role === "admin" && <Shield className="h-3 w-3" />}
                    {role === "customer" && <Award className="h-3 w-3" />}
                    {role}
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm opacity-90 mt-1 break-all">{user.email}</p>
              <p className="text-xs opacity-75 mt-1 sm:mt-2">Member since {memberSince}</p>
            </div>

            <Button
              variant={editing ? "secondary" : "default"}
              size="sm"
              className="gap-1.5 font-semibold w-full sm:w-auto"
              onClick={() => (editing ? setEditing(false) : setEditing(true))}
            >
              {editing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Left column: Quick stats + nav */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-2xl shadow-card p-5">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Quick Access</h3>
              <div className="space-y-1.5">
                {[
                  { to: "/orders", icon: Package, label: "My Orders", count: "View all" },
                  { to: "/wishlist", icon: Heart, label: "Wishlist", count: "Saved items" },
                  { to: "/cart", icon: ShoppingCart, label: "Shopping Cart", count: "Checkout" },
                ].map(({ to, icon: Icon, label, count }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent group transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground">{count}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Reward summary */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-primary-foreground shadow-card relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary-foreground/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5" />
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Rakuten Points</p>
                </div>
                <p
                  className={`text-3xl font-black tabular-nums transition-transform duration-500 ${
                    pointsAnimating ? "scale-125 text-yellow-200" : "scale-100"
                  }`}
                >
                  {points.toLocaleString()}
                </p>
                <p className="text-xs opacity-90 mt-1">≈ ¥{points.toLocaleString()} in rewards</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full mt-4 font-semibold gap-1.5"
                  onClick={() => setRedeemOpen(true)}
                >
                  <Award className="h-4 w-4" />
                  Redeem Points
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </aside>

          {/* Right column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal info */}
            <section className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-lg">Personal Information</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Update your contact and shipping details</p>
                </div>
                {editing && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Edit2 className="h-3 w-3" /> Editing
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> Email Address
                  </Label>
                  <Input value={user.email} disabled className="bg-muted/50 h-11 rounded-xl" />
                </div>

                <div className="space-y-1.5">
                  <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <User className="h-3.5 w-3.5" /> Display Name
                  </Label>
                  <Input
                    value={form.display_name}
                    onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
                    disabled={!editing}
                    className={`h-11 rounded-xl ${editing ? "" : "bg-muted/50"}`}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> Phone Number
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    disabled={!editing}
                    placeholder="+81 90 1234 5678"
                    className={`h-11 rounded-xl ${editing ? "" : "bg-muted/50"}`}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> Shipping Address
                  </Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    disabled={!editing}
                    placeholder="Street, city, postal code, country"
                    rows={3}
                    className={`rounded-xl resize-none ${editing ? "" : "bg-muted/50"}`}
                  />
                </div>
              </div>

              {editing && (
                <div className="flex gap-3 mt-5 pt-5 border-t">
                  <Button variant="outline" onClick={() => setEditing(false)} className="flex-1 sm:flex-none">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none gap-2 font-bold">
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </section>

            {/* Preferences */}
            <section className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-lg mb-1">Preferences</h2>
              <p className="text-xs text-muted-foreground mb-5">Customize your shopping experience</p>

              <div className="space-y-1">
                {[
                  { key: "emailNotifications", icon: Bell, title: "Email notifications", desc: "Order updates and shipping alerts" },
                  { key: "smsNotifications", icon: Phone, title: "SMS notifications", desc: "Critical delivery updates via SMS" },
                  { key: "promoEmails", icon: Mail, title: "Promotional emails", desc: "Deals, sales and recommendations" },
                ].map(({ key, icon: Icon, title, desc }) => (
                  <div key={key} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{title}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <Switch
                      checked={prefs[key as keyof typeof prefs]}
                      onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
                    />
                  </div>
                ))}

                {/* Dark mode (wired to next-themes) */}
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <Moon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Dark mode</p>
                    <p className="text-xs text-muted-foreground">Easier on the eyes at night</p>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
                  />
                </div>

                <Separator className="my-2" />

                <div className="flex items-center gap-4 p-3 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Language</p>
                    <p className="text-xs text-muted-foreground">Choose your preferred language</p>
                  </div>
                  <div className="flex gap-1.5 rounded-lg bg-muted p-1">
                    {(["en", "ja"] as const).map((lng) => (
                      <button
                        key={lng}
                        onClick={() => setLanguage(lng)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                          language === lng ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {lng === "en" ? "EN" : "日本語"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Security & Account */}
            <section className="bg-card rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-lg mb-1">Security & Account</h2>
              <p className="text-xs text-muted-foreground mb-5">Manage account access and payment</p>

              <div className="space-y-2">
                {[
                  { icon: Lock, title: "Change password", desc: "Last updated 3 months ago" },
                  { icon: Shield, title: "Two-factor authentication", desc: "Add an extra layer of security", badge: "Recommended" },
                  { icon: CreditCard, title: "Payment methods", desc: "Manage cards and billing" },
                ].map(({ icon: Icon, title, desc, badge }) => (
                  <button
                    key={title}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors text-left"
                    onClick={() => toast({ title: "Coming soon", description: `${title} will be available shortly.` })}
                  >
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{title}</p>
                        {badge && <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">{badge}</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}

                <Separator className="my-3" />

                <div className="grid grid-cols-2 gap-3 px-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Account ID</p>
                    <p className="font-mono text-xs text-muted-foreground truncate mt-1">{user.id.slice(0, 13)}…</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</p>
                    <p className="text-xs font-semibold text-primary mt-1 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Verified
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />

      <RedeemPointsModal
        open={redeemOpen}
        onOpenChange={setRedeemOpen}
        userId={user.id}
        currentPoints={points}
        onRedeemed={handlePointsRedeemed}
      />
    </div>
  );
};

export default ProfilePage;
