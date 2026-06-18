import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { DEMO_USERS, mockStorage, type AppRole } from "@/data/mockData";

export interface AppUser {
  id: string;
  email: string;
  display_name: string;
  role: AppRole;
  phone: string;
  address: string;
  avatar_url: string | null;
  created_at: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName: string, role: AppRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  demoSignIn: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchAppUser(supaUser: User): Promise<AppUser | null> {
  const [{ data: roleData, error: roleError }, { data: profile, error: profileError }] = await Promise.all([
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", supaUser.id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", supaUser.id)
      .maybeSingle(),
  ]);

  if (roleError) {
    console.error("Failed to load user role:", roleError);
  }

  if (profileError) {
    console.error("Failed to load profile:", profileError);
  }

  const fallbackDisplayName =
    (supaUser.user_metadata?.display_name as string | undefined) ??
    supaUser.email ??
    "";

  const role = (roleData?.role as AppRole) ?? "customer";

  return {
    id: supaUser.id,
    email: supaUser.email ?? "",
    display_name: profile?.display_name ?? fallbackDisplayName,
    role,
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
    avatar_url: profile?.avatar_url ?? null,
    created_at: supaUser.created_at,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const setSafeUser = (nextUser: AppUser | null) => {
      if (isMounted) {
        setUser(nextUser);
      }
    };

    const setSafeLoading = (nextLoading: boolean) => {
      if (isMounted) {
        setLoading(nextLoading);
      }
    };

    const demoUser = mockStorage.getCurrentUser();
    if (demoUser) {
      setSafeUser({
        id: demoUser.id,
        email: demoUser.email,
        display_name: demoUser.display_name,
        role: demoUser.role,
        phone: demoUser.phone,
        address: demoUser.address,
        avatar_url: demoUser.avatar_url,
        created_at: demoUser.created_at,
      });
      setSafeLoading(false);
    }

    const syncSessionUser = async (session: Session | null, event?: string) => {
      try {
        if (!session?.user) {
          if (!mockStorage.getCurrentUser()) {
            setSafeUser(null);
          }
          return;
        }

        if (event === "SIGNED_IN") {
          const pendingRole = localStorage.getItem("pending_role");
          if (pendingRole) {
            const { error } = await supabase.from("user_roles").upsert(
              { user_id: session.user.id, role: pendingRole as AppRole },
              { onConflict: "user_id,role" }
            );

            if (error) {
              console.error("Failed to save pending role:", error);
            } else {
              localStorage.removeItem("pending_role");
            }
          }
        }

        const appUser = await fetchAppUser(session.user);
        setSafeUser(appUser);
      } catch (error) {
        console.error("Failed to sync authenticated user:", error);
      } finally {
        setSafeLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      void syncSessionUser(session, event);
    });

    void supabase.auth.getSession().then(({ data: { session } }) => {
      void syncSessionUser(session, "INITIAL_SESSION");
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    mockStorage.setCurrentUser(null); // clear any demo session
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signUp = async (email: string, password: string, displayName: string, role: AppRole) => {
    mockStorage.setCurrentUser(null);
    localStorage.setItem("pending_role", role);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      localStorage.removeItem("pending_role");
      return { error: error.message };
    }
    return { error: null };
  };

  const signOutFn = async () => {
    mockStorage.setCurrentUser(null);
    await supabase.auth.signOut();
    setUser(null);
  };

  const demoSignIn = (userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (found) {
      mockStorage.setCurrentUser(found);
      setUser({
        id: found.id,
        email: found.email,
        display_name: found.display_name,
        role: found.role,
        phone: found.phone,
        address: found.address,
        avatar_url: found.avatar_url,
        created_at: found.created_at,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut: signOutFn, demoSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
