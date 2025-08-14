import { motion } from 'framer-motion';
import { IDE } from '../components/IDE';
import { fadeInUp } from '../utils/animations';

export const IDEPage = () => {
  return (
    <section className="py-20 pt-32">
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-5xl font-bold text-center mb-16 text-glow"
          {...fadeInUp}
        >
          Cosmic <span className="text-cosmic-purple">IDE</span>
        </motion.h2>
        
        <motion.p
          className="text-xl text-cosmic-gray text-center mb-12 max-w-3xl mx-auto"
          {...fadeInUp}
          transition={{ delay: 0.2 }}
        >
          Experience the future of coding with our fully-featured web-based IDE. 
          Complete with syntax highlighting, live preview, and an integrated terminal.
        </motion.p>

        <IDE />
      </div>
    </section>
  );
};
