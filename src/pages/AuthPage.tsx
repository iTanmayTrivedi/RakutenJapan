import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Store, Shield, LogIn, Mail, Lock, UserPlus, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DEMO_USERS, type AppRole } from "@/data/mockData";
import { Separator } from "@/components/ui/separator";
import { AuthAnimatedPanel } from "@/components/AuthAnimatedPanel";
import { lovable } from "@/integrations/lovable";

const roles: { value: AppRole; label: string; icon: typeof User; color: string }[] = [
  { value: "customer", label: "Customer", icon: User, color: "text-blue-500" },
  { value: "seller", label: "Seller", icon: Store, color: "text-green-500" },
  { value: "admin", label: "Admin", icon: Shield, color: "text-primary" },
];

const roleIcons: Record<AppRole, typeof User> = { customer: User, seller: Store, admin: Shield };
const roleColors: Record<AppRole, string> = { customer: "text-blue-500", seller: "text-green-500", admin: "text-primary" };

const AuthPage = () => {
  const { signIn, signUp, demoSignIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("customer");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: "Login failed", description: error, variant: "destructive" });
        } else {
          toast({ title: "Welcome back!" });
          navigate("/");
        }
      } else {
        if (!displayName.trim()) {
          toast({ title: "Please enter your name", variant: "destructive" });
          setSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, displayName.trim(), selectedRole);
        if (error) {
          toast({ title: "Signup failed", description: error, variant: "destructive" });
        } else {
          toast({ title: "Account created!", description: "You are now signed in." });
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({ title: "Google sign-in failed", description: String((result.error as Error).message ?? result.error), variant: "destructive" });
        return;
      }
      if (result.redirected) return;
      toast({ title: "Welcome!" });
      navigate("/");
    } catch (err) {
      console.error("Google sign-in error:", err);
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    }
  };

  const handleDemoLogin = (userId: string) => {
    demoSignIn(userId);
    const user = DEMO_USERS.find((u) => u.id === userId);
    if (user?.role === "seller") navigate("/seller");
    else if (user?.role === "admin") navigate("/admin");
    else navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left side — Auth form */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex-shrink-0 flex flex-col min-h-screen overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
          <Link to="/" className="text-2xl font-black text-primary tracking-tight">
            楽天市場
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-[380px] space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {isLogin ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? "Sign in to access your account, track orders, and earn rewards."
                  : "Join millions of shoppers and start earning points today."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Display Name
                  </Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      className="pl-10 h-11 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 h-11 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 h-11 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Account Type
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      const selected = selectedRole === r.value;
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setSelectedRole(r.value)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                            selected
                              ? "border-primary bg-accent shadow-sm"
                              : "border-border/40 hover:border-muted-foreground/30 bg-muted/20"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${r.color}`} />
                          <span className="text-[11px] font-semibold">{r.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-sm font-bold tracking-wide"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Please wait...
                  </div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    {isLogin ? "Sign In" : "Create Account"}
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative py-1">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-[11px] text-muted-foreground font-medium">
                or continue with
              </span>
            </div>

            {/* Google sign-in */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full h-11 rounded-xl text-sm font-semibold border-border/60 bg-muted/20 hover:bg-accent/50 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.92h5.46c-.24 1.42-1.7 4.16-5.46 4.16-3.28 0-5.96-2.72-5.96-6.08S8.72 6.12 12 6.12c1.86 0 3.12.8 3.84 1.48l2.62-2.52C16.84 3.56 14.64 2.6 12 2.6 6.84 2.6 2.68 6.76 2.68 12s4.16 9.4 9.32 9.4c5.38 0 8.94-3.78 8.94-9.1 0-.62-.06-1.08-.16-1.54H12z" />
              </svg>
              Continue with Google
            </Button>

            {/* Toggle */}
            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline underline-offset-4 transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>

            {/* Demo logins */}
            <div className="relative py-1">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-[11px] text-muted-foreground font-medium">
                Quick demo access
              </span>
            </div>

            <div className="space-y-2">
              {DEMO_USERS.map((user) => {
                const Icon = roleIcons[user.role];
                return (
                  <button
                    key={user.id}
                    onClick={() => handleDemoLogin(user.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-muted/20 hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 text-left group"
                  >
                    <div className={`w-9 h-9 rounded-lg bg-accent flex items-center justify-center ${roleColors[user.role]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{user.display_name}</span>
                        <Badge variant="outline" className="text-[10px] capitalize px-1.5 py-0">{user.role}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <LogIn className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Footer note */}
            <p className="text-[11px] text-muted-foreground/60 text-center leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      {/* Right side — Animated panel (hidden on mobile) */}
      <div className="hidden lg:block flex-1 relative">
        <AuthAnimatedPanel />
      </div>
    </div>
  );
};

export default AuthPage;
