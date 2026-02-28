import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Smartphone, Headphones, BatteryCharging, Shield, Truck, Star, ArrowRight, ChevronRight, Watch, Package, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const categories = [
  { icon: Smartphone, label: 'Smart Phones', href: '/products?category=mobiles', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop' },
  { icon: Headphones, label: 'Earbuds & Handsfree', href: '/products?category=handsfree', img: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=300&h=300&fit=crop' },
  { icon: BatteryCharging, label: 'Chargers', href: '/products?category=chargers', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&h=300&fit=crop' },
  { icon: Watch, label: 'Accessories', href: '/products?category=accessories', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop' },
];

const features = [
  { icon: Shield, label: 'Genuine Products', desc: '100% Original with Warranty' },
  { icon: Truck, label: 'Free Delivery', desc: 'Nationwide in 2-3 Days' },
  { icon: Star, label: 'Best Prices', desc: 'Price Match Guarantee' },
  { icon: Package, label: 'COD Available', desc: 'Cash on Delivery' },
];

const Index = () => {
  const [featured, setFeatured] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  useEffect(() => {
    supabase.from('products').select('*').eq('featured', true).limit(8).then(({ data }) => {
      if (data) setFeatured(data);
    });
    supabase.from('products').select('*').order('created_at', { ascending: false }).limit(12).then(({ data }) => {
      if (data) setAllProducts(data);
    });
  }, []);

  const handleAddToCart = (p: any) => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'Sign in to add items', variant: 'destructive' });
      return;
    }
    addToCart({ id: p.id, name: p.name, price: p.price, image_url: p.image_url });
    toast({ title: 'Added to cart!', description: `${p.name} added` });
  };

  const ProductCard = ({ p }: { p: any }) => (
    <div className="card-product group">
      <div className="aspect-square bg-secondary/30 flex items-center justify-center overflow-hidden relative">
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <Smartphone className="w-12 h-12 text-muted-foreground/20" />
        )}
        {p.stock <= 0 && (
          <span className="absolute top-2 right-2 badge-sale">Sold Out</span>
        )}
        {p.featured && p.stock > 0 && (
          <span className="absolute top-2 left-2 badge-limited">
            <Sparkles className="w-3 h-3 inline mr-1" />Featured
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
          <Button
            size="sm"
            className="gradient-bg text-white hover:opacity-90 shadow-lg glow-primary rounded-full px-6"
            disabled={p.stock <= 0}
            onClick={() => handleAddToCart(p)}
          >
            <Zap className="w-4 h-4 mr-1" /> Add to Cart
          </Button>
        </div>
      </div>
      <div className="p-4 card-enhanced">
        <Link to="/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug mb-2 block text-enhanced">
          {p.name}
        </Link>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-lg font-bold gradient-text text-enhanced">₨ {p.price.toLocaleString()}</p>
      </div>
    </div>
  );

  return (
    <main className="page-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl float-animation" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl float-animation-delay" />
        </div>

        <motion.div style={{ y: heroY }} className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" /> Pakistan's #1 Mobile Store
              </motion.div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6 text-enhanced">
                Best Prices.
                <br />
                <span className="gradient-text">Genuine Products.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed text-enhanced">
                Pakistan's trusted destination for smartphones, accessories & more. PTA Approved devices with nationwide COD delivery.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="gradient-bg text-white hover:opacity-90 rounded-full h-13 px-8 font-semibold glow-primary text-base">
                  <Link to="/products">Shop Now <ArrowRight className="w-5 h-5 ml-2" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full h-13 px-8 border-primary/30 text-primary hover:bg-primary/5 text-base">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {[
                'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=250&fit=crop',
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=250&fit=crop',
              ].map((img, i) => (
                <motion.div
                  key={i}
                  className={`rounded-2xl overflow-hidden shadow-lg ${i < 2 ? 'aspect-square' : 'aspect-video'} ${i % 2 === 0 ? 'float-animation' : 'float-animation-delay'}`}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={img} alt="Product" className="w-full h-full object-cover" loading="lazy" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features strip */}
      <section className="border-y border-border bg-card py-6">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {features.map(f => (
              <motion.div key={f.label} variants={fadeUp} className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center shrink-0 group-hover:glow-primary transition-shadow duration-300">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-foreground">
              Browse <span className="gradient-text">Categories</span>
            </motion.h2>
            <Link to="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            {categories.map(cat => (
              <motion.div key={cat.label} variants={scaleIn}>
                <Link to={cat.href}>
                  <Card className="border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-500 group overflow-hidden rounded-2xl">
                    <div className="aspect-[4/3] overflow-hidden bg-secondary/20 relative">
                      <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.label}</h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-14 bg-card">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-foreground">
                Smart <span className="gradient-text">Phones</span>
              </motion.h2>
              <Link to="/products?category=mobiles" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {featured.map(p => (
                <motion.div key={p.id} variants={fadeUp}>
                  <ProductCard p={p} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* All Products */}
      {allProducts.length > 0 && (
        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-2xl md:text-3xl font-bold text-foreground">
                All <span className="gradient-text">Products</span>
              </motion.h2>
              <Link to="/products" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
            >
              {allProducts.map(p => (
                <motion.div key={p.id} variants={fadeUp}>
                  <ProductCard p={p} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-14 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Welcome to <span className="gradient-text">PAK SMART MOBILE</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              PAK SMART MOBILE is your premier destination for mobile phones and accessories in Pakistan. We offer an extensive range of the latest smartphones, earbuds, chargers, and accessories at the best prices.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              With nationwide Cash on Delivery (COD), free shipping, and a commitment to 100% genuine products with warranty, we've established ourselves as a trusted name in online mobile shopping in Pakistan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold">PAK SMART <span className="text-primary">MOBILE</span></span>
                  <p className="text-xs text-background/60">Best Prices · Genuine Products</p>
                </div>
              </div>
              <p className="text-sm text-background/60 leading-relaxed max-w-sm">
                Pakistan's leading mobile accessories store. Original products, fast delivery, and unbeatable prices since 2024.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
              <div className="space-y-2">
                {['Home', 'Products', 'About Us', 'Contact Us'].map(l => (
                  <Link key={l} to={`/${l === 'Home' ? '' : l.toLowerCase().replace(' ', '')}`} className="block text-sm text-background/60 hover:text-primary transition-colors">
                    {l}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Contact</h4>
              <div className="space-y-2 text-sm text-background/60">
                <p>+92 300 1234567</p>
                <p>info@paksmartmobile.com</p>
                <p>Lahore, Pakistan</p>
              </div>
            </div>
          </div>
          <div className="border-t border-background/10 pt-6 text-center">
            <p className="text-xs text-background/40">© 2024 PAK SMART MOBILE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
