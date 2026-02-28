import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '', city: '', notes: '' });
  const [placing, setPlacing] = useState(false);

  const handleCheckout = async () => {
    if (!user) return;
    if (isAdmin) {
      toast({ title: 'Admin cannot place orders', description: 'Please use a customer account to place orders.', variant: 'destructive' });
      return;
    }
    if (!orderForm.name || !orderForm.phone || !orderForm.address || !orderForm.city) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    setPlacing(true);
    const { error } = await supabase.from('orders').insert({
      user_id: user.id,
      total,
      items: items.map(i => ({
        id: i.id, name: i.name, price: i.price, quantity: i.quantity,
        customer_name: orderForm.name,
        phone: orderForm.phone,
        address: orderForm.address,
        city: orderForm.city,
        notes: orderForm.notes,
        payment_method: 'COD',
      })),
    });
    setPlacing(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      clearCart();
      setOrderForm({ name: '', phone: '', address: '', city: '', notes: '' });
      toast({ title: 'Order placed successfully! 🎉', description: 'You will receive your order via Cash on Delivery.' });
    }
  };

  if (items.length === 0) {
    return (
      <main className="page-background py-6">
        <div className="container mx-auto px-4 text-center py-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <ShoppingBag className="w-20 h-20 text-muted-foreground/20 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2 text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
            <Button asChild className="bg-primary text-primary-foreground rounded-full">
              <Link to="/products">Browse Products</Link>
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-background py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          <span className="hover:text-primary cursor-pointer">Home</span>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Cart</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button asChild variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
            <Link to="/products"><ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping</Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground mb-6">Shopping <span className="text-primary">Cart</span></h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-3 space-y-3">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="border border-border">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate text-sm">{item.name}</h3>
                      <p className="text-sm text-primary font-semibold">₨ {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" className="w-8 h-8 border-border" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button size="icon" variant="outline" className="w-8 h-8 border-border" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="font-bold w-24 text-right hidden sm:block text-foreground">₨ {(item.price * item.quantity).toLocaleString()}</p>
                    <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Form & Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Delivery Details</h3>
                </div>
                <div className="space-y-3">
                  <div><Label className="text-xs text-muted-foreground">Full Name *</Label><Input value={orderForm.name} onChange={e => setOrderForm({ ...orderForm, name: e.target.value })} placeholder="Your full name" className="bg-secondary border-border mt-1 h-9" /></div>
                  <div><Label className="text-xs text-muted-foreground">Phone *</Label><Input value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} placeholder="+92 3XX XXXXXXX" className="bg-secondary border-border mt-1 h-9" /></div>
                  <div><Label className="text-xs text-muted-foreground">Address *</Label><Input value={orderForm.address} onChange={e => setOrderForm({ ...orderForm, address: e.target.value })} placeholder="Complete address" className="bg-secondary border-border mt-1 h-9" /></div>
                  <div><Label className="text-xs text-muted-foreground">City *</Label><Input value={orderForm.city} onChange={e => setOrderForm({ ...orderForm, city: e.target.value })} placeholder="City name" className="bg-secondary border-border mt-1 h-9" /></div>
                  <div><Label className="text-xs text-muted-foreground">Notes</Label><Textarea value={orderForm.notes} onChange={e => setOrderForm({ ...orderForm, notes: e.target.value })} placeholder="Any special instructions" rows={2} className="bg-secondary border-border mt-1" /></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Payment Method</h3>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <Truck className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">Cash on Delivery (COD)</p>
                    <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₨ {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className="text-primary font-medium">FREE</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">₨ {total.toLocaleString()}</span>
                  </div>
                </div>

                {isAdmin ? (
                  <p className="text-center text-sm text-destructive mt-4">Admins cannot place orders</p>
                ) : (
                  <Button
                    className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={placing}
                  >
                    {placing ? 'Placing Order...' : 'Place Order (COD)'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
