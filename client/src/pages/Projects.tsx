import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { Project } from '../types';
import { fadeInUp, staggerContainer } from '../utils/animations';

const projects: Project[] = [
  {
    id: '1',
    title: 'Cosmic E-Commerce',
    description: 'Advanced e-commerce platform with real-time inventory, AI recommendations, and cryptocurrency payments.',
    detailedDescription: 'A comprehensive e-commerce solution built with React, Node.js, and MongoDB. Features include real-time inventory management, AI-powered product recommendations, secure payment processing with Stripe, and advanced analytics dashboard. The platform handles over 10,000 transactions daily and includes features like wishlist management, multi-currency support, and automated email marketing campaigns.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    category: 'Full-Stack',
    githubUrl: 'https://github.com/example/ecommerce',
    liveUrl: 'https://cosmic-ecommerce.com',
  },
  {
    id: '2',
    title: 'AI Analytics Dashboard',
    description: 'Real-time analytics dashboard with machine learning insights and predictive modeling capabilities.',
    detailedDescription: 'Advanced analytics platform powered by machine learning algorithms for predictive insights. Built with Python, TensorFlow, and React. Features real-time data processing, custom visualization components, automated report generation, and integration with multiple data sources including Google Analytics, social media APIs, and custom databases.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['Python', 'TensorFlow', 'React', 'D3.js'],
    category: 'AI/ML',
    githubUrl: 'https://github.com/example/ai-dashboard',
    liveUrl: 'https://ai-analytics.com',
  },
  {
    id: '3',
    title: 'Cosmic Explorer 3D',
    description: 'Immersive 3D space exploration game with realistic physics and procedural generation.',
    detailedDescription: 'Immersive 3D space exploration game built with Three.js and WebGL. Features procedural planet generation, realistic physics simulation, multiplayer capabilities, and VR support. The game includes over 100 unique star systems, customizable spacecraft, trading systems, and dynamic mission generation.',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['Three.js', 'WebGL', 'TypeScript', 'Cannon.js'],
    category: '3D Game',
    githubUrl: 'https://github.com/example/cosmic-explorer',
    liveUrl: 'https://cosmic-explorer.com',
  },
  {
    id: '4',
    title: 'DeFi Trading Platform',
    description: 'Decentralized finance platform with yield farming, staking, and advanced trading features.',
    detailedDescription: 'Decentralized finance platform built on Ethereum blockchain. Features yield farming, liquidity mining, automated market making, and cross-chain bridge functionality. Implemented with Solidity smart contracts, Web3.js integration, and React frontend. Supports multiple cryptocurrencies and includes advanced trading tools.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['Solidity', 'Web3.js', 'React', 'MetaMask'],
    category: 'Blockchain',
    githubUrl: 'https://github.com/example/defi-platform',
    liveUrl: 'https://defi-trading.com',
  },
  {
    id: '5',
    title: 'Smart Home Hub',
    description: 'Comprehensive IoT control system with AI automation and real-time device monitoring.',
    detailedDescription: 'Comprehensive IoT control system for smart homes. Built with React Native, Node.js, and MQTT protocol. Features include voice control integration, AI-powered automation rules, energy consumption monitoring, security system integration, and remote access capabilities. Supports over 200 different IoT devices.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['React Native', 'MQTT', 'Node.js', 'Arduino'],
    category: 'IoT',
    githubUrl: 'https://github.com/example/smart-home',
    liveUrl: 'https://smart-home-hub.com',
  },
];

export const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <section className="py-20 pt-32">
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-5xl font-bold text-center mb-16 text-glow"
          {...fadeInUp}
        >
          Featured <span className="text-cosmic-purple">Projects</span>
        </motion.h2>
        
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          {...staggerContainer}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenModal={handleOpenModal}
            />
          ))}
        </motion.div>

        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};
