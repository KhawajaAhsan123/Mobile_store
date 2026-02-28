import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Search, ShoppingCart, Star, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const categoryFilters = ['all', 'mobiles', 'handsfree', 'chargers', 'accessories', 'other'];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize search from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearch(urlSearch);
      setDebouncedSearch(urlSearch);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*').order('created_at', { ascending: false });
      if (activeCategory !== 'all') query = query.eq('category', activeCategory);
      if (debouncedSearch.trim()) {
        query = query.or(`name.ilike.%${debouncedSearch.trim()}%,description.ilike.%${debouncedSearch.trim()}%,category.ilike.%${debouncedSearch.trim()}%`);
      }
      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [activeCategory, debouncedSearch]);

  const handleAddToCart = (p: any) => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to sign in to add items to cart', variant: 'destructive' });
      return;
    }
    addToCart({ id: p.id, name: p.name, price: p.price, image_url: p.image_url });
    toast({ title: 'Added to cart!', description: `${p.name} added to your cart` });
  };

  return (
    <main className="page-background py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          <span className="hover:text-primary cursor-pointer">Home</span>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Products</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-32">
              <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">Categories</h3>
              <div className="space-y-1">
                {categoryFilters.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSearchParams(cat === 'all' ? {} : { category: cat })}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                      activeCategory === cat
                        ? 'gradient-bg text-white font-medium shadow-sm glow-primary'
                        : 'text-foreground hover:bg-secondary hover:text-primary'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="mt-6">
                <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 h-10 text-sm bg-secondary border-border rounded-xl focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                {activeCategory === 'all' ? 'All Products' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
              </h1>
              <p className="text-sm text-muted-foreground">{products.length} products</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card-product">
                    <div className="aspect-square bg-secondary/50 shimmer" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-secondary rounded-full w-2/3" />
                      <div className="h-4 bg-secondary rounded-full w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                <Smartphone className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-foreground">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
              >
                {products.map((p) => (
                  <motion.div key={p.id} variants={fadeUp}>
                    <div className="card-product group">
                      <div className="aspect-square bg-secondary/20 flex items-center justify-center overflow-hidden relative">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            loading="lazy"
                          />
                        ) : (
                          <Smartphone className="w-12 h-12 text-muted-foreground/20" />
                        )}
                        {p.stock <= 0 && (
                          <span className="absolute top-2 right-2 badge-sale text-[11px]">Sold Out</span>
                        )}
                        {p.featured && p.stock > 0 && (
                          <span className="absolute top-2 left-2 badge-limited text-[11px]">
                            <Sparkles className="w-3 h-3 inline mr-0.5" />Featured
                          </span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                          <Button
                            size="sm"
                            className="gradient-bg text-white hover:opacity-90 shadow-lg glow-primary rounded-full px-5"
                            disabled={p.stock <= 0}
                            onClick={() => handleAddToCart(p)}
                          >
                            <Zap className="w-4 h-4 mr-1" /> Add
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-[11px] text-primary font-medium uppercase tracking-wider mb-1">{p.category}</p>
                        <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-2 leading-snug">{p.name}</h3>
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-base font-bold gradient-text">₨ {p.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;
