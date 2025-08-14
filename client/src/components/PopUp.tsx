import { motion, AnimatePresence } from 'framer-motion';
import { scaleIn } from '../utils/animations';

interface PopUpProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export const PopUp = ({ isOpen, onClose, title, message, type = 'info' }: PopUpProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-green-400';
      case 'error':
        return 'fas fa-exclamation-circle text-red-400';
      default:
        return 'fas fa-info-circle text-cosmic-blue';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-effect rounded-2xl max-w-md w-full p-6"
            {...scaleIn}
            onClick={(e) => e.stopPropagation()}
            data-testid={`popup-${type}`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <i className={`${getIcon()} text-2xl`}></i>
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <p className="text-cosmic-gray mb-6">{message}</p>
            <motion.button
              onClick={onClose}
              className="w-full py-2 bg-cosmic-purple rounded-lg hover:bg-cosmic-purple-vivid transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-close-popup"
            >
              OK
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};