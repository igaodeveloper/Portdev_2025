import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';

export const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="p-2 rounded-full glass-effect hover:bg-cosmic-purple hover:bg-opacity-20 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      data-testid="button-dark-mode-toggle"
    >
      <motion.i
        className={`${isDarkMode ? 'fas fa-sun' : 'fas fa-moon'} text-cosmic-blue`}
        animate={{ rotate: isDarkMode ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
};