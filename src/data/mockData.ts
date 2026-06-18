// Mock data layer for offline/demo mode — no network calls

export type AppRole = "customer" | "seller" | "admin";

export interface MockUser {
  id: string;
  email: string;
  display_name: string;
  role: AppRole;
  created_at: string;
  phone: string;
  address: string;
  avatar_url: string | null;
}

export const DEMO_USERS: MockUser[] = [
  {
    id: "usr-admin-001",
    email: "admin@rakuten-demo.jp",
    display_name: "Admin Tanaka",
    role: "admin",
    created_at: "2025-06-15T09:00:00Z",
    phone: "090-1111-0001",
    address: "1-1-1 Chiyoda, Chiyoda-ku, Tokyo",
    avatar_url: null,
  },
  {
    id: "usr-seller-001",
    email: "seller@rakuten-demo.jp",
    display_name: "Seller Yamada",
    role: "seller",
    created_at: "2025-07-01T10:00:00Z",
    phone: "090-2222-0002",
    address: "2-3-4 Shibuya, Shibuya-ku, Tokyo",
    avatar_url: null,
  },
  {
    id: "usr-customer-001",
    email: "customer@rakuten-demo.jp",
    display_name: "Customer Suzuki",
    role: "customer",
    created_at: "2025-08-10T12:00:00Z",
    phone: "090-3333-0003",
    address: "5-6-7 Minato, Minato-ku, Tokyo",
    avatar_url: null,
  },
];

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
}

export const CATEGORIES: MockCategory[] = [
  { id: "cat-electronics", name: "Electronics", slug: "electronics", image_url: null, sort_order: 1 },
  { id: "cat-fashion", name: "Fashion", slug: "fashion", image_url: null, sort_order: 2 },
  { id: "cat-food", name: "Food & Grocery", slug: "food", image_url: null, sort_order: 3 },
  { id: "cat-home", name: "Home & Living", slug: "home", image_url: null, sort_order: 4 },
  { id: "cat-beauty", name: "Beauty", slug: "beauty", image_url: null, sort_order: 5 },
  { id: "cat-sports", name: "Sports", slug: "sports", image_url: null, sort_order: 6 },
  { id: "cat-books", name: "Books", slug: "books", image_url: null, sort_order: 7 },
  { id: "cat-toys", name: "Toys & Kids", slug: "toys", image_url: null, sort_order: 8 },
];

export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  price: number;
  original_price: number | null;
  rating: number;
  review_count: number;
  stock: number;
  points_multiplier: number;
  is_featured: boolean;
  seller_name: string;
  seller_user_id: string | null;
  category_id: string;
  created_at: string;
  categories?: { name: string; slug: string };
}

const p = (
  id: string, name: string, slug: string, desc: string, img: string,
  price: number, orig: number | null, rating: number, reviews: number,
  stock: number, pts: number, featured: boolean, seller: string, catId: string, sellerUserId: string | null = null
): MockProduct => ({
  id, name, slug, description: desc, image_url: img,
  price, original_price: orig, rating, review_count: reviews,
  stock, points_multiplier: pts, is_featured: featured,
  seller_name: seller, seller_user_id: sellerUserId, category_id: catId,
  created_at: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString(),
  categories: CATEGORIES.find(c => c.id === catId) ? { name: CATEGORIES.find(c => c.id === catId)!.name, slug: CATEGORIES.find(c => c.id === catId)!.slug } : undefined,
});

export const PRODUCTS: MockProduct[] = [
  // Electronics
  p("p01","Sony WH-1000XM6 Headphones","sony-wh1000xm6","Flagship wireless noise-canceling headphones.","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",59800,69800,4.8,1240,45,3,true,"Sony Official","cat-electronics"),
  p("p02","Nintendo Switch 2 Console","nintendo-switch-2","Next-gen hybrid console for gaming.","https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800",54980,59980,4.9,980,25,2,true,"Nintendo Store","cat-electronics"),
  p("p03","Canon EOS R8 Camera Kit","canon-eos-r8-kit","Full-frame mirrorless camera for creators.","https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",199800,219800,4.7,430,14,2,false,"Canon Japan","cat-electronics"),
  // Fashion
  p("p04","Comme des Garcons Logo Tee","cdg-logo-tee","Iconic minimalist tee with premium cotton.","https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",12800,14800,4.7,312,60,2,true,"CDG Official","cat-fashion"),
  p("p05","Uniqlo Utility Blazer","uniqlo-utility-blazer","Smart casual blazer for office style.","https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",9900,11900,4.5,520,80,2,false,"Uniqlo Official","cat-fashion"),
  p("p06","Onitsuka Tiger Mexico 66","onitsuka-mexico-66","Classic Japanese sneaker silhouette.","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",13200,15200,4.8,777,36,3,true,"Onitsuka Tiger","cat-fashion"),
  // Food
  p("p07","Ichiran Ramen Home Set","ichiran-ramen-6pack","Authentic tonkotsu ramen meal kit.","https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800",2980,3480,4.7,615,100,2,true,"Ichiran Foods","cat-food"),
  p("p08","Royce Nama Chocolate Box","royce-nama-choco-box","Premium melt-in-mouth Hokkaido chocolate.","https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800",2480,2980,4.8,488,95,2,false,"Royce Official","cat-food"),
  p("p09","A5 Wagyu Steak Selection","a5-wagyu-steak-selection","Luxury marbled Japanese beef set.","https://images.unsplash.com/photo-1558030006-450675393462?w=800",11800,13800,4.9,210,22,5,true,"Kobe Direct","cat-food"),
  // Home
  p("p10","Muji Aroma Diffuser Pro","muji-aroma-diffuser-pro","Quiet ultrasonic diffuser for wellness.","https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800",7900,9900,4.6,298,50,2,false,"MUJI Home","cat-home"),
  p("p11","Nitori Premium Sofa Set","nitori-premium-sofa-set","Comfortable 3-seat sofa.","https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800",69800,79800,4.5,190,12,2,true,"Nitori Living","cat-home"),
  p("p12","Japanese Futon Mattress","japanese-futon-mattress","Traditional foldable mattress.","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",15800,19800,4.4,145,28,2,false,"Nishikawa","cat-home"),
  // Beauty
  p("p13","SK-II Facial Essence 230ml","skii-facial-essence-230","Iconic essence for hydration.","https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800",22900,25900,4.8,664,34,3,true,"SK-II Official","cat-beauty"),
  p("p14","Shiseido Ultimune Serum","shiseido-ultimune-serum","Daily defense serum.","https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",14900,16900,4.6,401,42,2,false,"Shiseido Japan","cat-beauty"),
  p("p15","Canmake Tokyo Lip Tint","canmake-tokyo-lip-tint","Long-lasting lip tint.","https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",880,980,4.5,567,150,2,false,"Canmake Tokyo","cat-beauty"),
  // Sports
  p("p16","Asics Gel-Kayano 31","asics-gel-kayano-31","Stability running shoes.","https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800",18300,20500,4.7,355,46,3,true,"Asics Official","cat-sports"),
  p("p17","Mizuno Wave Rider 27","mizuno-wave-rider-27","Responsive cushioned trainer.","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",14300,16500,4.6,178,53,3,false,"Mizuno Official","cat-sports"),
  p("p18","Yonex Badminton Pro Racket","yonex-pro-racket","Lightweight racket.","https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",11200,13400,4.7,122,39,2,false,"Yonex Sports","cat-sports"),
  // Books
  p("p19","Haruki Murakami Collection","murakami-collection","Bestselling fiction set.","https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",4980,5980,4.9,820,67,2,true,"Tokyo Books","cat-books"),
  p("p20","Ghibli Artbook Deluxe","ghibli-artbook-deluxe","Official artwork compilation.","https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",4200,4900,4.8,430,55,2,false,"Ghibli Store","cat-books"),
  p("p21","Manga Starter Box Set","manga-starter-box-set","Curated starter collection.","https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800",8900,10900,4.7,376,58,3,true,"Manga Hub","cat-books"),
  // Toys
  p("p22","Bandai Gundam Model Kit","bandai-gundam-rx78-kit","Classic plastic model kit.","https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800",3200,3900,4.8,510,90,2,true,"Bandai Hobby","cat-toys"),
  p("p23","Pokemon Pikachu Plush XL","pokemon-pikachu-plush-xl","Extra soft jumbo plush.","https://images.unsplash.com/photo-1615486363972-f79e2a6d6f86?w=800",2600,3200,4.7,690,120,2,false,"Pokemon Center","cat-toys"),
  p("p24","Nintendo Mario Kart RC Car","mario-kart-rc-car","Remote control kart racer.","https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800",4800,5600,4.6,205,70,2,false,"Nintendo Kids","cat-toys"),
];

// --- Mock orders for admin analytics ---
export interface MockOrder {
  id: string;
  user_id: string;
  total: number;
  status: string;
  shipping_address: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface MockOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

export const MOCK_ORDERS: MockOrder[] = [
  { id: "ord-001", user_id: "usr-customer-001", total: 72780, status: "delivered", shipping_address: "Suzuki, 5-6-7 Minato, Tokyo", payment_method: "credit-card", created_at: "2025-12-10T14:30:00Z", updated_at: "2025-12-15T10:00:00Z" },
  { id: "ord-002", user_id: "usr-customer-001", total: 22900, status: "shipped", shipping_address: "Suzuki, 5-6-7 Minato, Tokyo", payment_method: "paypal", created_at: "2026-01-05T09:00:00Z", updated_at: "2026-01-07T11:00:00Z" },
  { id: "ord-003", user_id: "usr-customer-001", total: 15780, status: "processing", shipping_address: "Suzuki, 5-6-7 Minato, Tokyo", payment_method: "credit-card", created_at: "2026-02-20T16:00:00Z", updated_at: "2026-02-20T16:00:00Z" },
  { id: "ord-004", user_id: "usr-admin-001", total: 59800, status: "delivered", shipping_address: "Tanaka, 1-1-1 Chiyoda, Tokyo", payment_method: "credit-card", created_at: "2025-11-20T10:00:00Z", updated_at: "2025-11-25T14:00:00Z" },
  { id: "ord-005", user_id: "usr-admin-001", total: 13200, status: "pending", shipping_address: "Tanaka, 1-1-1 Chiyoda, Tokyo", payment_method: "netbanking", created_at: "2026-03-01T08:00:00Z", updated_at: "2026-03-01T08:00:00Z" },
];

export const MOCK_ORDER_ITEMS: MockOrderItem[] = [
  { id: "oi-001", order_id: "ord-001", product_id: "p01", product_name: "Sony WH-1000XM6 Headphones", price: 59800, quantity: 1 },
  { id: "oi-002", order_id: "ord-001", product_id: "p06", product_name: "Onitsuka Tiger Mexico 66", price: 13200, quantity: 1 },
  { id: "oi-003", order_id: "ord-002", product_id: "p13", product_name: "SK-II Facial Essence 230ml", price: 22900, quantity: 1 },
  { id: "oi-004", order_id: "ord-003", product_id: "p07", product_name: "Ichiran Ramen Home Set", price: 2980, quantity: 2 },
  { id: "oi-005", order_id: "ord-003", product_id: "p12", product_name: "Japanese Futon Mattress", price: 15800, quantity: 1 },
  { id: "oi-006", order_id: "ord-004", product_id: "p01", product_name: "Sony WH-1000XM6 Headphones", price: 59800, quantity: 1 },
  { id: "oi-007", order_id: "ord-005", product_id: "p06", product_name: "Onitsuka Tiger Mexico 66", price: 13200, quantity: 1 },
];

// Mock reviews
export interface MockReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profile_name: string;
}

export const MOCK_REVIEWS: MockReview[] = [
  // p01 - Sony Headphones
  { id: "rev-001", product_id: "p01", user_id: "usr-customer-001", rating: 5, comment: "Best headphones I've ever owned. Amazing noise cancellation!", created_at: "2026-01-15T10:00:00Z", profile_name: "Customer Suzuki" },
  { id: "rev-002", product_id: "p01", user_id: "usr-admin-001", rating: 4, comment: "Great sound quality but a bit pricey.", created_at: "2026-02-01T14:00:00Z", profile_name: "Admin Tanaka" },
  { id: "rev-010", product_id: "p01", user_id: "u-ryu", rating: 5, comment: "ノイズキャンセリングが素晴らしい。飛行機の中でも快適です。", created_at: "2026-01-20T08:00:00Z", profile_name: "Ryu Nakamura" },
  { id: "rev-011", product_id: "p01", user_id: "u-emily", rating: 4, comment: "Comfortable for long sessions, sound is clear and balanced.", created_at: "2026-02-12T17:30:00Z", profile_name: "Emily Chen" },
  // p02 - Nintendo Switch
  { id: "rev-020", product_id: "p02", user_id: "u-takeshi", rating: 5, comment: "最高のゲーム機！家族みんなで楽しんでいます。", created_at: "2026-01-10T12:00:00Z", profile_name: "Takeshi Ito" },
  { id: "rev-021", product_id: "p02", user_id: "u-sarah", rating: 5, comment: "The new screen is gorgeous and the game library is amazing!", created_at: "2026-01-22T09:15:00Z", profile_name: "Sarah Johnson" },
  { id: "rev-022", product_id: "p02", user_id: "u-kenji", rating: 4, comment: "バッテリー持ちが良くなった。おすすめです。", created_at: "2026-02-05T14:00:00Z", profile_name: "Kenji Watanabe" },
  // p04 - CDG Tee
  { id: "rev-040", product_id: "p04", user_id: "u-mika", rating: 5, comment: "素材がとても良い。シンプルで合わせやすい。", created_at: "2026-01-18T10:30:00Z", profile_name: "Mika Yamamoto" },
  { id: "rev-041", product_id: "p04", user_id: "u-alex", rating: 4, comment: "Quality fabric and fits true to size. Love the minimalist design.", created_at: "2026-02-08T16:00:00Z", profile_name: "Alex Kim" },
  // p06 - Onitsuka Tiger
  { id: "rev-003", product_id: "p06", user_id: "usr-customer-001", rating: 5, comment: "Classic design, super comfortable for walking.", created_at: "2026-01-20T09:00:00Z", profile_name: "Customer Suzuki" },
  { id: "rev-060", product_id: "p06", user_id: "u-yuki", rating: 5, comment: "歩きやすくてデザインも最高。毎日履いています。", created_at: "2026-01-25T11:00:00Z", profile_name: "Yuki Tanaka" },
  { id: "rev-061", product_id: "p06", user_id: "u-james", rating: 4, comment: "Stylish and comfortable. Gets compliments everywhere.", created_at: "2026-02-15T13:00:00Z", profile_name: "James Lee" },
  // p07 - Ichiran Ramen
  { id: "rev-070", product_id: "p07", user_id: "u-hanako", rating: 5, comment: "お店の味が家で楽しめる！リピート確定です。", created_at: "2026-01-12T19:00:00Z", profile_name: "Hanako Sato" },
  { id: "rev-071", product_id: "p07", user_id: "u-david", rating: 5, comment: "Tastes exactly like the restaurant. Easy to prepare at home!", created_at: "2026-02-03T20:30:00Z", profile_name: "David Park" },
  { id: "rev-072", product_id: "p07", user_id: "u-ayumi", rating: 4, comment: "美味しい！もう少し麺が多いと嬉しいかな。", created_at: "2026-02-18T18:00:00Z", profile_name: "Ayumi Ono" },
  // p09 - Wagyu
  { id: "rev-090", product_id: "p09", user_id: "u-taro", rating: 5, comment: "口の中でとろける美味しさ。特別な日に最適。", created_at: "2026-01-30T19:00:00Z", profile_name: "Taro Kobayashi" },
  { id: "rev-091", product_id: "p09", user_id: "u-lisa", rating: 5, comment: "The marbling is incredible. Best steak I've ever had!", created_at: "2026-02-14T20:00:00Z", profile_name: "Lisa Wang" },
  // p13 - SK-II
  { id: "rev-004", product_id: "p13", user_id: "usr-customer-001", rating: 5, comment: "My skin has never looked better!", created_at: "2026-02-10T11:00:00Z", profile_name: "Customer Suzuki" },
  { id: "rev-130", product_id: "p13", user_id: "u-mai", rating: 5, comment: "使い始めて1ヶ月で肌の調子が全然違います。", created_at: "2026-01-28T09:00:00Z", profile_name: "Mai Fujita" },
  { id: "rev-131", product_id: "p13", user_id: "u-rachel", rating: 4, comment: "Expensive but worth every penny. Skin feels so soft and hydrated.", created_at: "2026-02-20T15:00:00Z", profile_name: "Rachel Green" },
  // p16 - Asics
  { id: "rev-160", product_id: "p16", user_id: "u-ken", rating: 5, comment: "マラソン用に購入。膝への負担が減りました。", created_at: "2026-01-14T07:00:00Z", profile_name: "Ken Aoki" },
  { id: "rev-161", product_id: "p16", user_id: "u-mike", rating: 4, comment: "Great stability shoes for long distance running. Highly recommend.", created_at: "2026-02-06T08:00:00Z", profile_name: "Mike Thompson" },
  // p19 - Murakami Collection
  { id: "rev-005", product_id: "p19", user_id: "usr-admin-001", rating: 5, comment: "Murakami never disappoints. Beautiful collection.", created_at: "2026-01-25T16:00:00Z", profile_name: "Admin Tanaka" },
  { id: "rev-190", product_id: "p19", user_id: "u-naomi", rating: 5, comment: "村上春樹の世界観に浸れる素晴らしいセット。", created_at: "2026-02-01T21:00:00Z", profile_name: "Naomi Hayashi" },
  { id: "rev-191", product_id: "p19", user_id: "u-tom", rating: 5, comment: "Perfect for anyone wanting to dive into Murakami's works.", created_at: "2026-02-22T14:30:00Z", profile_name: "Tom Wilson" },
  // p22 - Gundam
  { id: "rev-220", product_id: "p22", user_id: "u-shin", rating: 5, comment: "組み立てが楽しい！完成品のクオリティも高い。", created_at: "2026-01-16T15:00:00Z", profile_name: "Shin Morita" },
  { id: "rev-221", product_id: "p22", user_id: "u-chris", rating: 4, comment: "Detailed kit, fun to build. Great for beginners and veterans alike.", created_at: "2026-02-09T10:00:00Z", profile_name: "Chris Anderson" },
  // p10 - Muji Diffuser
  { id: "rev-100", product_id: "p10", user_id: "u-rina", rating: 5, comment: "とても静かで、香りが部屋中に広がります。リラックスできます。", created_at: "2026-01-19T22:00:00Z", profile_name: "Rina Kato" },
  { id: "rev-101", product_id: "p10", user_id: "u-anna", rating: 4, comment: "Minimalist design fits perfectly in my room. Very calming.", created_at: "2026-02-11T19:00:00Z", profile_name: "Anna Müller" },
  // p08 - Royce Chocolate
  { id: "rev-080", product_id: "p08", user_id: "u-sakura", rating: 5, comment: "口の中でとろける生チョコ。最高のギフトです！", created_at: "2026-02-13T12:00:00Z", profile_name: "Sakura Ishii" },
  { id: "rev-081", product_id: "p08", user_id: "u-john", rating: 5, comment: "Melt-in-mouth perfection. Bought it as a Valentine's gift!", created_at: "2026-02-14T10:00:00Z", profile_name: "John Smith" },
];

// Seller's own products (linked to seller user)
export const SELLER_PRODUCTS: MockProduct[] = [
  p("sp01","Handmade Ceramic Mug Set","handmade-ceramic-mug","Artisan ceramic mugs, set of 4.","https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",4800,5800,4.6,89,35,2,false,"Yamada Crafts","cat-home","usr-seller-001"),
  p("sp02","Japanese Green Tea Sampler","green-tea-sampler","Premium sencha and matcha collection.","https://images.unsplash.com/photo-1556881286-fc6915169721?w=800",3200,3900,4.7,156,60,2,false,"Yamada Crafts","cat-food","usr-seller-001"),
  p("sp03","Bamboo Desk Organizer","bamboo-desk-organizer","Eco-friendly desktop storage solution.","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",2900,3400,4.4,67,42,1,false,"Yamada Crafts","cat-home","usr-seller-001"),
];

// --- localStorage helpers ---

const STORAGE_KEYS = {
  currentUser: "demo_current_user",
  cart: "demo_cart",
  wishlist: "demo_wishlist",
  orders: "demo_orders",
  orderItems: "demo_order_items",
  sellerProducts: "demo_seller_products",
} as const;

export const mockStorage = {
  getCurrentUser: (): MockUser | null => {
    const raw = localStorage.getItem(STORAGE_KEYS.currentUser);
    return raw ? JSON.parse(raw) : null;
  },
  setCurrentUser: (user: MockUser | null) => {
    if (user) localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.currentUser);
  },

  getCart: (): { product_id: string; quantity: number }[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.cart);
    return raw ? JSON.parse(raw) : [];
  },
  setCart: (items: { product_id: string; quantity: number }[]) => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
  },

  getWishlist: (): string[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.wishlist);
    return raw ? JSON.parse(raw) : [];
  },
  setWishlist: (ids: string[]) => {
    localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(ids));
  },

  getOrders: (): MockOrder[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.orders);
    return raw ? JSON.parse(raw) : [...MOCK_ORDERS];
  },
  setOrders: (orders: MockOrder[]) => {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  },

  getOrderItems: (): MockOrderItem[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.orderItems);
    return raw ? JSON.parse(raw) : [...MOCK_ORDER_ITEMS];
  },
  setOrderItems: (items: MockOrderItem[]) => {
    localStorage.setItem(STORAGE_KEYS.orderItems, JSON.stringify(items));
  },

  getSellerProducts: (): MockProduct[] => {
    const raw = localStorage.getItem(STORAGE_KEYS.sellerProducts);
    return raw ? JSON.parse(raw) : [...SELLER_PRODUCTS];
  },
  setSellerProducts: (products: MockProduct[]) => {
    localStorage.setItem(STORAGE_KEYS.sellerProducts, JSON.stringify(products));
  },
};
