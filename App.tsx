
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Fencer, BoutResult } from './types';
import { calculateLeaderboard } from './services/leaderboardService';
import Header from './components/Header';
import AddFencerForm from './components/AddFencerForm';
import AddBoutForm from './components/AddBoutForm';
import LeaderboardTable from './components/LeaderboardTable';
import FencersList from './components/FencersList';
import BoutsList from './components/BoutsList';
import { PlusIcon, CalculatorIcon, TrashIcon, ListIcon, ExportIcon, ImportIcon } from './components/icons';

type Tab = 'add' | 'lists';

const loadState = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load state from localStorage for key:", key, e);
  }
  return defaultValue;
};

const App: React.FC = () => {
  const [fencers, setFencers] = useState<Fencer[]>(() => loadState<Fencer[]>('fencing_app_fencers', []));
  const [bouts, setBouts] = useState<BoutResult[]>(() => loadState<BoutResult[]>('fencing_app_bouts', []));
  const [leaderboard, setLeaderboard] = useState<Fencer[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('add');
  const [isCalculating, setIsCalculating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    try {
      localStorage.setItem('fencing_app_fencers', JSON.stringify(fencers));
      localStorage.setItem('fencing_app_bouts', JSON.stringify(bouts));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }, [fencers, bouts]);

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
  
  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all fencers and bouts? This action cannot be undone.")) {
      localStorage.removeItem('fencing_app_fencers');
      localStorage.removeItem('fencing_app_bouts');
      setFencers([]);
      setBouts([]);
      setLeaderboard([]);
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      fencers,
      bouts,
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fencing_leaderboard_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (window.confirm("Are you sure you want to import this file? This will overwrite all current fencer and bout data.")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File content is not readable text.");
                }
                const data = JSON.parse(text);

                // Basic validation
                if (Array.isArray(data.fencers) && Array.isArray(data.bouts)) {
                    setFencers(data.fencers);
                    setBouts(data.bouts);
                    setLeaderboard([]); // Clear leaderboard as data has changed
                    alert("Data imported successfully!");
                } else {
                    throw new Error("Invalid file format. Missing 'fencers' or 'bouts' array.");
                }
            } catch (error) {
                console.error("Failed to import data:", error);
                alert(`Error importing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        };
        reader.readAsText(file);
    }
    // Reset file input value to allow re-uploading the same file
    event.target.value = '';
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Controls</h2>
               <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                style={{ display: 'none' }}
              />
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleCalculate}
                  disabled={isCalculating || bouts.length === 0}
                  className="flex items-center justify-center w-full px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 shadow-md"
                >
                  <CalculatorIcon className="h-5 w-5 mr-2" />
                  {isCalculating ? 'Calculating...' : 'Calculate Leaderboard'}
                </button>
                 <button
                  onClick={handleImportClick}
                  className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors duration-300 shadow-md"
                >
                  <ImportIcon className="h-5 w-5 mr-2" />
                  Import Data
                </button>
                <button
                  onClick={handleExportData}
                  disabled={fencers.length === 0 && bouts.length === 0}
                  className="flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 shadow-md"
                >
                  <ExportIcon className="h-5 w-5 mr-2" />
                  Export Data
                </button>
                 <button
                  onClick={handleClearData}
                  className="flex items-center justify-center w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors duration-300 shadow-md"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Clear All Data
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
