import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { scaleIn } from '../utils/animations';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-effect rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            {...scaleIn}
            onClick={(e) => e.stopPropagation()}
            data-testid={`modal-project-${project.id}`}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-3xl font-bold text-cosmic-blue">{project.title}</h3>
                <button
                  onClick={onClose}
                  className="text-cosmic-gray hover:text-white text-2xl"
                  data-testid="button-close-modal"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-cosmic-gray text-lg">{project.detailedDescription}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cosmic-purple bg-opacity-30 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-4">
                {project.githubUrl && (
                  <motion.button
                    onClick={() => window.open(project.githubUrl, '_blank')}
                    className="px-6 py-3 bg-cosmic-purple rounded-lg hover:bg-cosmic-purple-vivid transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`button-github-${project.id}`}
                  >
                    <i className="fab fa-github mr-2"></i>View Code
                  </motion.button>
                )}
                {project.liveUrl && (
                  <motion.button
                    onClick={() => window.open(project.liveUrl, '_blank')}
                    className="px-6 py-3 bg-cosmic-blue rounded-lg hover:bg-opacity-80 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`button-demo-${project.id}`}
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>Live Demo
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
