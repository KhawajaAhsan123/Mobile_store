import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Package, ShoppingCart, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const categories = ['mobiles', 'handsfree', 'chargers', 'accessories', 'other'];

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string;
  stock: string;
  featured: boolean;
}

const emptyForm: ProductForm = { name: '', description: '', price: '', category: 'mobiles', image_url: '', stock: '', featured: false };

const Admin = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState<'products' | 'orders'>('products');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
      toast({ title: 'Access denied', description: 'Admin access required', variant: 'destructive' });
    }
  }, [isAdmin, authLoading]);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchOrders();
    }
  }, [isAdmin]);

  const handleSave = async () => {
    const payload = {
      name: form.name,
      description: form.description || null,
      price: Number(form.price),
      category: form.category,
      image_url: form.image_url || null,
      stock: Number(form.stock) || 0,
      featured: form.featured,
    };

    if (editId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editId);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Product updated!' });
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Product added!' });
    }
    setDialogOpen(false);
    setForm(emptyForm);
    setEditId(null);
    fetchProducts();
  };

  const handleEdit = (p: any) => {
    setForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      category: p.category,
      image_url: p.image_url || '',
      stock: String(p.stock),
      featured: p.featured,
    });
    setEditId(p.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Product deleted!' });
    fetchProducts();
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: `Order marked as ${newStatus}!` });
    fetchOrders();
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!isAdmin) return null;

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  return (
    <main className="page-background py-6">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-sm">Manage your products and orders</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: 'Products', value: products.length, color: 'from-blue-500 to-blue-600' },
            { icon: ShoppingCart, label: 'Total Orders', value: orders.length, color: 'from-purple-500 to-purple-600' },
            { icon: Clock, label: 'Pending', value: pendingCount, color: 'from-amber-500 to-orange-500' },
            { icon: Users, label: 'Revenue', value: `₨ ${orders.reduce((s, o) => s + Number(o.total), 0).toLocaleString()}`, color: 'from-emerald-500 to-green-500' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border border-border overflow-hidden">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === 'products' ? 'default' : 'outline'}
            onClick={() => setTab('products')}
            className={tab === 'products' ? 'gradient-bg text-white' : 'border-border/50'}
          >
            <Package className="w-4 h-4 mr-2" /> Products
          </Button>
          <Button
            variant={tab === 'orders' ? 'default' : 'outline'}
            onClick={() => setTab('orders')}
            className={tab === 'orders' ? 'gradient-bg text-white' : 'border-border/50'}
          >
            <ShoppingCart className="w-4 h-4 mr-2" /> Orders
            {pendingCount > 0 && (
              <span className="ml-2 w-5 h-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center animate-pulse">
                {pendingCount}
              </span>
            )}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="flex justify-end mb-4">
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setForm(emptyForm); setEditId(null); } }}>
                  <DialogTrigger asChild>
                    <Button className="gradient-bg text-white hover:opacity-90 glow-primary rounded-xl">
                      <Plus className="w-4 h-4 mr-2" /> Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border border-border max-w-lg rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>{editId ? 'Edit' : 'Add'} Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-secondary border-border rounded-xl" /></div>
                      <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-secondary border-border rounded-xl" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label>Price (₨)</Label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="bg-secondary border-border rounded-xl" /></div>
                        <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="bg-secondary border-border rounded-xl" /></div>
                      </div>
                      <div><Label>Category</Label>
                        <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                          <SelectTrigger className="bg-secondary border-border rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="bg-secondary border-border rounded-xl" /></div>
                      <div className="flex items-center gap-2">
                        <Switch checked={form.featured} onCheckedChange={v => setForm({ ...form, featured: v })} />
                        <Label>Featured Product</Label>
                      </div>
                      <Button className="w-full gradient-bg text-white hover:opacity-90 rounded-xl" onClick={handleSave}>
                        {editId ? 'Update' : 'Add'} Product
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="border border-border overflow-hidden rounded-2xl">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border bg-secondary/50">
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(p => (
                      <TableRow key={p.id} className="border-border hover:bg-secondary/30 transition-colors">
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="capitalize">{p.category}</TableCell>
                        <TableCell>₨ {p.price.toLocaleString()}</TableCell>
                        <TableCell>{p.stock}</TableCell>
                        <TableCell>{p.featured ? '⭐' : '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(p)} className="hover:text-primary"><Pencil className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {products.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No products yet. Add your first product!</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          )}

          {tab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {pendingCount > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-2xl gradient-bg text-white flex items-center gap-3 glow-primary">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">🔔 New Orders!</p>
                    <p className="text-sm text-white/80">
                      You have <span className="font-bold">{pendingCount}</span> pending order(s) — Someone is interested in your products!
                    </p>
                  </div>
                </motion.div>
              )}
              <Card className="border border-border overflow-hidden rounded-2xl">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border bg-secondary/50">
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(o => {
                      const orderItems = Array.isArray(o.items) ? o.items : [];
                      const firstItem = orderItems[0] as any;
                      return (
                        <TableRow key={o.id} className="border-border hover:bg-secondary/30 transition-colors">
                          <TableCell className="font-mono text-xs">{o.id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{firstItem?.customer_name || 'N/A'}</p>
                              <p className="text-xs text-muted-foreground">{firstItem?.phone || ''}</p>
                              <p className="text-xs text-muted-foreground">{firstItem?.city || ''}</p>
                            </div>
                          </TableCell>
                          <TableCell>{orderItems.length} items</TableCell>
                          <TableCell className="font-semibold">₨ {Number(o.total).toLocaleString()}</TableCell>
                          <TableCell>
                            <span className="px-2.5 py-1 rounded-full text-xs gradient-bg text-white font-medium">
                              {firstItem?.payment_method || 'COD'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                              o.status === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : o.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {o.status === 'pending' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                              {o.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            {o.status === 'pending' ? (
                              <Button
                                size="sm"
                                className="gradient-bg text-white hover:opacity-90 rounded-full text-xs px-4"
                                onClick={() => handleUpdateOrderStatus(o.id, 'completed')}
                              >
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Complete
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full text-xs px-4 border-border"
                                onClick={() => handleUpdateOrderStatus(o.id, 'pending')}
                              >
                                <Clock className="w-3.5 h-3.5 mr-1" /> Reopen
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {orders.length === 0 && (
                      <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No orders yet</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Admin;
