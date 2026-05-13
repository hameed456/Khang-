import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, Menu, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const { itemCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/menu", label: "Menu" },
    { href: "/experience", label: "Experience" },
    { href: "/order/track", label: "Reservations" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="md:hidden mr-4 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-primary transition-transform group-hover:scale-105 duration-300">
              Khang
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-accent relative ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
              {location === link.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-accent rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/admin" className="text-foreground hover:text-accent transition-colors">
            <User size={20} />
          </Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-foreground hover:text-accent transition-colors group"
          >
            <ShoppingBag size={20} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-0 right-0 flex items-center justify-center min-w-4 h-4 px-1 bg-gold text-white text-[10px] font-bold rounded-full group-hover:scale-110 transition-transform"
                >
                  {itemCount}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-background flex flex-col pt-24 px-6 md:hidden"
          >
            <button
              className="absolute top-6 right-6 p-2 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
            <div className="flex flex-col space-y-6 text-2xl font-serif">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`border-b border-border pb-4 ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-border pb-4 text-muted-foreground"
              >
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
