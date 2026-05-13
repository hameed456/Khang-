import { useCart } from "@/hooks/use-cart";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";

export function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    items, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    tax, 
    deliveryFee, 
    total 
  } = useCart();
  const [, setLocation] = useLocation();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-card shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                <ShoppingBag className="text-primary" />
                Your Order
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-4">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ShoppingBag size={40} className="text-muted-foreground/50" />
                  </div>
                  <p className="text-lg">Your cart is empty.</p>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setLocation("/menu");
                    }}
                    className="text-primary font-medium hover:text-accent transition-colors"
                  >
                    Browse our menu
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.productId} 
                      className="flex gap-4"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.productName} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-foreground">{item.productName}</h3>
                          <button 
                            onClick={() => removeFromCart(item.productId)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-primary font-medium mt-1">${item.price.toFixed(2)}</p>
                        <div className="mt-auto flex items-center border border-border rounded-md w-fit overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-6 bg-card">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Tax (5%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-serif font-bold text-xl">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setLocation("/checkout");
                  }}
                  className="w-full bg-primary hover:bg-accent text-primary-foreground font-medium py-4 rounded-md transition-colors flex justify-center items-center gap-2 active:scale-[0.98] duration-200"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
