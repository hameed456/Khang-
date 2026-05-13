import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Star } from "lucide-react";
import { useGetFeaturedProducts, getGetFeaturedProductsQueryKey, useGetStats, getGetStatsQueryKey, useListCategories, getListCategoriesQueryKey } from "@workspace/api-client-react";
import heroImg from "@assets/unnamed_1778676131796.webp";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [orderCode, setOrderCode] = useState("");
  const { data: featuredProducts, isLoading } = useGetFeaturedProducts({
    query: { queryKey: getGetFeaturedProductsQueryKey() }
  });

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderCode.trim()) {
      setLocation(`/order/${orderCode.trim()}`);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Khang Restaurant Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center text-white pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="font-serif text-gold tracking-widest uppercase text-sm md:text-base mb-4">
              Est. 1998
            </h2>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight drop-shadow-lg">
              Crafted with <br/> Tradition
            </h1>
            <p className="text-lg md:text-xl font-light text-white/90 max-w-2xl mx-auto mb-10">
              Experience the finest authentic Chinese cuisine and handcrafted dim sum, delivered to your door or enjoyed in our beautifully lit dining room.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/menu">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-accent text-white border border-primary px-8 h-14 text-lg">
                  Order Delivery
                </Button>
              </Link>
              <Link href="/experience">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white border-white/30 px-8 h-14 text-lg backdrop-blur-sm">
                  The Experience
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Signature Dishes</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Our master chefs perfect these recipes over decades. Each bite is a testament to our heritage.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts?.slice(0, 3).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-16 text-center">
            <Link href="/menu">
              <Button variant="outline" className="border-primary text-primary hover:bg-secondary">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Order Tracking Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">Track Your Order</h2>
          <p className="text-muted-foreground mb-8">
            Enter your order code to see real-time updates on your delivery.
          </p>
          
          <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input 
                type="text" 
                placeholder="Enter Order Code (e.g. ORD-12345)"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-md border border-border bg-card focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
              />
            </div>
            <Button type="submit" className="h-14 px-8 bg-primary hover:bg-accent text-white">
              Track
            </Button>
          </form>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <Star className="mx-auto text-gold w-10 h-10 mb-8 fill-current" />
          <h3 className="font-serif text-2xl md:text-4xl leading-relaxed font-light italic mb-8">
            "The Har Gow is transcendent. It's rare to find a place that respects the dim sum tradition while presenting it so beautifully. A true gem."
          </h3>
          <p className="text-primary-foreground/80 tracking-widest uppercase text-sm font-semibold">
            — The Culinary Times
          </p>
        </div>
      </section>
    </div>
  );
}
