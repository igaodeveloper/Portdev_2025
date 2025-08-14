import { motion } from 'framer-motion';
import { particleFloat, cosmicRotate } from '../utils/animations';

export const CosmicBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Cosmic Stars Background */}
      <motion.div 
        className="cosmic-stars"
        {...cosmicRotate}
      />
      
      {/* Animated Particles */}
      {Array.from({ length: 9 }, (_, i) => (
        <motion.div
          key={i}
          className="cosmic-particle"
          style={{
            left: `${10 + i * 10}%`,
            animationDelay: `${i * 2}s`
          }}
          {...particleFloat}
        />
      ))}
    </div>
  );
};
