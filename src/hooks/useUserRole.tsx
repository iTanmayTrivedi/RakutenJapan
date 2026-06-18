import { useAuth } from "@/hooks/useAuth";
import type { AppRole } from "@/data/mockData";

export type { AppRole } from "@/data/mockData";

export const useUserRole = () => {
  const { user, loading } = useAuth();
  const role: AppRole | null = user?.role ?? null;

  return {
    role,
    loading,
    isSeller: role === "seller",
    isAdmin: role === "admin",
    isCustomer: role === "customer",
  };
};
