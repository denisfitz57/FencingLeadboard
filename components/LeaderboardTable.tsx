
import React from 'react';
import { Fencer } from '../types';
import { TrophyIcon } from './icons';

interface Props {
  fencers: Fencer[];
  isCalculating: boolean;
}

const LeaderboardTable: React.FC<Props> = ({ fencers, isCalculating }) => {

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-yellow-600';
      default: return 'text-gray-400';
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-cyan-400 flex items-center">
        <TrophyIcon className="h-7 w-7 mr-3" />
        Leaderboard
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Wins</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bouts</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {isCalculating ? (
              <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    <div className="animate-pulse">Calculating rankings...</div>
                  </td>
              </tr>
            ) : fencers.length > 0 ? (
              fencers.map((fencer, index) => (
                <tr key={fencer.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className={`px-6 py-4 whitespace-nowrap text-lg font-bold ${getRankColor(index + 1)}`}>{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{fencer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-cyan-400 font-semibold">{Math.round(fencer.points).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{Math.round(fencer.rating)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{fencer.wins}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{fencer.bouts}</td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                        Add fencers and bouts, then click "Calculate" to see the leaderboard.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
