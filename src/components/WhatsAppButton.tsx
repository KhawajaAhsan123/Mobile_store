import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <Button
      onClick={() => window.open('https://wa.me/923156305000', '_blank')}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white p-4 transition-all duration-300 hover:scale-110 group"
      title="Contact us on WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline ml-2">WhatsApp</span>
    </Button>
  );
};

export default WhatsAppButton;
