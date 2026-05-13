import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useCreateOrder } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Wallet, Banknote, Minus, Plus, X } from "lucide-react";
import { Link } from "wouter";

type PaymentMethod = "card" | "upi" | "wallet" | "cod";

const paymentMethods = [
  { id: "card" as PaymentMethod, label: "Card", Icon: CreditCard },
  { id: "upi" as PaymentMethod, label: "UPI", Icon: Smartphone },
  { id: "wallet" as PaymentMethod, label: "Wallet", Icon: Wallet },
  { id: "cod" as PaymentMethod, label: "COD", Icon: Banknote },
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, subtotal, tax, deliveryFee, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const handlePlaceOrder = async () => {
    if (!name || !phone || !address) {
      toast({ title: "Missing details", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Empty cart", description: "Add items to your cart before placing an order.", variant: "destructive" });
      return;
    }

    createOrder.mutate({
      data: {
        customerName: name,
        customerPhone: phone,
        deliveryAddress: address,
        paymentMethod,
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        notes: null,
      }
    }, {
      onSuccess: (order) => {
        clearCart();
        setLocation(`/order/${order.orderCode}`);
      },
      onError: () => {
        toast({ title: "Order failed", description: "Something went wrong. Please try again.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl font-bold text-foreground mb-3"
        >
          Checkout
        </motion.h1>
        <p className="text-muted-foreground mb-12">Complete your order for a cinematic dining experience at home.</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Delivery Details */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-5 h-5 rounded-sm bg-primary/20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-foreground">Delivery Details</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">Full Name</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full h-12 px-4 border border-border rounded-md bg-card focus:ring-2 focus:ring-primary outline-none text-sm"
                    data-testid="input-customer-name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">Phone Number</label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="w-full h-12 px-4 border border-border rounded-md bg-card focus:ring-2 focus:ring-primary outline-none text-sm"
                    data-testid="input-customer-phone"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">Delivery Address</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter your full delivery address"
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-md bg-card focus:ring-2 focus:ring-primary outline-none text-sm resize-none"
                  data-testid="input-delivery-address"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-5 h-5 rounded-sm bg-primary/20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-foreground">Payment Method</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {paymentMethods.map(({ id, label, Icon }) => (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setPaymentMethod(id)}
                    data-testid={`button-payment-${id}`}
                    className={`flex flex-col items-center justify-center gap-2 h-20 rounded-lg border-2 transition-all ${
                      paymentMethod === id
                        ? "border-primary bg-secondary text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <Icon size={22} />
                    <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-foreground">Your Selection</h3>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{items.length} Items</span>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Your cart is empty</p>
                  <Link href="/menu"><Button variant="outline" className="mt-3 text-sm">Browse Menu</Button></Link>
                </div>
              ) : (
                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-3 items-start">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <img src={item.imageUrl || "https://images.unsplash.com/photo-1559847844-5315695dadae?w=100"} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm line-clamp-1">{item.productName}</p>
                        <p className="text-primary font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                            <Minus size={10} />
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.productId)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-border pt-5 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground font-bold text-xl pt-3 border-t border-border">
                  <span>Grand Total</span>
                  <span className="font-serif text-2xl text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={createOrder.isPending || items.length === 0}
                  className="w-full h-14 bg-primary hover:bg-accent text-white font-bold text-base mt-5 uppercase tracking-widest"
                  data-testid="button-place-order"
                >
                  {createOrder.isPending ? "Placing Order..." : "Place Order →"}
                </Button>
              </motion.div>
              <p className="text-center text-xs text-muted-foreground mt-3">
                By placing this order, you agree to our terms of service
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
