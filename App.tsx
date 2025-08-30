import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Transaction, View } from './types';
import Header from './components/Header';
import MainScreen from './components/MainScreen';
import HistoryScreen from './components/HistoryScreen';

const App: React.FC = () => {
  const [history, setHistory] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [currentView, setCurrentView] = useState<View>('main');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Basic check if firebase config is provided
    if (!db.app.options.apiKey || db.app.options.apiKey === 'YOUR_API_KEY') {
        setError('Firebase is not configured. Please add your Firebase project configuration to firebaseConfig.ts');
        setLoading(false);
        return;
    }

    const transactionsCollection = collection(db, 'transactions');
    const q = query(transactionsCollection, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData: Transaction[] = [];
      let newBalance = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const transaction: Transaction = {
          id: doc.id,
          amount: data.amount,
          description: data.description,
          timestamp: (data.timestamp as Timestamp)?.toDate().getTime() || Date.now(),
        };
        transactionsData.push(transaction);
        newBalance += data.amount;
      });
      setHistory(transactionsData);
      setBalance(newBalance);
      setLoading(false);
      setError(null);
    }, (err) => {
        console.error("Error fetching transactions: ", err);
        setError("Could not connect to the database. Please check your Firebase setup and internet connection.");
        setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const addTransaction = useCallback(async (amount: number, description: string) => {
    if (isNaN(amount) || amount === 0 || !description) return;

    try {
      await addDoc(collection(db, 'transactions'), {
        amount,
        description,
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to add transaction. Please try again.");
    }
  }, []);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    try {
      await deleteDoc(doc(db, 'transactions', transactionId));
    } catch (e) {
      console.error("Error deleting document: ", e);
      alert("Failed to delete transaction. Please try again.");
    }
  }, []);
  
  if (loading) {
      return (
          <div className="min-h-screen bg-brand-dark flex justify-center items-center">
              <p className="text-white text-xl">Loading data...</p>
          </div>
      );
  }

  if (error) {
      return (
          <div className="min-h-screen bg-brand-dark flex justify-center items-center text-center p-4">
              <div className="bg-red-800 p-6 rounded-lg shadow-xl">
                <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
                <p className="text-white">{error}</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-brand-dark font-sans flex flex-col">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-grow container mx-auto p-4 max-w-2xl">
        {currentView === 'main' && (
          <MainScreen 
            balance={balance} 
            addTransaction={addTransaction}
          />
        )}
        {currentView === 'history' && <HistoryScreen history={history} deleteTransaction={deleteTransaction} />}
      </main>
      <footer className="text-center p-4 text-xs text-brand-gray">
        <p>Coin Tracker App</p>
      </footer>
    </div>
  );
};

export default App;
