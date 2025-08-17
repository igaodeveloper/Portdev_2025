import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { fadeInUp, floatAnimation, glitchEffect } from '../utils/animations';
import { ProfileLogo } from '../components/ProfileLogo';

export const Home = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 text-center">
        <motion.div 
          className="flex flex-col items-center justify-center mb-8"
          {...floatAnimation}
        >
          <div className="mb-16">
            <ProfileLogo size={320} />
          </div>
          <motion.h1
            className="text-6xl md:text-8xl font-black mb-6 text-glow"
            {...fadeInUp}
          >
            <motion.span 
              className="inline-block"
              {...glitchEffect}
            >
              DESENVOLVEDOR
            </motion.span>
            <br />
            <span className="text-cosmic-blue">FULLSTACK</span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl mb-8 text-cosmic-gray max-w-3xl mx-auto"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Construindo o futuro do desenvolvimento web com tecnologias de ponta,
            criatividade cósmica e infinitas possibilidades.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <Link href="/projects">
              <motion.a
                className="px-8 py-4 bg-gradient-to-r from-cosmic-purple to-cosmic-purple-vivid rounded-full hover:shadow-xl hover:shadow-cosmic-purple/50 transition-all duration-300 font-bold text-lg cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                data-testid="link-explore-universe"
              >
                Explorar Universo
              </motion.a>
            </Link>
            <Link href="/projects">
              <motion.a
                className="px-8 py-4 border-2 border-cosmic-blue rounded-full hover:bg-cosmic-blue hover:bg-opacity-20 transition-all duration-300 font-bold text-lg cursor-pointer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                data-testid="link-view-projects"
              >
                Ver Projetos
              </motion.a>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
