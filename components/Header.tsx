import React from 'react';
import { WildflocLogoIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-20 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 text-white p-2 rounded-lg">
            <WildflocLogoIcon className="w-6 h-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">
            Wildfloc Adventures
          </h1>
        </div>
        <a 
          href="https://github.com/google/generative-ai-docs" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          View Source
        </a>
      </div>
    </header>
  );
};

export default Header;