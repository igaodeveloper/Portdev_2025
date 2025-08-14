import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { scaleIn } from '../utils/animations';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Dialog = ({ isOpen, onClose, title, children }: DialogProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-effect rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            {...scaleIn}
            onClick={(e) => e.stopPropagation()}
            data-testid="dialog"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-cosmic-blue">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-cosmic-gray hover:text-white text-xl"
                  data-testid="button-close-dialog"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
