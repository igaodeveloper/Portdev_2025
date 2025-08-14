import { motion } from 'framer-motion';
import { PopUp } from './PopUp';
import { useState } from 'react';

export const ResumeButton = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleResumeClick = () => {
    setShowPopup(true);
    // In a real app, you would open the PDF or download it
  };

  return (
    <>
      <motion.button
        onClick={handleResumeClick}
        className="px-6 py-2 bg-gradient-to-r from-cosmic-purple to-cosmic-purple-vivid rounded-full hover:shadow-lg hover:shadow-cosmic-purple/50 transition-all duration-300 font-semibold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-testid="button-resume"
      >
        Resume
      </motion.button>
      
      <PopUp
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Resume Download"
        message="Resume download started! Check your downloads folder."
        type="success"
      />
    </>
  );
};