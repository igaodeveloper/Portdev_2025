import { motion } from 'framer-motion';
import { floatAnimation } from '../utils/animations';

export const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const message = "Hello! I'm interested in discussing a project with you.";
    const phoneNumber = "5511982928508"; // Replace with actual phone number
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
        className="w-16 h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Fale Conosco no WhatsApp"
        data-testid="button-whatsapp"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16C0 19.16 0.95 22.103 2.6 24.6L0.9 32L8.55 30.3C10.9 31.8 13.85 32.7 16.9 32.7C24.737 32.7 31 25.837 31 18C31 8.063 24.737 0 16 0ZM24.8 23.1C24.8 23.1 23.25 25.3 22.4 25.3C21.55 25.3 17.4 23.1 16.9 22.7C16.05 22.3 13.2 21.5 12.4 19.7C11.6 17.9 12.4 16.5 12.8 15.6C13.2 14.7 14.5 14.3 14.85 14.3C15.2 14.3 15.55 14.3 15.75 14.3C16.1 14.3 16.6 14.3 16.9 15.6C17.2 16.9 18.5 20.8 18.8 21.1C19.1 21.4 19.4 21.4 19.7 21.1C20 20.8 20.6 20.1 21.1 19.5C21.6 18.9 22.1 18.7 22.4 18.7C22.7 18.7 23.15 18.8 23.5 19.2C23.85 19.6 24.8 21.1 24.8 23.1Z" fill="currentColor"/>
          <path d="M13.1 11.3C12.9 10.7 12.6 10.2 12.3 10C12 9.8 11.6 9.8 11.3 9.9C10.7 10 9.5 10.7 9.5 12.2C9.5 13.7 10.9 15.1 11.1 15.3C11.3 15.5 13.1 18.5 15.7 19.5C18.3 20.5 18.6 20.1 19 20.1C19.4 20.1 20.4 19.6 20.6 19.1C20.8 18.6 20.8 18.1 20.7 18C20.6 17.9 20.4 17.8 20.2 17.7C20 17.6 18.8 17 18.6 16.9C18.4 16.8 18.3 16.8 18.1 17C17.9 17.2 17.3 17.7 17.2 17.8C17.1 17.9 17 17.9 16.9 17.9C16.8 17.9 16.3 17.7 15.6 17.1C15.1 16.6 14.8 16 14.6 15.8C14.4 15.6 14.6 15.5 14.7 15.4C14.8 15.3 15 15.1 15.1 15C15.2 14.9 15.2 14.8 15.3 14.7C15.4 14.6 15.3 14.5 15.3 14.4C15.3 14.3 15.8 12.6 13.1 11.3Z" fill="white"/>
        </svg>
      </motion.button>
    </motion.div>
  );
};
