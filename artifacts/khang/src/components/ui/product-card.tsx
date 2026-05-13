import { Product } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className={`group bg-card rounded-xl overflow-hidden border border-border cursor-pointer transition-shadow hover:shadow-xl ${
          featured ? "flex flex-col md:flex-row h-full" : "flex flex-col h-full"
        }`}
      >
        <div className={`relative overflow-hidden ${featured ? "md:w-1/2" : "w-full aspect-[4/3]"}`}>
          <motion.img
            layoutId={`product-image-${product.id}`}
            src={product.imageUrl || "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.isFeatured && (
            <div className="absolute top-4 left-4 bg-gold text-white text-xs font-bold px-2 py-1 rounded">
              Signature
            </div>
          )}
        </div>
        <div className={`p-6 flex flex-col flex-1 ${featured ? "md:w-1/2 justify-center" : ""}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <span className="font-serif text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center gap-1 mb-3 text-gold text-sm">
            <Star size={14} className="fill-current" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviewCount})</span>
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {product.categoryName}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ShoppingBag size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
