import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIDEStore } from '../hooks/useIDEStore';
import { fadeInUp } from '../utils/animations';

export const Terminal = () => {
  const [currentCommand, setCurrentCommand] = useState('');
  const { terminalHistory, executeCommand, clearTerminal } = useIDEStore();
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const handleCommandSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (currentCommand.trim() === 'clear') {
        clearTerminal();
      } else {
        executeCommand(currentCommand);
      }
      setCurrentCommand('');
    }
  };

  return (
    <motion.div
      className="h-40 border-t border-cosmic-purple border-opacity-30 p-4 bg-cosmic-black bg-opacity-50"
      {...fadeInUp}
      data-testid="terminal"
    >
      <h4 className="text-sm font-bold mb-2 text-cosmic-blue">Terminal</h4>
      <div 
        ref={terminalRef}
        className="font-mono text-sm h-24 overflow-y-auto mb-2"
      >
        {terminalHistory.map((entry, index) => (
          <div key={index}>
            <div className="text-cosmic-blue">$ {entry.command}</div>
            {entry.output && (
              <div className="text-green-400 whitespace-pre-wrap">
                {entry.output}
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-cosmic-blue mr-2">$</span>
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleCommandSubmit}
            className="bg-transparent border-none outline-none text-white flex-1"
            placeholder="Type a command..."
            data-testid="input-terminal-command"
          />
          <span className="bg-cosmic-purple w-2 h-4 ml-1 animate-pulse"></span>
        </div>
      </div>
    </motion.div>
  );
};
