import { useState } from "react";
import { CATEGORIES } from "@/data/mockData";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

interface ProductFilterProps {
  onFilterChange: (filters: { priceRange: [number, number]; categoryIds: string[] }) => void;
  initialCategorySlug?: string;
}

export const ProductFilter = ({ onFilterChange, initialCategorySlug }: ProductFilterProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (initialCategorySlug) {
      const cat = CATEGORIES.find((c) => c.slug === initialCategorySlug);
      return cat ? [cat.id] : [];
    }
    return [];
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    onFilterChange({ priceRange, categoryIds: selectedCategories });
  };

  const handleClear = () => {
    setPriceRange([0, 100000]);
    setSelectedCategories([]);
    onFilterChange({ priceRange: [0, 100000], categoryIds: [] });
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  const filterContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold mb-3 text-foreground">Price Range</h3>
        <Slider min={0} max={100000} step={500} value={priceRange} onValueChange={(v) => setPriceRange(v as [number, number])} className="mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>¥{priceRange[0].toLocaleString()}</span>
          <span>¥{priceRange[1].toLocaleString()}</span>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold mb-3 text-foreground">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm hover:text-primary transition-colors">
              <Checkbox checked={selectedCategories.includes(cat.id)} onCheckedChange={() => toggleCategory(cat.id)} />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleApply} className="flex-1 font-bold" size="sm">Apply Filters</Button>
        <Button onClick={handleClear} variant="outline" size="sm">Clear</Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-60 flex-shrink-0">
        <div className="bg-card rounded-lg p-4 shadow-card sticky top-32">
          <h2 className="font-bold text-base mb-4 flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Filters</h2>
          {filterContent}
        </div>
      </div>
      <div className="lg:hidden mb-4">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          {isOpen ? "Hide Filters" : "Show Filters"}
        </Button>
        {isOpen && (
          <div className="bg-card rounded-lg p-4 shadow-card mt-3 animate-fade-in">{filterContent}</div>
        )}
      </div>
    </>
  );
};
