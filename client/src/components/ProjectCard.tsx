import { motion } from 'framer-motion';
import { Project } from '../types';
import { cardHover, fadeInUp } from '../utils/animations';

interface ProjectCardProps {
  project: Project;
  onOpenModal: (project: Project) => void;
}

export const ProjectCard = ({ project, onOpenModal }: ProjectCardProps) => {
  return (
    <motion.div
      className="project-card glass-effect rounded-2xl p-6 hover:bg-opacity-20 transition-all duration-500 cursor-pointer"
      onClick={() => onOpenModal(project)}
      {...fadeInUp}
      {...cardHover}
      data-testid={`card-project-${project.id}`}
    >
      <div className="relative mb-6 overflow-hidden rounded-lg">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-300"
          whileHover={{ scale: 1.1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-cosmic-purple rounded-full text-sm font-semibold">
            {project.category}
          </span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-cosmic-blue">{project.title}</h3>
      <p className="text-cosmic-gray mb-4">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-cosmic-purple bg-opacity-30 rounded text-xs"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div className="flex justify-center">
        {project.githubUrl && (
          <button 
            className="text-cosmic-blue hover:text-cosmic-purple transition-colors duration-300"
            onClick={(e) => {
              e.stopPropagation();
              window.open(project.githubUrl, '_blank');
            }}
            data-testid={`link-github-${project.id}`}
          >
            <i className="fab fa-github mr-2"></i>Code
          </button>
        )}
      </div>
    </motion.div>
  );
};
