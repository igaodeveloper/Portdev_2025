import { motion } from 'framer-motion';
import { useIDEStore } from '../hooks/useIDEStore';
import { fadeInUp } from '../utils/animations';

export const Editor = () => {
  const { files, activeFileId, updateFileContent } = useIDEStore();
  const activeFile = files.find(file => file.id === activeFileId);

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-cosmic-gray">No file selected</p>
      </div>
    );
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFileContent(activeFile.id, e.target.value);
  };

  // Syntax highlighting for display (simplified)
  const renderCodeWithSyntax = (content: string, language: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => (
      <div key={index} className="flex">
        <span className="text-cosmic-gray mr-4 select-none w-8 text-right">
          {index + 1}
        </span>
        <span className="flex-1">{line || ' '}</span>
      </div>
    ));
  };

  return (
    <motion.div
      className="flex-1 flex flex-col"
      {...fadeInUp}
    >
      {/* Tab Bar */}
      <div className="flex border-b border-cosmic-purple border-opacity-30">
        <div className="px-4 py-2 bg-cosmic-purple bg-opacity-20 border-r border-cosmic-purple border-opacity-30 flex items-center space-x-2">
          <i className={`${
            activeFile.name.endsWith('.tsx') ? 'fab fa-react text-cosmic-purple' :
            activeFile.name.endsWith('.js') ? 'fab fa-js-square text-cosmic-blue' :
            activeFile.name.endsWith('.css') ? 'fab fa-css3-alt text-cosmic-purple-vivid' :
            'fas fa-file text-cosmic-gray'
          }`}></i>
          <span className="text-sm">{activeFile.name}</span>
          <button className="text-cosmic-gray hover:text-white">
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>
      </div>
      
      {/* Code Editor */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 p-4 bg-cosmic-black bg-opacity-30 overflow-auto">
          <div className="text-sm font-mono leading-relaxed relative">
            {/* Syntax highlighted display */}
            <div className="pointer-events-none select-none text-white">
              {renderCodeWithSyntax(activeFile.content, activeFile.language)}
            </div>
            {/* Invisible textarea for editing */}
            <textarea
              value={activeFile.content}
              onChange={handleContentChange}
              className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white resize-none outline-none font-mono text-sm leading-relaxed p-0 border-none"
              style={{ 
                lineHeight: '1.5rem',
                paddingLeft: '3rem'
              }}
              spellCheck={false}
              data-testid={`editor-textarea-${activeFile.id}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
