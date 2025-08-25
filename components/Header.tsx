
import React from 'react';
import { SwordIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center">
        <SwordIcon className="h-8 w-8 text-cyan-400 mr-3" />
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-wider">
          Fencing Leaderboard Calculator
        </h1>
      </div>
    </header>
  );
};

export default Header;
