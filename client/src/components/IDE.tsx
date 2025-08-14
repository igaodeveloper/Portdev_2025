import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Editor } from './Editor';
import { Terminal } from './Terminal';
import { LivePreview } from './LivePreview';
import { useIDEStore } from '../hooks/useIDEStore';
import { fadeInUp } from '../utils/animations';

export const IDE = () => {
  const { sidebarOpen, toggleSidebar } = useIDEStore();

  return (
    <motion.div
      className="glass-effect rounded-2xl p-6 h-[700px]"
      {...fadeInUp}
      data-testid="ide-container"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-cosmic-blue">Cosmic IDE</h3>
        <button
          onClick={toggleSidebar}
          className="p-2 bg-cosmic-purple bg-opacity-20 rounded hover:bg-opacity-30 transition-all duration-300"
          data-testid="button-toggle-sidebar"
        >
          <i className={`fas fa-${sidebarOpen ? 'eye-slash' : 'eye'}`}></i>
        </button>
      </div>
      
      <div className="flex h-full border border-cosmic-purple border-opacity-30 rounded-lg overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <Editor />
            <LivePreview />
          </div>
          <Terminal />
        </div>
      </div>
    </motion.div>
  );
};
