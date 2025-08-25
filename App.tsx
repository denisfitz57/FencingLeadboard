
import React, { useState, useMemo, useCallback } from 'react';
import { Fencer, BoutResult } from './types';
import { calculateLeaderboard } from './services/leaderboardService';
import Header from './components/Header';
import AddFencerForm from './components/AddFencerForm';
import AddBoutForm from './components/AddBoutForm';
import LeaderboardTable from './components/LeaderboardTable';
import FencersList from './components/FencersList';
import BoutsList from './components/BoutsList';
import { PlusIcon, CalculatorIcon, UsersIcon, ListIcon } from './components/icons';

type Tab = 'add' | 'lists';

const App: React.FC = () => {
  const [fencers, setFencers] = useState<Fencer[]>([]);
  const [bouts, setBouts] = useState<BoutResult[]>([]);
  const [leaderboard, setLeaderboard] = useState<Fencer[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('add');
  const [isCalculating, setIsCalculating] = useState(false);

  const fencerMap = useMemo(() => {
    return new Map(fencers.map(f => [f.id, f.name]));
  }, [fencers]);

  const handleAddFencer = (name: string) => {
    if (name && !fencers.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      const newFencer: Fencer = {
        id: crypto.randomUUID(),
        name,
        bouts: 0,
        wins: 0,
        rating: 1000,
        points: 0,
        daily_bouts: 0,
        refereed_bouts: 0,
      };
      setFencers(prev => [...prev, newFencer]);
    }
  };

  const handleAddBout = (bout: Omit<BoutResult, 'id'>) => {
    const newBout: BoutResult = { ...bout, id: crypto.randomUUID() };
    setBouts(prev => [...prev, newBout].sort((a, b) => new Date(a.bout_date).getTime() - new Date(b.bout_date).getTime()));
  };

  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    // Simulate async calculation for better UX
    setTimeout(() => {
      const result = calculateLeaderboard(fencers, bouts);
      setLeaderboard(result);
      setIsCalculating(false);
    }, 500);
  }, [fencers, bouts]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Controls</h2>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleCalculate}
                  disabled={isCalculating || bouts.length === 0}
                  className="flex items-center justify-center w-full px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 shadow-md"
                >
                  <CalculatorIcon className="h-5 w-5 mr-2" />
                  {isCalculating ? 'Calculating...' : 'Calculate Leaderboard'}
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg">
              <div className="border-b border-gray-700">
                <nav className="flex -mb-px">
                  <button onClick={() => setActiveTab('add')} className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'add' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                    <PlusIcon className="h-5 w-5 mx-auto mb-1" /> Add Data
                  </button>
                  <button onClick={() => setActiveTab('lists')} className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'lists' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                     <ListIcon className="h-5 w-5 mx-auto mb-1" /> View Lists
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'add' && (
                  <div className="space-y-8">
                    <AddFencerForm onAddFencer={handleAddFencer} />
                    <AddBoutForm fencers={fencers} onAddBout={handleAddBout} />
                  </div>
                )}
                {activeTab === 'lists' && (
                  <div className="space-y-8">
                    <FencersList fencers={fencers} />
                    <BoutsList bouts={bouts} fencerMap={fencerMap} />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg p-6">
             <LeaderboardTable fencers={leaderboard} isCalculating={isCalculating} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
