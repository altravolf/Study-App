import React, { useState, useEffect } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

const InstallPWA: React.FC = () => {
  const [promptInstall, setPromptInstall] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPromptInstall(e);
    };
    
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setPromptInstall(null);
    });
  };

  if (!promptInstall) {
    return null;
  }

  return (
    <button
      className="fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce"
      id="setup_button"
      aria-label="Install app"
      title="Install app"
      onClick={handleInstallClick}
    >
      <DownloadIcon className="w-6 h-6" />
    </button>
  );
};

export default InstallPWA;
