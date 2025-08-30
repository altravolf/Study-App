import React, { useState } from 'react';
import ActionButton from './ActionButton';
import { CoinIcon } from './icons/CoinIcon';

interface MainScreenProps {
  balance: number;
  addTransaction: (amount: number, description: string) => void;
}

const NegativeBalanceWarning: React.FC<{ balance: number }> = ({ balance }) => {
  let message = null;
  if (balance <= -100) {
    message = "Threshold -100: No phone for 24 hours.";
  } else if (balance <= -75) {
    message = "Threshold -75: No phone for 12 hours.";
  } else if (balance <= -50) {
    message = "Threshold -50: No phone for 8 hours.";
  }

  if (!message) return null;

  return (
    <div className="bg-red-800 border border-red-600 text-white p-4 rounded-lg text-center my-4">
      <p className="font-bold text-lg">Real-Life Consequence Active!</p>
      <p>{message}</p>
    </div>
  );
};

const MainScreen: React.FC<MainScreenProps> = ({ balance, addTransaction }) => {
  const [customAmount, setCustomAmount] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  const handleCustomTransaction = () => {
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && customDescription.trim() !== '') {
      addTransaction(amount, customDescription.trim());
      setCustomAmount('');
      setCustomDescription('');
    } else {
      alert('Please enter a valid amount and description.');
    }
  };

  const predefinedActions = [
    { title: "Academic Tasks", actions: [
      { label: "Subject Completed", amount: 2 },
      { label: "Mini Subject Completed", amount: 1 },
      { label: "30min Revision", amount: 1 },
      { label: "Missed Subject", amount: -1 },
    ]},
    { title: "Daily Habits", actions: [
      { label: "Coffee before 9am", amount: 4 },
      { label: "No Phone after 10:30pm", amount: 4 },
      { label: "6 Hours Study", amount: 6 },
      { label: "Missed Coffee", amount: -2 },
      { label: "Missed No Phone", amount: -2 },
      { label: "Missed 6h Study", amount: -3 },
    ]},
    { title: "Rewards & Penalties", actions: [
      { label: "Purchase 'Incubate'", amount: -15 },
      { label: "Used Reward w/o Coins", amount: -20 },
      { label: "Missed Deadline", amount: -10 },
    ]},
  ];

  return (
    <div className="space-y-6">
      <div className="bg-brand-light-dark p-6 rounded-xl shadow-lg text-center">
        <h2 className="text-lg font-semibold text-gray-300">Total Balance</h2>
        <div className="flex items-center justify-center gap-3 my-2">
          <CoinIcon className="w-10 h-10 text-brand-gold"/>
          <p className={`text-6xl font-bold ${balance < 0 ? 'text-red-400' : 'text-green-400'}`}>
            {balance}
          </p>
        </div>
      </div>

      <NegativeBalanceWarning balance={balance} />

      {predefinedActions.map(({ title, actions }) => (
        <div key={title} className="bg-brand-light-dark p-4 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-3 border-b border-brand-gray pb-2">{title}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {actions.map(action => (
              <ActionButton key={action.label} {...action} onClick={addTransaction} />
            ))}
          </div>
        </div>
      ))}
      
      <div className="bg-brand-light-dark p-4 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-3 border-b border-brand-gray pb-2">Custom Transaction</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Amount (+/-)"
            className="flex-1 bg-brand-dark border border-brand-gray rounded-md p-2 text-white placeholder-gray-400 focus:ring-brand-gold focus:border-brand-gold"
          />
          <input
            type="text"
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="Description"
            className="flex-2 bg-brand-dark border border-brand-gray rounded-md p-2 text-white placeholder-gray-400 focus:ring-brand-gold focus:border-brand-gold"
          />
          <button
            onClick={handleCustomTransaction}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
