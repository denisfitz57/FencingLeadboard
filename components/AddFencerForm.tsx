
import React, { useState } from 'react';
import { UserPlusIcon } from './icons';

interface Props {
  onAddFencer: (name: string) => void;
}

const AddFencerForm: React.FC<Props> = ({ onAddFencer }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddFencer(name.trim());
      setName('');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-cyan-400">Add Fencer</h3>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New fencer's name"
          className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
        <button type="submit" className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 transition-colors flex items-center justify-center">
          <UserPlusIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default AddFencerForm;
