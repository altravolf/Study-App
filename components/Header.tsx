
import React from 'react';
import type { View } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { CoinIcon } from './icons/CoinIcon';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const NavButton: React.FC<{
    view: View;
    label: string;
    children: React.ReactNode;
  }> = ({ view, label, children }) => {
    const isActive = currentView === view;
    const activeClasses = 'bg-brand-gold text-brand-dark';
    const inactiveClasses = 'bg-brand-light-dark text-white hover:bg-brand-gray';
    return (
      <button
        onClick={() => setCurrentView(view)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
        aria-label={`Go to ${label} screen`}
      >
        {children}
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  };

  return (
    <header className="bg-brand-light-dark shadow-lg sticky top-0 z-10">
      <div className="container mx-auto p-4 flex justify-between items-center max-w-2xl">
        <div className="flex items-center gap-2">
            <CoinIcon className="w-8 h-8 text-brand-gold"/>
            <h1 className="text-2xl font-bold text-white">Coin Tracker</h1>
        </div>
        <nav className="flex items-center gap-2">
          <NavButton view="main" label="Home">
            <HomeIcon className="w-5 h-5" />
          </NavButton>
          <NavButton view="history" label="History">
            <HistoryIcon className="w-5 h-5" />
          </NavButton>
        </nav>
      </div>
    </header>
  );
};

export default Header;
