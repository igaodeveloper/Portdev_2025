import { create } from 'zustand';
import { IDEFile, TerminalCommand } from '../types';

interface IDEStore {
  files: IDEFile[];
  activeFileId: string | null;
  terminalHistory: TerminalCommand[];
  previewContent: string;
  sidebarOpen: boolean;
  
  // File operations
  createFile: (name: string, language: string) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  setActiveFile: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  
  // Terminal operations
  executeCommand: (command: string) => void;
  clearTerminal: () => void;
  
  // UI operations
  toggleSidebar: () => void;
  updatePreview: (content: string) => void;
}

const defaultFiles: IDEFile[] = [
  {
    id: '1',
    name: 'App.tsx',
    content: `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="cosmic-app">
      <h1>Cosmic Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default App;`,
    language: 'typescript',
    isActive: true,
  },
  {
    id: '2',
    name: 'index.js',
    content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
    language: 'javascript',
    isActive: false,
  },
  {
    id: '3',
    name: 'styles.css',
    content: `.cosmic-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #000000, #1a0033);
  color: white;
  font-family: 'Inter', sans-serif;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(107, 76, 255, 0.5);
}

button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #6B4CFF, #9B30FF);
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(107, 76, 255, 0.3);
}`,
    language: 'css',
    isActive: false,
  },
];

export const useIDEStore = create<IDEStore>((set: any, get: any) => ({
  files: defaultFiles,
  activeFileId: '1',
  terminalHistory: [
    {
      command: 'npm run dev',
      output: '✓ Local: http://localhost:3000\n✓ ready in 245ms',
      timestamp: new Date(),
    },
  ],
  previewContent: '',
  sidebarOpen: true,

  createFile: (name: string, language: string) => {
    const newFile: IDEFile = {
      id: Date.now().toString(),
      name,
      content: '',
      language,
      isActive: false,
    };
    set((state: any) => ({
      files: [...state.files, newFile],
    }));
  },

  deleteFile: (id: string) => {
    set((state: any) => ({
      files: state.files.filter((file: any) => file.id !== id),
      activeFileId: state.activeFileId === id ? state.files[0]?.id || null : state.activeFileId,
    }));
  },

  renameFile: (id: string, newName: string) => {
    set((state: any) => ({
      files: state.files.map((file: any) =>
        file.id === id ? { ...file, name: newName } : file
      ),
    }));
  },

  setActiveFile: (id: string) => {
    set((state: any) => ({
      files: state.files.map((file: any) => ({
        ...file,
        isActive: file.id === id,
      })),
      activeFileId: id,
    }));
  },

  updateFileContent: (id: string, content: string) => {
    set((state: any) => ({
      files: state.files.map((file: any) =>
        file.id === id ? { ...file, content } : file
      ),
    }));
    
    // Update preview if it's an HTML/JS/CSS file
    const file = get().files.find((f: any) => f.id === id);
    if (file && (file.language === 'html' || file.language === 'javascript' || file.language === 'css')) {
      get().updatePreview(content);
    }
  },

  executeCommand: (command: string) => {
    const newCommand: TerminalCommand = {
      command,
      output: simulateCommandOutput(command),
      timestamp: new Date(),
    };
    set((state: any) => ({
      terminalHistory: [...state.terminalHistory, newCommand],
    }));
  },

  clearTerminal: () => {
    set({ terminalHistory: [] });
  },

  toggleSidebar: () => {
    set((state: any) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  updatePreview: (content: string) => {
    set({ previewContent: content });
  },
}));

function simulateCommandOutput(command: string): string {
  if (command.startsWith('npm')) {
    return '✓ Command executed successfully';
  } else if (command.startsWith('git')) {
    return 'Git command executed';
  } else if (command === 'ls' || command === 'dir') {
    return 'App.tsx\nindex.js\nstyles.css\npackage.json';
  } else if (command === 'clear') {
    return '';
  } else {
    return `Command '${command}' executed`;
  }
}
