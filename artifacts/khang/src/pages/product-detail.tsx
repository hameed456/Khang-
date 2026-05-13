import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetProduct, getGetProductQueryKey,
  useGetProductReviews, getGetProductReviewsQueryKey,
  useCreateProductReview,
} from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus, ShoppingBag, Phone, MapPin, Clock, ChevronRight } from "lucide-react";
import { Link } from "wouter";

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= Math.round(value) ? "fill-[#c9a84c] text-[#c9a84c]" : "text-muted-foreground"}
        />
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id ?? "0", 10);
  const [, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useGetProduct(productId, {
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) }
  });

  const { data: reviews } = useGetProductReviews(productId, {
    query: { enabled: !!productId, queryKey: getGetProductReviewsQueryKey(productId) }
  });

  const createReview = useCreateProductReview();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    });
    toast({ title: "Added to Cart", description: `${quantity}x ${product.name} added to your cart.` });
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    });
    setLocation("/checkout");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-muted rounded-2xl" />
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="font-serif text-3xl text-muted-foreground">Dish not found</p>
          <Link href="/menu"><Button className="mt-4">Back to Menu</Button></Link>
        </div>
      </div>
    );
  }

  const livePrice = (product.price * quantity).toFixed(2);
  const ingredients = product.ingredients?.split(",").map(i => i.trim()) ?? [];

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 py-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/menu" className="hover:text-primary transition-colors uppercase tracking-wider">Menu</Link>
        <ChevronRight size={12} />
        <span className="uppercase tracking-wider">{product.categoryName}</span>
        <ChevronRight size={12} />
        <span className="uppercase tracking-wider text-foreground font-medium">{product.name}</span>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Food Image — cinematic zoom-in entrance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="sticky top-24"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <motion.img
                layoutId={`product-image-${product.id}`}
                src={product.imageUrl || "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isFeatured && (
                <div className="absolute top-5 left-5 bg-[#c9a84c] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Signature Dish
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <StarRating value={product.rating} />
              <span className="text-muted-foreground text-sm">{product.reviewCount}+ Verified Reviews</span>
            </div>

            <p className="font-serif text-4xl font-bold text-primary mb-6">
              ${Number(livePrice)}
              <span className="text-sm font-sans font-normal text-muted-foreground ml-2">
                (per {quantity} {quantity === 1 ? "piece" : "pieces"})
              </span>
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {/* Ingredients */}
            {ingredients.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground mb-3">Core Ingredients</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{ing}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prep time */}
            {product.prepTime && (
              <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>Ready in {product.prepTime}</span>
              </div>
            )}

            {/* Quantity Control */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-border rounded-full overflow-hidden">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                  data-testid="button-quantity-decrease"
                >
                  <Minus size={16} />
                </motion.button>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={quantity}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="w-12 text-center font-medium text-foreground text-lg"
                  >
                    {quantity}
                  </motion.span>
                </AnimatePresence>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                  data-testid="button-quantity-increase"
                >
                  <Plus size={16} />
                </motion.button>
              </div>
              <span className="font-serif text-2xl font-bold text-primary">${livePrice}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.div whileTap={{ scale: 0.97 }} className="relative overflow-hidden rounded-md">
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-14 bg-primary hover:bg-accent text-white text-base font-medium relative overflow-hidden group"
                  data-testid="button-add-to-cart"
                >
                  <ShoppingBag size={18} className="mr-2" />
                  Add to Cart
                  <span className="absolute inset-0 bg-white/10 scale-0 group-active:scale-100 rounded-full transition-transform duration-300" />
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="w-full h-14 border-primary text-primary hover:bg-secondary text-base font-medium"
                  data-testid="button-buy-now"
                >
                  Buy Now
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground">Heritage Experience</h2>
                <p className="text-muted-foreground mt-1">What our guests are saying about this dish.</p>
              </div>
            </div>

            {reviews && reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card p-6 rounded-xl border border-border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground">{review.reviewerName}</p>
                      <StarRating value={review.rating} />
                    </div>
                    <p className="text-muted-foreground text-sm italic leading-relaxed">"{review.comment}"</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to share your experience.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact / Info Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-3">Khang Signature</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                Authentic dim sum traditions meets cinematic elegance. Join us for a journey through the storied flavors of heritage Chinese cuisine.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-primary-foreground/60 mb-4">The Restaurant</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-primary-foreground/60 mt-0.5 flex-shrink-0" />
                  <span>88 Heritage Way, District 1</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-primary-foreground/60 flex-shrink-0" />
                  <span>+1 (555) 888-0108</span>
                </div>
                <Button className="mt-3 bg-white text-primary hover:bg-secondary h-10 text-sm px-5">
                  Call to Inquire
                </Button>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-primary-foreground/60 mb-4">Dining Hours</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Mon – Thu</span><span>11:00 – 21:00</span></div>
                <div className="flex justify-between"><span>Fri – Sat</span><span>10:00 – 23:00</span></div>
                <div className="flex justify-between"><span>Sunday</span><span>10:00 – 21:00</span></div>
                <p className="text-primary-foreground/50 text-xs mt-2">*Dim sum served until 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
