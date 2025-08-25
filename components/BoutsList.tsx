
import React from 'react';
import { BoutResult } from '../types';
import { ListIcon } from './icons';

interface Props {
  bouts: BoutResult[];
  fencerMap: Map<string, string>;
}

const BoutsList: React.FC<Props> = ({ bouts, fencerMap }) => {
  return (
    <div className="space-y-4 pt-8 border-t border-gray-700">
      <h3 className="text-xl font-semibold text-cyan-400 flex items-center">
        <ListIcon className="h-6 w-6 mr-2"/>
        Bouts ({bouts.length})
      </h3>
      {bouts.length > 0 ? (
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {bouts.map(bout => {
            const fencer1Name = fencerMap.get(bout.fencer1Id) || 'N/A';
            const fencer2Name = fencerMap.get(bout.fencer2Id) || 'N/A';
            const winnerName = bout.winner === 1 ? fencer1Name : fencer2Name;

            return (
              <li key={bout.id} className="bg-gray-700/50 rounded-md p-3 text-sm">
                <div className="font-bold">{fencer1Name} vs {fencer2Name}</div>
                <div className="text-xs text-gray-400">{bout.bout_date}</div>
                <div className="text-cyan-400">
                  {winnerName} wins {bout.score1}-{bout.score2}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm">No bouts recorded yet.</p>
      )}
    </div>
  );
};

export default BoutsList;
