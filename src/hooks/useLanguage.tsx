import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Language = "en" | "ja";

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  // Header
  "search.placeholder": { en: "Search products...", ja: "商品を検索..." },
  "nav.login": { en: "Login", ja: "ログイン" },
  "nav.orders": { en: "Orders", ja: "注文履歴" },
  "nav.seller": { en: "Seller", ja: "出品者" },
  "nav.admin": { en: "Admin", ja: "管理者" },
  // Categories
  "cat.electronics": { en: "Electronics", ja: "家電" },
  "cat.fashion": { en: "Fashion", ja: "ファッション" },
  "cat.food": { en: "Food & Grocery", ja: "食品・グルメ" },
  "cat.home": { en: "Home & Living", ja: "ホーム・生活" },
  "cat.beauty": { en: "Beauty", ja: "美容" },
  "cat.sports": { en: "Sports", ja: "スポーツ" },
  "cat.books": { en: "Books", ja: "本・雑誌" },
  "cat.toys": { en: "Toys & Kids", ja: "おもちゃ・キッズ" },
  // Hero
  "hero.badge1": { en: "Super Points x10 Campaign", ja: "スーパーポイント10倍キャンペーン" },
  "hero.title1": { en: "Discover Japan's\nBest Marketplace", ja: "日本最大の\nマーケットプレイス" },
  "hero.sub1": { en: "Shop from thousands of sellers with exclusive point rewards on every purchase.", ja: "数千の出品者からポイント還元付きでお買い物。" },
  "hero.cta1": { en: "Shop Now", ja: "今すぐ購入" },
  "hero.badge2": { en: "Flash Sale Today", ja: "本日限定タイムセール" },
  "hero.title2": { en: "Up to 70% Off\nTop Electronics", ja: "人気家電が\n最大70%OFF" },
  "hero.sub2": { en: "Limited time deals on smartphones, laptops, headphones and more.", ja: "スマホ・ノートPC・ヘッドホンなど期間限定セール。" },
  "hero.cta2": { en: "View Deals", ja: "セールを見る" },
  "hero.badge3": { en: "New Season Collection", ja: "新シーズンコレクション" },
  "hero.title3": { en: "Spring Fashion\nHas Arrived", ja: "春ファッション\n新着入荷" },
  "hero.sub3": { en: "Explore the latest trends from top Japanese and international brands.", ja: "日本・海外ブランドの最新トレンドをチェック。" },
  "hero.cta3": { en: "Explore Fashion", ja: "ファッションを見る" },
  "hero.join": { en: "Join Free", ja: "無料会員登録" },
  // Features strip
  "feat.points": { en: "Point Rewards", ja: "ポイント還元" },
  "feat.points.desc": { en: "Earn points on every purchase", ja: "全購入でポイント獲得" },
  "feat.shipping": { en: "Fast Shipping", ja: "迅速配送" },
  "feat.shipping.desc": { en: "Free shipping on ¥3,980+", ja: "¥3,980以上で送料無料" },
  "feat.protection": { en: "Buyer Protection", ja: "購入者保護" },
  "feat.protection.desc": { en: "Money-back guarantee", ja: "返金保証付き" },
  "feat.deals": { en: "Daily Deals", ja: "日替わりセール" },
  "feat.deals.desc": { en: "Exclusive flash sales", ja: "限定タイムセール" },
  // Sections
  "section.categories": { en: "Shop by Category", ja: "カテゴリーから探す" },
  "section.featured": { en: "🔥 Featured Products", ja: "🔥 おすすめ商品" },
  "section.new": { en: "🆕 New Arrivals", ja: "🆕 新着商品" },
  // Reviews
  "reviews.title": { en: "Customer Reviews", ja: "カスタマーレビュー" },
  "reviews.write": { en: "Write a Review", ja: "レビューを書く" },
  "reviews.placeholder": { en: "Share your thoughts about this product...", ja: "この商品についての感想を書いてください..." },
  "reviews.submit": { en: "Submit Review", ja: "レビューを投稿" },
  "reviews.none": { en: "No reviews yet. Be the first to review!", ja: "まだレビューがありません。最初のレビューを書きましょう！" },
  "reviews.login": { en: "Please login", ja: "ログインしてください" },
  "reviews.login.desc": { en: "You need to sign in to leave a review", ja: "レビューを投稿するにはログインが必要です" },
  "reviews.select": { en: "Select a rating", ja: "評価を選択してください" },
  "reviews.submitted": { en: "Review submitted!", ja: "レビューを投稿しました！" },
  // Footer
  "footer.about": { en: "About", ja: "会社概要" },
  "footer.help": { en: "Help & Support", ja: "ヘルプ・サポート" },
  "footer.privacy": { en: "Privacy Policy", ja: "プライバシーポリシー" },
  "footer.terms": { en: "Terms of Service", ja: "利用規約" },
  // Product
  "product.addcart": { en: "Add to Cart", ja: "カートに追加" },
  "product.points": { en: "points", ja: "ポイント" },
  // Flash Sale
  "flash.title": { en: "⚡ Time Sale", ja: "⚡ タイムセール" },
  "flash.subtitle": { en: "Today's limited deals — don't miss out!", ja: "本日限定のお得なセール！お見逃しなく！" },
  // Recently Viewed
  "section.recent": { en: "👀 Recently Viewed", ja: "👀 最近チェックした商品" },
  // Coupon
  "coupon.placeholder": { en: "Enter coupon code", ja: "クーポンコードを入力" },
  "coupon.apply": { en: "Apply", ja: "適用" },
  "coupon.invalid": { en: "Invalid coupon code", ja: "無効なクーポンコードです" },
  "coupon.hint": { en: "Try: WELCOME10, SAVE500, SPRING20", ja: "例: WELCOME10, SAVE500, SPRING20" },
  // Notifications
  "notif.title": { en: "Notifications", ja: "お知らせ" },
  "notif.empty": { en: "No notifications", ja: "お知らせはありません" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("app_language");
    return (saved === "ja" ? "ja" : "en") as Language;
  });

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("app_language", lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[key]?.[language] ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
