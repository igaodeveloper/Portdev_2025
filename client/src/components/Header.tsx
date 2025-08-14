import { Link, useLocation } from 'wouter';
import { DarkModeToggle } from './DarkModeToggle';
import { ResumeButton } from './ResumeButton';
import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';

export const Header = () => {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/videos', label: 'Videos' },
    { href: '/ide', label: 'IDE' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <motion.header 
      className="fixed top-0 w-full z-50 glass-effect"
      {...fadeInUp}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-glow cursor-pointer">
            <span className="text-cosmic-purple">Cosmic</span>
            <span className="text-cosmic-blue">Dev</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span 
                  className={`nav-link hover:text-cosmic-purple transition-colors duration-300 cursor-pointer ${
                    location === item.href ? 'text-cosmic-purple' : ''
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <ResumeButton />
          </div>
        </div>
      </nav>
    </motion.header>
  );
};
