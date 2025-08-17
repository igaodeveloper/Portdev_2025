import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { Project } from '../types';
import { fadeInUp, staggerContainer } from '../utils/animations';

const projects: Project[] = [
  {
    id: '1',
    title: 'Portfolio Excellence',
    description: 'Portfólio profissional moderno',
    detailedDescription: 'Portfólio desenvolvido com React, TypeScript e Tailwind CSS',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    category: 'Web',
    githubUrl: 'https://github.com/igaodeveloper/-Portfolio-Excellence',
    liveUrl: 'https://portfolio-excellence.vercel.app',
  },
  {
    id: '2',
    title: 'Blog Pessoal',
    description: 'Blog com Next.js',
    detailedDescription: 'Blog desenvolvido com Next.js e TypeScript',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['Next.js', 'TypeScript'],
    category: 'Web',
    githubUrl: 'https://github.com/igaodeveloper/blog',
    liveUrl: 'https://replit.com/@marildinha44197/BlogTechNexus',
  },
  {
    id: '3',
    title: 'BoomLand.io Bot',
    description: 'Bot para automação de jogo',
    detailedDescription: 'Automação para o jogo BoomLand.io',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['Python', 'Selenium'],
    category: 'Automation',
    githubUrl: 'https://github.com/igaodeveloper/BoomLand-io-Bot-Crypto-Game-Auto-Farm-Clicker-Cheat-Api-Hack',
    liveUrl: undefined,
  },
  {
    id: '4',
    title: 'Clique - Rede Social',
    description: 'Plataforma de rede social',
    detailedDescription: 'Rede social desenvolvida com React e Node.js',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['React', 'Node.js', 'MongoDB'],
    category: 'Web',
    githubUrl: 'https://github.com/igaodeveloper/Clique',
    liveUrl: 'https://replit.com/@igtechh2025/ConnectNetworks',
  },
  {
    id: '5',
    title: 'Sistema de Farmácia',
    description: 'Sistema de gestão para farmácias',
    detailedDescription: 'Sistema completo para gestão de farmácias',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['TypeScript', 'React', 'Node.js'],
    category: 'Enterprise',
    githubUrl: 'https://github.com/igaodeveloper/FARMACIA-',
    liveUrl: undefined,
  }
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
