import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock, Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setName(""); setEmail(""); setMessage("");
    toast({ title: "Message Sent", description: "We'll respond within 24 hours. Thank you!" });
  };

  const info = [
    { Icon: Phone, label: "Phone", value: "+1 (555) 888-0108", sub: "Mon–Sun, 10 AM – 10 PM" },
    { Icon: MapPin, label: "Address", value: "88 Heritage Way, District 1", sub: "Dine-in & Takeaway" },
    { Icon: Clock, label: "Hours", value: "Mon–Thu 11:00–21:00", sub: "Fri–Sun 10:00–23:00" },
    { Icon: Mail, label: "Email", value: "hello@khangdimsum.com", sub: "We reply within 24 hours" },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-3">Get in Touch</p>
          <h1 className="font-serif text-5xl font-bold text-foreground mb-3">Contact Us</h1>
          <p className="text-muted-foreground max-w-xl">Whether you have a question about our menu, want to make a reservation, or discuss catering — we're here.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Info + Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {info.map(({ Icon, label, value, sub }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-3">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">{label}</p>
                  <p className="font-medium text-foreground text-sm">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="w-full h-60 rounded-2xl overflow-hidden border border-border bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-muted-foreground">
                <MapPin size={36} className="text-primary" />
                <p className="font-serif text-lg text-foreground">88 Heritage Way, District 1</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm underline hover:no-underline"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">Name</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full h-12 px-4 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none text-sm transition-shadow"
                    data-testid="input-contact-name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full h-12 px-4 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none text-sm transition-shadow"
                    data-testid="input-contact-email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={5}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary outline-none text-sm resize-none transition-shadow"
                    data-testid="input-contact-message"
                  />
                </div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full h-12 bg-primary hover:bg-accent text-white font-medium"
                    data-testid="button-contact-submit"
                  >
                    {sending ? "Sending..." : <><Send size={16} className="mr-2" /> Send Message</>}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
