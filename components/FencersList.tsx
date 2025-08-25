
import React from 'react';
import { Fencer } from '../types';
import { UsersIcon } from './icons';

interface Props {
  fencers: Fencer[];
}

const FencersList: React.FC<Props> = ({ fencers }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-cyan-400 flex items-center">
        <UsersIcon className="h-6 w-6 mr-2"/>
        Fencers ({fencers.length})
      </h3>
      {fencers.length > 0 ? (
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {fencers.map(fencer => (
            <li key={fencer.id} className="bg-gray-700/50 rounded-md p-3 text-sm font-medium">
              {fencer.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm">No fencers added yet.</p>
      )}
    </div>
  );
};

export default FencersList;
