import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-3xl font-bold tracking-tight mb-6 inline-block">
              Khang
            </Link>
            <p className="text-primary-foreground/80 max-w-md font-light leading-relaxed">
              A heritage Chinese dining experience blending traditional dim sum craftsmanship with cinematic modern elegance. Unhurried, warm, deeply satisfying.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-wide">Explore</h4>
            <ul className="space-y-4 text-primary-foreground/80 font-light">
              <li><Link href="/menu" className="hover:text-gold transition-colors">Our Menu</Link></li>
              <li><Link href="/experience" className="hover:text-gold transition-colors">The Experience</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-wide">Legal</h4>
            <ul className="space-y-4 text-primary-foreground/80 font-light">
              <li><a href="#" className="hover:text-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Press Inquiries</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60 font-light">
          <p>© {new Date().getFullYear()} Khang Chinese Restaurant & Dimsum. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
