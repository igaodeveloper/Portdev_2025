import { motion } from 'framer-motion';
import { floatAnimation } from '../utils/animations';

export const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const message = "Hello! I'm interested in discussing a project with you.";
    const phoneNumber = "5511999999999"; // Replace with actual phone number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      {...floatAnimation}
    >
      <motion.button
        onClick={handleWhatsAppClick}
        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl hover:bg-green-600 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Contact via WhatsApp"
        data-testid="button-whatsapp"
      >
        <i className="fab fa-whatsapp"></i>
      </motion.button>
    </motion.div>
  );
};
