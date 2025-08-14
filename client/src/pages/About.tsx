import { motion } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, cosmicRotate } from '../utils/animations';

const skills = [
  { name: 'React & TypeScript', percentage: 95, category: 'Frontend' },
  { name: 'Node.js & Python', percentage: 90, category: 'Backend' },
  { name: 'Three.js & WebGL', percentage: 85, category: '3D Graphics' },
];

export const About = () => {
  return (
    <section className="py-20 pt-32">
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-5xl font-bold text-center mb-16 text-glow"
          {...fadeInUp}
        >
          About <span className="text-cosmic-purple">Me</span>
        </motion.h2>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative"
            {...fadeInLeft}
          >
            {/* Cosmic avatar with orbiting particles */}
            <div className="relative w-80 h-80 mx-auto">
              {/* Avatar placeholder with cosmic glow */}
              <motion.div
                className="w-full h-full rounded-full bg-gradient-to-br from-cosmic-purple to-cosmic-purple-vivid flex items-center justify-center text-8xl"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(107, 76, 255, 0.5)",
                    "0 0 30px rgba(155, 48, 255, 0.8)",
                    "0 0 20px rgba(107, 76, 255, 0.5)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <i className="fas fa-user-astronaut text-white"></i>
              </motion.div>
              
              {/* Orbiting particles */}
              <motion.div 
                className="absolute inset-0"
                {...cosmicRotate}
              >
                <div className="absolute top-0 left-1/2 w-4 h-4 bg-cosmic-blue rounded-full transform -translate-x-1/2 -translate-y-2"></div>
                <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-cosmic-purple-vivid rounded-full transform -translate-x-1/2 translate-y-2"></div>
                <div className="absolute left-0 top-1/2 w-4 h-4 bg-cosmic-blue rounded-full transform -translate-x-2 -translate-y-1/2"></div>
                <div className="absolute right-0 top-1/2 w-4 h-4 bg-cosmic-purple-vivid rounded-full transform translate-x-2 -translate-y-1/2"></div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            className="space-y-6"
            {...fadeInRight}
          >
            <h3 className="text-3xl font-bold text-cosmic-blue">Full-Stack Cosmic Engineer</h3>
            <p className="text-lg text-cosmic-gray leading-relaxed">
              Passionate developer with 5+ years of experience creating immersive digital experiences. 
              Specialized in React, TypeScript, and cutting-edge web technologies that push the boundaries 
              of what's possible on the web.
            </p>
            
            {/* Skills Timeline */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-cosmic-purple">Core Technologies</h4>
              
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className="glass-effect p-4 rounded-lg hover:bg-opacity-20 transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`skill-${skill.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{skill.name}</span>
                    <span className="text-cosmic-blue">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-cosmic-black bg-opacity-50 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
