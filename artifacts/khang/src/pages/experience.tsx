import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { useGetFeaturedProducts, getGetFeaturedProductsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";
import riceImg from "@assets/7925ebcd959bb480bd051353faa04089_1778676151741.jpg";

const floatingVariants: Variants = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const floatingVariants2: Variants = {
  animate: {
    y: [0, -18, 0],
    transition: { duration: 4.2, repeat: Infinity, ease: "easeInOut" as const, delay: 0.8 },
  },
};

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const { data: featured } = useGetFeaturedProducts({
    query: { queryKey: getGetFeaturedProductsQueryKey() }
  });

  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800", label: "Main Dining Hall", sub: "Cinematic heritage atmosphere" },
    { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", label: "Imperial Tea Service", sub: "Ancient tea rituals, reimagined" },
    { src: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800", label: "Dim Sum Collection", sub: "38 handcrafted varieties daily" },
    { src: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800", label: "Heritage Crafts", sub: "Master chefs at work" },
  ];

  return (
    <div className="min-h-screen bg-background" ref={ref}>
      {/* Parallax Hero with wooden table feel */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: bgY }}
        >
          <img
            src={riceImg}
            alt="Khang Heritage Dining"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-24">
          {/* Left: floating food items */}
          {featured && featured.slice(0, 2).map((product, i) => (
            <motion.div
              key={product.id}
              variants={i === 0 ? floatingVariants : floatingVariants2}
              animate="animate"
              className={`relative ${i === 1 ? "hidden md:block ml-16 mt-24" : ""}`}
            >
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                <img
                  src={product.imageUrl || "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Info pill */}
              {i === 1 && (
                <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-xl w-44">
                  <p className="font-serif font-bold text-foreground text-sm line-clamp-1">{product.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={10} className="fill-[#c9a84c] text-[#c9a84c]" />
                    <span className="text-xs font-medium text-foreground">{product.rating}</span>
                  </div>
                  <p className="text-primary font-bold text-sm mt-1">${Number(product.price).toFixed(2)}</p>
                </div>
              )}
            </motion.div>
          ))}

          {/* Right: text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white"
          >
            <p className="uppercase tracking-widest text-xs font-semibold text-white/60 mb-3">
              Chef's Signature Experience
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
              Hand-Crafted<br />Dim Sum Trio
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} className="fill-[#c9a84c] text-[#c9a84c]" />
                ))}
              </div>
              <span className="text-white/80 text-sm">4.9 (240 Reviews)</span>
            </div>
            {featured?.[0] && (
              <p className="font-serif text-4xl font-bold text-[#c9a84c] mb-6">
                ${Number(featured[0].price).toFixed(2)}
              </p>
            )}
            <p className="text-white/80 text-base mb-8 max-w-md leading-relaxed">
              Our master chefs prepare each dumpling daily using heritage techniques passed down through generations. This selection features crystal shrimp Har Gow, scallop Siu Mai, and truffle-infused mushroom dumplings.
            </p>
            <Link href="/menu">
              <Button className="bg-white text-primary hover:bg-secondary h-12 px-8 font-medium">
                Order Now <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Art of the Table section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">The Art of the Table</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A curated sensory journey through traditional flavors reimagined for the modern palate.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleryImages.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer ${i === 0 ? "md:col-span-2 h-80" : "h-64"}`}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-serif text-xl font-bold">{item.label}</p>
                  <p className="text-white/70 text-sm">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured food list with floating animation */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl font-bold text-center mb-16"
          >
            Signature Masterpieces
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featured?.slice(0, 6).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                animate={{ y: [0, -6, 0] }}
                whileHover={{ scale: 1.03 }}
              >
                <Link href={`/product/${product.id}`}>
                  <div className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="relative h-52 overflow-hidden">
                      <motion.img
                        layoutId={`product-image-${product.id}`}
                        src={product.imageUrl || "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-lg font-bold text-foreground mb-1">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[#c9a84c]">
                          <Star size={13} className="fill-current" />
                          <span className="text-sm font-medium text-foreground">{product.rating}</span>
                        </div>
                        <span className="font-serif font-bold text-primary text-lg">${Number(product.price).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
