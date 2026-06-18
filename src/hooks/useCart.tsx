import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { mockStorage, PRODUCTS, type MockProduct } from "@/data/mockData";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  products: MockProduct | undefined;
}

interface CartContextType {
  cartCount: number;
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) { setCartItems([]); return; }
    const raw = mockStorage.getCart();
    const items: CartItem[] = raw.map((r, i) => ({
      id: `cart-${r.product_id}`,
      product_id: r.product_id,
      quantity: r.quantity,
      products: PRODUCTS.find((p) => p.id === r.product_id),
    }));
    setCartItems(items);
  }, [user]);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) return;
    const raw = mockStorage.getCart();
    const existing = raw.find((r) => r.product_id === productId);
    if (existing) existing.quantity += quantity;
    else raw.push({ product_id: productId, quantity });
    mockStorage.setCart(raw);
    await refreshCart();
  };

  const removeFromCart = async (itemId: string) => {
    const productId = itemId.replace("cart-", "");
    const raw = mockStorage.getCart().filter((r) => r.product_id !== productId);
    mockStorage.setCart(raw);
    await refreshCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) { await removeFromCart(itemId); return; }
    const productId = itemId.replace("cart-", "");
    const raw = mockStorage.getCart();
    const item = raw.find((r) => r.product_id === productId);
    if (item) item.quantity = quantity;
    mockStorage.setCart(raw);
    await refreshCart();
  };

  const clearCart = async () => {
    mockStorage.setCart([]);
    await refreshCart();
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartCount, cartItems, loading, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
