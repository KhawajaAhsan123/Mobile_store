import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, LogOut, Menu, X, MessageCircle, Shield, Smartphone, Phone, Sun, Moon, Palette, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Main header */}
      <header className={`bg-card/95 backdrop-blur-xl border-b border-border sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-primary/5' : ''}`}>
        {/* Upper header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center group-hover:glow-primary transition-shadow duration-300">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  PAK SMART <span className="gradient-text">MOBILE</span>
                </span>
                <p className="text-[10px] text-muted-foreground -mt-1">Best Prices · Genuine Products</p>
              </div>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden md:flex">
              <div className="relative w-full">
                <Input
                  placeholder="Search for phones, earbuds, chargers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-10 pl-4 pr-12 rounded-full bg-secondary border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button type="submit" className="absolute right-1 top-1 h-8 w-8 flex items-center justify-center rounded-full gradient-bg text-white hover:opacity-90 transition-opacity">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* WhatsApp Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.open('https://wa.me/923156305000', '_blank')}
                className="text-green-500 hover:text-green-400 gap-1.5"
                title="Contact us on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">WhatsApp</span>
              </Button>

              {user && (
                <>
                  <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground gap-1.5">
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="rounded-full h-9 px-4 text-xs">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </>
              )}

              {user && !isAdmin && (
                <Button variant="ghost" size="sm" className="relative text-muted-foreground hover:text-foreground gap-1.5" onClick={() => navigate('/cart')}>
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">Cart</span>
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] gradient-bg text-white border-0">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              )}

              {isAdmin && (
                <Button variant="ghost" size="sm" className="text-primary gap-1.5" onClick={() => navigate('/admin')}>
                  <Shield className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">Admin</span>
                </Button>
              )}

              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="border-t border-border bg-card">
          <div className="container mx-auto px-4">
            <div className="hidden md:flex items-center justify-between h-11">
              <nav className="flex items-center gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      location.pathname === link.href
                        ? 'gradient-text bg-primary/5'
                        : 'text-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">03-111-577-866</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border overflow-hidden bg-card"
            >
              <div className="container mx-auto px-4 py-3">
                <form onSubmit={handleSearch} className="mb-3">
                  <div className="relative">
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="h-10 pl-4 pr-10 rounded-full bg-secondary border-border"
                    />
                    <button type="submit" className="absolute right-1 top-1 h-8 w-8 flex items-center justify-center rounded-full gradient-bg text-white">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </form>
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === link.href
                        ? 'gradient-text bg-primary/5'
                        : 'text-foreground hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
