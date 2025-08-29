
import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Transaction, AppState, View } from './types';
import Header from './components/Header';
import MainScreen from './components/MainScreen';
import HistoryScreen from './components/HistoryScreen';

const App: React.FC = () => {
  const [appState, setAppState] = useLocalStorage<AppState>('coinTrackerData', {
    balance: 0,
    history: [],
  });

  const [currentView, setCurrentView] = useState<View>('main');

  const addTransaction = useCallback((amount: number, description: string) => {
    if (isNaN(amount) || amount === 0 || !description) return;

    const newTransaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      amount,
      description,
      timestamp: Date.now(),
    };

    setAppState(prevState => ({
      balance: prevState.balance + amount,
      history: [newTransaction, ...prevState.history],
    }));
  }, [setAppState]);

  const restoreState = (newState: AppState) => {
    // Basic validation
    if (typeof newState.balance === 'number' && Array.isArray(newState.history)) {
       setAppState(newState);
       alert('Data restored successfully!');
    } else {
        alert('Invalid backup file.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark font-sans flex flex-col">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-grow container mx-auto p-4 max-w-2xl">
        {currentView === 'main' && (
          <MainScreen 
            balance={appState.balance} 
            addTransaction={addTransaction}
            appState={appState}
            restoreState={restoreState}
          />
        )}
        {currentView === 'history' && <HistoryScreen history={appState.history} />}
      </main>
      <footer className="text-center p-4 text-xs text-brand-gray">
        <p>Coin Tracker App</p>
      </footer>
    </div>
  );
};

export default App;
