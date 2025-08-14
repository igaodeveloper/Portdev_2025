import { motion } from 'framer-motion';
import { useIDEStore } from '../hooks/useIDEStore';
import { fadeInRight } from '../utils/animations';

export const LivePreview = () => {
  const { files, activeFileId } = useIDEStore();
  const activeFile = files.find(file => file.id === activeFileId);

  // Generate preview content based on file content
  const generatePreview = () => {
    if (!activeFile) return null;

    if (activeFile.language === 'html') {
      return (
        <iframe
          srcDoc={activeFile.content}
          className="w-full h-full border-none"
          title="HTML Preview"
        />
      );
    }

    // For React/JS files, show a mock preview
    if (activeFile.name === 'App.tsx' && activeFile.content.includes('count')) {
      return (
        <div className="bg-white rounded-lg p-4 h-full">
          <div className="text-black">
            <h1 className="text-xl font-bold mb-4">Cosmic Counter: 5</h1>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Increment
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg p-4 h-full flex items-center justify-center">
        <div className="text-gray-500">
          <i className="fas fa-code text-4xl mb-4"></i>
          <p>Preview not available for this file type</p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="w-1/3 border-l border-cosmic-purple border-opacity-30 p-4"
      {...fadeInRight}
      data-testid="live-preview"
    >
      <h4 className="text-sm font-bold mb-4 text-cosmic-blue">Live Preview</h4>
      <div className="h-64 overflow-hidden">
        {generatePreview()}
      </div>
    </motion.div>
  );
};
