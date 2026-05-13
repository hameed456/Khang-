import { motion } from "framer-motion";
import heroImg from "@assets/unnamed_1778676131796.webp";

const team = [
  { name: "Chef Wei Khang", role: "Executive Chef & Founder", bio: "With over 30 years mastering Cantonese and Sichuan cuisine, Chef Wei trained under three Michelin-starred masters before founding Khang in 1998." },
  { name: "Lin Mei", role: "Head Dim Sum Chef", bio: "Lin has spent 20 years perfecting the delicate art of dim sum, hand-folding over 500 pieces each morning before the restaurant opens." },
  { name: "David Chen", role: "Operations Director", bio: "David ensures every order — dine-in or delivery — meets the same exacting standards that have defined Khang for over two decades." },
];

const milestones = [
  { year: "1998", label: "Founded in Heritage District" },
  { year: "2004", label: "Expanded to full dim sum menu" },
  { year: "2011", label: "Launched delivery across the city" },
  { year: "2018", label: "Awarded Best Chinese Restaurant" },
  { year: "2024", label: "Serving 1,000+ orders monthly" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <section className="relative h-80 flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Khang Restaurant" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div className="relative container mx-auto px-4 md:px-6 pb-12">
          <p className="text-white/60 uppercase tracking-widest text-xs font-semibold mb-2">Our Story</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white">More than a restaurant.</h1>
          <p className="text-white/70 mt-2 max-w-xl">A living heritage — built over decades, served one dim sum at a time.</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs uppercase tracking-widest font-semibold text-primary mb-4">Our Heritage</p>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-6">Where Every Dish Tells a Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Khang was founded in 1998 by Chef Wei Khang, who left Hong Kong with a single mission: to bring the
                authentic spirit of traditional Chinese dining to a new city. Not a fusion, not an approximation — the real thing.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, Khang serves hundreds of families each week. The menu has grown, but our philosophy has not changed:
                every dish should taste like it was made for a person, not a crowd. Hand-folded, slow-cooked, unhurried.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              {milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-5 border-b border-border pb-5 last:border-0">
                  <span className="font-serif text-2xl font-bold text-primary w-16 flex-shrink-0">{m.year}</span>
                  <p className="text-muted-foreground text-sm pt-1">{m.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary-foreground/60 uppercase tracking-widest text-xs font-semibold mb-4">Our Mission</p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-6">
              To make every meal feel like a celebration.
            </h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              We believe food is not just nourishment — it is memory, connection, and craft. At Khang, every order
              is treated with the same reverence whether you dine in our restaurant or receive delivery at home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-serif text-4xl font-bold text-foreground">The People Behind Every Dish</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8 text-center"
              >
                <div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-5 flex items-center justify-center">
                  <span className="font-serif text-2xl font-bold text-primary">{member.name.charAt(0)}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-xs text-primary uppercase tracking-wider font-semibold mb-4">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
