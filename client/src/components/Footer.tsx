import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';

export const Footer = () => {
  const socialLinks = [
    { icon: 'fab fa-github', url: 'https://github.com', label: 'GitHub' },
    { icon: 'fab fa-linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: 'fab fa-twitter', url: 'https://twitter.com', label: 'Twitter' },
    { icon: 'fab fa-youtube', url: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <motion.footer
      className="py-12 border-t border-cosmic-purple border-opacity-30"
      {...fadeInUp}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-bold text-glow mb-4 md:mb-0">
            <span className="text-cosmic-purple">Cosmic</span>
            <span className="text-cosmic-blue">Dev</span>
          </div>
          
          <div className="flex space-x-6">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cosmic-gray hover:text-cosmic-purple transition-colors duration-300"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                data-testid={`link-social-${link.label.toLowerCase()}`}
              >
                <i className={`${link.icon} text-2xl`}></i>
              </motion.a>
            ))}
          </div>
          
          <div className="text-cosmic-gray text-sm mt-4 md:mt-0">
            © 2024 CosmicDev. All rights reserved.
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
