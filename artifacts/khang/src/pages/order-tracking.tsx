import { useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { useTrackOrder, getTrackOrderQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Check, ChefHat, Truck, Package, Search } from "lucide-react";
import { Link } from "wouter";

const statusSteps = [
  { key: "received", label: "Received", sub: "Order accepted and sent to the kitchen.", Icon: Check },
  { key: "preparing", label: "Preparing", sub: "Our chefs are hand-crafting your dim sum selection.", Icon: ChefHat },
  { key: "out_for_delivery", label: "Out for Delivery", sub: "Expected departure in approximately 15 minutes.", Icon: Truck },
  { key: "delivered", label: "Delivered", sub: "Arrived at your specified sanctuary.", Icon: Package },
];

const statusOrder = ["received", "preparing", "out_for_delivery", "delivered"];

export default function OrderTracking() {
  const params = useParams<{ orderCode: string }>();
  const [inputCode, setInputCode] = useState(params.orderCode ?? "");
  const [queryCode, setQueryCode] = useState(params.orderCode ?? "");

  const { data: tracking, isLoading, error } = useTrackOrder(queryCode, {
    query: { enabled: !!queryCode, queryKey: getTrackOrderQueryKey(queryCode) }
  });

  const currentStatusIndex = tracking ? statusOrder.indexOf(tracking.status) : -1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) setQueryCode(inputCode.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {tracking ? (
            <>
              <div className="inline-block px-4 py-1.5 border border-foreground/20 rounded-sm text-xs font-bold uppercase tracking-widest text-foreground/60 mb-6">
                In Progress
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-4">
                Order #{tracking.orderCode}
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Your cinematic dining experience is currently being curated. Track the journey of your selection below.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Track Your Order</h1>
              <p className="text-muted-foreground">Enter your order code to see live updates.</p>
            </>
          )}
        </motion.div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 max-w-md mx-auto mb-14">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={inputCode}
              onChange={e => setInputCode(e.target.value)}
              placeholder="e.g. KH-8829"
              className="w-full pl-10 pr-4 h-12 border border-border rounded-md bg-card focus:ring-2 focus:ring-primary outline-none text-sm"
              data-testid="input-order-code"
            />
          </div>
          <Button type="submit" className="bg-primary text-white h-12 px-6" data-testid="button-track-order">
            Track
          </Button>
        </form>

        {isLoading && (
          <div className="text-center py-16 text-muted-foreground animate-pulse">
            <p className="font-serif text-xl">Finding your order...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-16">
            <p className="font-serif text-2xl text-muted-foreground">Order not found</p>
            <p className="text-muted-foreground text-sm mt-2">Check your order code and try again. Try: KH-8829</p>
          </div>
        )}

        {tracking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8"
          >
            {/* Live Journey */}
            <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-8">
              <h3 className="font-semibold text-foreground mb-8">Live Journey</h3>
              <div className="space-y-0">
                {statusSteps.map((step, i) => {
                  const isDone = i <= currentStatusIndex;
                  const isCurrent = i === currentStatusIndex;

                  return (
                    <div key={step.key} className="flex gap-4">
                      {/* Icon + connector */}
                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={false}
                          animate={{ backgroundColor: isDone ? "#1a3c2e" : "transparent", borderColor: isDone ? "#1a3c2e" : "#d1d5db" }}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 relative`}
                        >
                          <step.Icon size={16} className={isDone ? "text-white" : "text-muted-foreground"} />
                          {isCurrent && (
                            <motion.div
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 rounded-full bg-primary/20"
                            />
                          )}
                        </motion.div>
                        {i < statusSteps.length - 1 && (
                          <div className={`w-0.5 h-12 mt-1 ${isDone && i < currentStatusIndex ? "bg-primary" : "bg-border"}`} />
                        )}
                      </div>
                      {/* Text */}
                      <div className={`pb-12 ${i === statusSteps.length - 1 ? "pb-0" : ""}`}>
                        <p className={`font-semibold text-sm ${isDone ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.sub}</p>
                        {isCurrent && tracking.estimatedDelivery && (
                          <p className="text-xs text-primary font-medium mt-1">
                            Est. delivery: {tracking.estimatedDelivery}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gradient-to-b from-secondary to-background border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-6">Order Summary</h3>
                <div className="space-y-4">
                  {(tracking.items as Array<{productName: string; quantity: number; totalPrice: number; imageUrl?: string | null}>).map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <img
                          src={item.imageUrl || "https://images.unsplash.com/photo-1559847844-5315695dadae?w=100"}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground line-clamp-1">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity}x</p>
                      </div>
                      <p className="font-semibold text-sm text-foreground">${Number(item.totalPrice).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/50 mt-6 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${Number(tracking.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Fee</span>
                    <span>${Number(tracking.deliveryFee).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground font-bold text-lg pt-2">
                    <span>Total</span>
                    <span>${Number(tracking.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="bg-primary rounded-2xl p-6 text-white">
                <p className="text-xs text-primary-foreground/60 uppercase tracking-widest mb-1">Need Assistance?</p>
                <p className="font-serif text-xl font-bold mb-3">Connect with Host</p>
                <Button className="w-full bg-white text-primary hover:bg-secondary h-10 text-sm font-medium">
                  Contact Support
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
