import { motion } from 'framer-motion';
import { useIDEStore } from '../hooks/useIDEStore';
import { fadeInLeft } from '../utils/animations';

export const Sidebar = () => {
  const { files, activeFileId, setActiveFile, createFile, sidebarOpen } = useIDEStore();

  const handleCreateFile = () => {
    const name = prompt('File name:');
    if (name) {
      const extension = name.split('.').pop() || '';
      const languageMap: Record<string, string> = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'css': 'css',
        'html': 'html',
        'py': 'python',
        'json': 'json',
      };
      const language = languageMap[extension] || 'text';
      createFile(name, language);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop();
    const iconMap: Record<string, string> = {
      'tsx': 'fab fa-react text-cosmic-purple',
      'ts': 'fab fa-js-square text-cosmic-blue',
      'js': 'fab fa-js-square text-yellow-400',
      'jsx': 'fab fa-react text-cosmic-blue',
      'css': 'fab fa-css3-alt text-cosmic-purple-vivid',
      'html': 'fab fa-html5 text-red-400',
      'py': 'fab fa-python text-green-400',
      'json': 'fas fa-file-code text-cosmic-gray',
    };
    return iconMap[extension || ''] || 'fas fa-file text-cosmic-gray';
  };

  if (!sidebarOpen) return null;

  return (
    <motion.div
      className="w-64 border-r border-cosmic-purple border-opacity-30 p-4 bg-cosmic-black bg-opacity-20"
      {...fadeInLeft}
      data-testid="sidebar-file-explorer"
    >
      <h3 className="text-lg font-bold mb-4 text-cosmic-blue">File Explorer</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2 p-2 hover:bg-cosmic-purple hover:bg-opacity-20 rounded cursor-pointer">
          <i className="fas fa-folder text-cosmic-blue"></i>
          <span>src</span>
        </div>
        <div className="ml-4 space-y-1">
          {files.map((file) => (
            <div
              key={file.id}
              className={`flex items-center space-x-2 p-2 hover:bg-cosmic-purple hover:bg-opacity-20 rounded cursor-pointer ${
                file.id === activeFileId ? 'bg-cosmic-purple bg-opacity-30' : ''
              }`}
              onClick={() => setActiveFile(file.id)}
              data-testid={`file-item-${file.id}`}
            >
              <i className={getFileIcon(file.name)}></i>
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8">
        <h4 className="text-sm font-bold mb-2 text-cosmic-gray">Quick Actions</h4>
        <motion.button
          onClick={handleCreateFile}
          className="w-full p-2 bg-cosmic-purple bg-opacity-20 rounded hover:bg-opacity-30 transition-all duration-300 text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          data-testid="button-new-file"
        >
          <i className="fas fa-plus mr-2"></i>New File
        </motion.button>
      </div>
    </motion.div>
  );
};
