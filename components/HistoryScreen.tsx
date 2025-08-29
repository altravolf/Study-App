import React from 'react';
import type { Transaction } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryScreenProps {
  history: Transaction[];
  deleteTransaction: (id: string) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, deleteTransaction }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">No transactions yet.</p>
      </div>
    );
  }

  const groupedTransactions = history.reduce((acc, tx) => {
    const date = new Date(tx.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = { transactions: [], gained: 0, lost: 0 };
    }
    acc[date].transactions.push(tx);
    if (tx.amount > 0) {
      acc[date].gained += tx.amount;
    } else {
      acc[date].lost += tx.amount; // amount is already negative
    }
    return acc;
  }, {} as Record<string, { transactions: Transaction[]; gained: number; lost: number }>);

  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const handleDelete = (tx: Transaction) => {
    if (window.confirm(`Are you sure you want to delete the transaction "${tx.description}"?`)) {
        deleteTransaction(tx.id);
    }
  }

  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <div key={date} className="bg-brand-light-dark p-4 rounded-xl shadow-lg">
          <div className="flex justify-between items-center border-b border-brand-gray pb-2 mb-3">
            <h2 className="text-lg font-bold">{date}</h2>
            <div className="flex gap-4 text-sm font-semibold">
              <span className="text-green-400">Gained: +{groupedTransactions[date].gained}</span>
              <span className="text-red-400">Lost: {groupedTransactions[date].lost}</span>
            </div>
          </div>
          <ul className="space-y-2">
            {groupedTransactions[date].transactions.map(tx => (
              <li key={tx.id} className="flex justify-between items-center bg-brand-dark p-3 rounded-lg">
                <div className="flex-1 mr-4">
                  <p className="font-medium">{tx.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`font-bold text-lg ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </span>
                    <button 
                        onClick={() => handleDelete(tx)}
                        className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                        aria-label={`Delete transaction: ${tx.description}`}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default HistoryScreen;
