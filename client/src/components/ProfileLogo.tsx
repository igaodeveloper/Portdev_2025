import { motion } from 'framer-motion';
import logo from '../assets/images/logo.jpg';

interface ProfileLogoProps {
  size?: number;
  className?: string;
}

export const ProfileLogo = ({ size = 160, className = '' }: ProfileLogoProps) => {
  return (
    <motion.div
      className={`rounded-full overflow-hidden border-4 border-cosmic-blue border-opacity-30 ${className}`}
      style={{ width: size, height: size }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
        scale: {
          type: "spring",
          damping: 10,
          stiffness: 100
        }
      }}
    >
      <img 
        src={logo} 
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};
