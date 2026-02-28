import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+92 300 1234567', desc: 'Mon-Sat, 9am-9pm' },
  { icon: Mail, label: 'Email', value: 'info@paksmartmobile.com', desc: 'We reply within 24h' },
  { icon: MapPin, label: 'Location', value: 'Lahore, Pakistan', desc: 'Main Branch' },
  { icon: Clock, label: 'Working Hours', value: '9:00 AM - 9:00 PM', desc: 'Monday to Saturday' },
];

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setForm({ name: '', email: '', phone: '', message: '' });
    toast({ title: 'Message Sent! ✅', description: 'We will get back to you soon.' });
  };

  return (
    <main className="page-background py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <span className="hover:text-primary cursor-pointer">Home</span>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Contact Us</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Have a question or need help? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contactInfo.map((info) => (
            <Card key={info.label} className="border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group">
              <CardContent className="p-5 text-center">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <info.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-bold text-foreground">{info.label}</p>
                <p className="text-sm text-primary font-medium">{info.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{info.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Card className="border border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Send a Message</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name *</Label>
                    <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="mt-1 bg-secondary border-border h-10" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email *</Label>
                    <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="mt-1 bg-secondary border-border h-10" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</Label>
                    <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+92 3XX XXXXXXX" className="mt-1 bg-secondary border-border h-10" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message *</Label>
                    <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" rows={4} className="mt-1 bg-secondary border-border" />
                  </div>
                  <Button type="submit" disabled={sending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold" size="lg">
                    {sending ? 'Sending...' : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Card className="border border-border h-full">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <h2 className="text-lg font-bold text-foreground mb-5">Why Choose <span className="gradient-text">PAK SMART MOBILE</span>?</h2>
                <ul className="space-y-3">
                  {[
                    '100% Original & Genuine Products',
                    'Nationwide Cash on Delivery (COD)',
                    'Easy Returns & Exchanges',
                    'Expert Customer Support',
                    'Best Prices Guaranteed',
                    'Fast Delivery in 2-3 Days',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
