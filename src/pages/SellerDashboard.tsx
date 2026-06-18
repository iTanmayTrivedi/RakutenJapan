import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { mockStorage, CATEGORIES, type MockProduct } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Package, Plus, Trash2, Edit2, Save, X, BarChart3, TrendingUp, DollarSign, ShoppingBag, RefreshCw, Store } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIDescriptionGenerator } from "@/components/AIDescriptionGenerator";

const SellerDashboard = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const emptyForm = { name: "", slug: "", description: "", price: "", original_price: "", stock: "", category_id: "", image_url: "", seller_name: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { if (user) setProducts(mockStorage.getSellerProducts()); }, [user]);

  const handleAdd = () => {
    if (!user || !form.name || !form.price) return;
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const cat = CATEGORIES.find((c) => c.id === form.category_id);
    const newProduct: MockProduct = {
      id: `sp-${Date.now()}`, name: form.name, slug, description: form.description,
      price: parseFloat(form.price), original_price: form.original_price ? parseFloat(form.original_price) : null,
      stock: parseInt(form.stock) || 0, category_id: form.category_id || "", image_url: form.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      seller_name: form.seller_name || user.display_name, seller_user_id: user.id,
      rating: 0, review_count: 0, points_multiplier: 1, is_featured: false, created_at: new Date().toISOString(),
      categories: cat ? { name: cat.name, slug: cat.slug } : undefined,
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    mockStorage.setSellerProducts(updated);
    setForm(emptyForm);
    setShowAddDialog(false);
    toast({ title: "Product added!" });
  };

  const handleUpdate = (id: string) => {
    const updated = products.map((p) => p.id === id ? { ...p, name: editForm.name, price: parseFloat(editForm.price), original_price: editForm.original_price ? parseFloat(editForm.original_price) : null, stock: parseInt(editForm.stock) || 0, description: editForm.description } : p);
    setProducts(updated);
    mockStorage.setSellerProducts(updated);
    setEditingId(null);
    toast({ title: "Product updated" });
  };

  const handleDelete = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    mockStorage.setSellerProducts(updated);
    toast({ title: "Product deleted" });
  };

  const handleRestock = (id: string, currentStock: number) => {
    const updated = products.map((p) => p.id === id ? { ...p, stock: currentStock + 50 } : p);
    setProducts(updated);
    mockStorage.setSellerProducts(updated);
    toast({ title: "Restocked +50 units" });
  };

  if (!user) return (<div className="min-h-screen bg-background"><Header /><div className="container py-20 text-center"><Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><h1 className="text-2xl font-bold mb-2">Seller Dashboard</h1><p className="text-muted-foreground mb-4">Please sign in as a seller</p><Link to="/auth"><Button>Sign In</Button></Link></div><Footer /></div>);
  if (role !== "seller" && role !== "admin") return (<div className="min-h-screen bg-background"><Header /><div className="container py-20 text-center"><Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><h1 className="text-2xl font-bold mb-2">Access Denied</h1><p className="text-muted-foreground mb-4">You need a seller account</p><Link to="/"><Button>Go Home</Button></Link></div><Footer /></div>);

  const totalRevenue = products.reduce((s, p) => s + (p.price * (p.review_count || 0)), 0);
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold flex items-center gap-2"><Store className="h-6 w-6 text-primary" /> Seller Dashboard</h1><p className="text-sm text-muted-foreground">Manage your products and inventory</p></div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button></DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div><Label>Product Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" /></div>
                <div><Label>Seller/Shop Name</Label><Input value={form.seller_name} onChange={(e) => setForm({ ...form, seller_name: e.target.value })} placeholder="Your shop name" /></div>
                <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Price *</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" /></div>
                  <div><Label>Original Price</Label><Input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} placeholder="0" /></div>
                </div>
                <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" /></div>
                <div><Label>Category</Label><Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent></Select></div>
                <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." /></div>
                <AIDescriptionGenerator productName={form.name} category={CATEGORIES.find(c => c.id === form.category_id)?.name || ""} price={form.price} onUseDescription={(desc) => setForm({ ...form, description: desc })} />
                <Button onClick={handleAdd} className="w-full">Add Product</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[{ icon: Package, label: "Products", value: products.length, color: "text-primary" }, { icon: ShoppingBag, label: "Total Stock", value: totalStock, color: "text-blue-500" }, { icon: DollarSign, label: "Est. Revenue", value: `¥${totalRevenue.toLocaleString()}`, color: "text-green-500" }, { icon: TrendingUp, label: "Avg Rating", value: (products.reduce((s, p) => s + (p.rating || 0), 0) / (products.length || 1)).toFixed(1), color: "text-yellow-500" }].map((s) => (
            <div key={s.label} className="bg-card rounded-xl p-4 shadow-card"><s.icon className={`h-5 w-5 ${s.color} mb-2`} /><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl shadow-card"><Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" /><p className="text-lg font-medium">No products yet</p></div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="bg-card rounded-xl p-4 shadow-card animate-fade-in">
                {editingId === p.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3"><div><Label>Name</Label><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></div><div><Label>Price</Label><Input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} /></div></div>
                    <div className="grid grid-cols-2 gap-3"><div><Label>Original Price</Label><Input type="number" value={editForm.original_price || ""} onChange={(e) => setEditForm({ ...editForm, original_price: e.target.value })} /></div><div><Label>Stock</Label><Input type="number" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} /></div></div>
                    <div className="flex gap-2"><Button onClick={() => handleUpdate(p.id)} className="gap-1"><Save className="h-4 w-4" /> Save</Button><Button variant="outline" onClick={() => setEditingId(null)}><X className="h-4 w-4" /> Cancel</Button></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">{p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}</div>
                    <div className="flex-1 min-w-0"><h3 className="font-bold truncate">{p.name}</h3><div className="flex items-center gap-3 text-sm text-muted-foreground"><span className="font-bold text-foreground">¥{p.price?.toLocaleString()}</span><Badge variant={p.stock > 0 ? "default" : "destructive"} className="text-xs">Stock: {p.stock || 0}</Badge><span>{p.categories?.name || "No category"}</span></div></div>
                    <div className="flex items-center gap-1.5">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleRestock(p.id, p.stock || 0)} title="Restock +50"><RefreshCw className="h-3.5 w-3.5" /></Button>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { setEditingId(p.id); setEditForm({ name: p.name, price: p.price, original_price: p.original_price, stock: p.stock, description: p.description }); }}><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SellerDashboard;
