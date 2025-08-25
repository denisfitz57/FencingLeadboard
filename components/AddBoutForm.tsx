
import React, { useState, useEffect } from 'react';
import { Fencer, BoutResult } from '../types';
import { PlusCircleIcon } from './icons';

interface Props {
  fencers: Fencer[];
  onAddBout: (bout: Omit<BoutResult, 'id'>) => void;
}

const AddBoutForm: React.FC<Props> = ({ fencers, onAddBout }) => {
  const [fencer1Id, setFencer1Id] = useState('');
  const [fencer2Id, setFencer2Id] = useState('');
  const [refereeId, setRefereeId] = useState('');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [bout_date, setBoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (fencers.length > 1) {
      if (!fencer1Id) setFencer1Id(fencers[0].id);
      if (!fencer2Id) setFencer2Id(fencers[1].id);
    }
    if (fencers.length > 0 && !refereeId) {
        setRefereeId(fencers[0].id)
    }
  }, [fencers, fencer1Id, fencer2Id, refereeId]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fencer1Id || !fencer2Id || !refereeId) {
      setError('Please select all participants.');
      return;
    }
    if (fencer1Id === fencer2Id) {
      setError('Fencer 1 and Fencer 2 cannot be the same person.');
      return;
    }
    if (score1 === score2) {
      setError('Scores cannot be tied. One fencer must win.');
      return;
    }

    const newBout: Omit<BoutResult, 'id'> = {
      bout_date,
      fencer1Id,
      fencer2Id,
      refereeId,
      score1,
      score2,
      winner: score1 > score2 ? 1 : 2,
    };
    onAddBout(newBout);
    // Reset scores for next entry
    setScore1(0);
    setScore2(0);
  };

  const availableFencersForP2 = fencers.filter(f => f.id !== fencer1Id);
  const availableFencersForP1 = fencers.filter(f => f.id !== fencer2Id);

  return (
    <div className="space-y-4 pt-8 border-t border-gray-700">
      <h3 className="text-xl font-semibold text-cyan-400">Add Bout Result</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Fencer 1</label>
            <select value={fencer1Id} onChange={e => setFencer1Id(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
              {availableFencersForP1.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Fencer 2</label>
            <select value={fencer2Id} onChange={e => setFencer2Id(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
              {availableFencersForP2.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Score 1</label>
            <input type="number" min="0" max="15" value={score1} onChange={e => setScore1(parseInt(e.target.value, 10))} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Score 2</label>
            <input type="number" min="0" max="15" value={score2} onChange={e => setScore2(parseInt(e.target.value, 10))} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Referee</label>
          <select value={refereeId} onChange={e => setRefereeId(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
            {fencers.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Bout Date</label>
          <input type="date" value={bout_date} onChange={e => setBoutDate(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
        </div>

        <button type="submit" disabled={fencers.length < 2} className="w-full flex items-center justify-center px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 shadow-md">
          <PlusCircleIcon className="h-5 w-5 mr-2"/>
          Add Bout
        </button>
      </form>
    </div>
  );
};

export default AddBoutForm;
