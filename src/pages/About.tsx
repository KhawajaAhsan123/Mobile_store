import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Shield, Truck, Star, Heart, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const values = [
  { icon: Shield, title: 'Authenticity', desc: 'Every product is 100% original with official warranty.' },
  { icon: Star, title: 'Quality First', desc: 'We handpick only the finest products from trusted brands.' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Nationwide delivery within 2-3 business days.' },
  { icon: Heart, title: 'Customer Care', desc: 'Dedicated support team available 6 days a week.' },
];

const About = () => (
  <main className="page-background py-6">
    <div className="container mx-auto px-4">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6">
        <span className="hover:text-primary cursor-pointer">Home</span>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">About Us</span>
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          About <span className="gradient-text">PAK SMART MOBILE</span>
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          We're on a mission to make premium mobile technology accessible to everyone in Pakistan. Quality, trust, and customer satisfaction drive everything we do.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { num: '500+', label: 'Products' },
          { num: '10,000+', label: 'Happy Customers' },
          { num: '50+', label: 'Brands' },
          { num: '4.9★', label: 'Average Rating' },
        ].map(s => (
            <Card key={s.label} className="border border-border text-center hover:shadow-lg hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <p className="text-2xl font-bold gradient-text">{s.num}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Values */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
      >
        {values.map(v => (
          <motion.div key={v.title} variants={fadeUp}>
            <Card className="border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* About text */}
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-lg p-8 mb-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Our Story</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          PAK SMART MOBILE is your premier destination for mobile phones and accessories in Pakistan. We offer an extensive range of the latest smartphones, earbuds, chargers, and accessories at the best prices.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          With nationwide Cash on Delivery (COD), free shipping, and a commitment to 100% genuine products with warranty, we've established ourselves as a trusted name in online mobile shopping in Pakistan.
        </p>
      </div>

      {/* Contact Info */}
      <div className="max-w-2xl mx-auto space-y-3">
        {[
          { icon: MapPin, title: 'Location', text: 'Lahore, Pakistan — Serving Nationwide' },
          { icon: Phone, title: 'Phone', text: '+92 300 1234567' },
          { icon: Mail, title: 'Email', text: 'info@paksmartmobile.com' },
        ].map(item => (
          <Card key={item.title} className="border border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </main>
);

export default About;
