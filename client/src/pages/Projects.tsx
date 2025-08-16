import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { Project } from '../types';
import { fadeInUp, staggerContainer } from '../utils/animations';

const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Cósmico',
    description: 'Plataforma avançada de e-commerce com estoque em tempo real, recomendações de IA e pagamentos com criptomoedas.',
    detailedDescription: 'Solução abrangente de e-commerce construída com React, Node.js e MongoDB. Inclui gerenciamento de estoque em tempo real, recomendações de produtos com IA, processamento seguro de pagamentos com Stripe e painel de análises avançadas. A plataforma processa mais de 10.000 transações diárias e inclui recursos como lista de desejos, suporte a múltiplas moedas e campanhas de marketing por e-mail automatizadas.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    category: 'Full-Stack',
    githubUrl: 'https://github.com/example/ecommerce',
    liveUrl: 'https://cosmic-ecommerce.com',
  },
  {
    id: '2',
    title: 'Painel de Análise de IA',
    description: 'Painel de análise em tempo real com insights de aprendizado de máquina e capacidades de modelagem preditiva.',
    detailedDescription: 'Plataforma avançada de análise alimentada por algoritmos de aprendizado de máquina para insights preditivos. Construída com Python, TensorFlow e React. Oferece processamento de dados em tempo real, componentes personalizados de visualização, geração automática de relatórios e integração com várias fontes de dados, incluindo Google Analytics, APIs de mídias sociais e bancos de dados personalizados.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['Python', 'TensorFlow', 'React', 'D3.js'],
    category: 'AI/ML',
    githubUrl: 'https://github.com/example/ai-dashboard',
    liveUrl: 'https://ai-analytics.com',
  },
  {
    id: '3',
    title: 'Explorador Cósmico 3D',
    description: 'Jogo imersivo de exploração espacial em 3D com física realista e geração procedural.',
    detailedDescription: 'Jogo imersivo de exploração espacial em 3D construído com Three.js e WebGL. Inclui geração procedural de planetas, simulação de física realista, recursos multijogador e suporte a realidade virtual. O jogo possui mais de 100 sistemas estelares únicos, naves espaciais personalizáveis, sistemas de comércio e geração dinâmica de missões.',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    technologies: ['Three.js', 'WebGL', 'TypeScript', 'Cannon.js'],
    category: '3D Game',
    githubUrl: 'https://github.com/example/cosmic-explorer',
    liveUrl: 'https://cosmic-explorer.com',
  },
  {
    id: '4',
    title: 'Plataforma de Trading DeFi',
    description: 'Plataforma de finanças descentralizadas com yield farming, staking e recursos avançados de negociação.',
    detailedDescription: 'Plataforma de finanças descentralizadas construída na blockchain Ethereum. Inclui yield farming, mineração de liquidez, criação de mercado automatizada e funcionalidade de ponte entre cadeias. Implementada com contratos inteligentes em Solidity, integração Web3.js e frontend em React. Suporta várias criptomoedas e inclui ferramentas avançadas de negociação.',
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
