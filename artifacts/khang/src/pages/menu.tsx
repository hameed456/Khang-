import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListProducts, getListProductsQueryKey, useListCategories, getListCategoriesQueryKey, useGetTopProducts, getGetTopProductsQueryKey } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ui/product-card";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MenuPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sliderIndex, setSliderIndex] = useState(0);

  const { data: categories, isLoading: catsLoading } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() }
  });

  const { data: products, isLoading: productsLoading } = useListProducts(
    { categoryId: selectedCategoryId ?? undefined, search: search || undefined },
    { query: { queryKey: getListProductsQueryKey({ categoryId: selectedCategoryId ?? undefined, search: search || undefined }) } }
  );

  const { data: topProducts } = useGetTopProducts({
    query: { queryKey: getGetTopProductsQueryKey() }
  });

  const sliderItems = topProducts ?? [];
  const prevSlide = () => setSliderIndex((i) => (i - 1 + sliderItems.length) % sliderItems.length);
  const nextSlide = () => setSliderIndex((i) => (i + 1) % sliderItems.length);

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero Banner */}
      <section className="relative h-72 bg-primary flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1600')] bg-cover bg-center opacity-25" />
        <div className="relative container mx-auto px-4 md:px-6 pb-12">
          <p className="text-primary-foreground/70 uppercase tracking-widest text-xs font-semibold mb-2">Limited Edition</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white">The Chef's Heritage Selection</h1>
          <p className="text-primary-foreground/80 mt-3 max-w-xl">
            Experience the delicate balance of age-old dim sum traditions and contemporary culinary innovation.
          </p>
        </div>
      </section>

      {/* Top Items Slider */}
      {sliderItems.length > 0 && (
        <section className="py-14 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-bold">Top Rated Dishes</h2>
              <div className="flex gap-2">
                <button onClick={prevSlide} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={nextSlide} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{ x: `-${sliderIndex * (300 + 24)}px` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {sliderItems.map((product) => (
                  <div key={product.id} className="min-w-[300px]">
                    <ProductCard product={product} />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Search + Categories Filter */}
      <section className="py-10 border-b border-border bg-background sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategoryId === null
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategoryId === cat.id
                      ? "bg-primary text-white"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-card text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                data-testid="input-search-menu"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <p className="font-serif text-2xl">No dishes found</p>
              <p className="mt-2 text-sm">Try a different category or search term</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {products?.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    data-testid={`card-product-${product.id}`}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
