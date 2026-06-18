import { Link } from "react-router-dom";
import catElectronics from "@/assets/cat-electronics.jpg";
import catFashion from "@/assets/cat-fashion.jpg";
import catFood from "@/assets/cat-food.jpg";
import catHome from "@/assets/cat-home.jpg";
import catBeauty from "@/assets/cat-beauty.jpg";
import catSports from "@/assets/cat-sports.jpg";
import catBooks from "@/assets/cat-books.jpg";
import catToys from "@/assets/cat-toys.jpg";

const categories = [
  { name: "Electronics", slug: "electronics", image: catElectronics },
  { name: "Fashion", slug: "fashion", image: catFashion },
  { name: "Food & Grocery", slug: "food", image: catFood },
  { name: "Home & Living", slug: "home", image: catHome },
  { name: "Beauty", slug: "beauty", image: catBeauty },
  { name: "Sports", slug: "sports", image: catSports },
  { name: "Books", slug: "books", image: catBooks },
  { name: "Toys & Kids", slug: "toys", image: catToys },
];

export const CategoryGrid = () => {
  return (
    <section className="container py-8">
      <h2 className="text-xl font-bold mb-5">Shop by Category</h2>
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="group flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-card shadow-card group-hover:shadow-card-hover transition-all duration-500 border group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-primary/30">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-[1.15] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-center text-foreground/80 group-hover:text-primary transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
