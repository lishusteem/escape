import { useState } from 'react'
import CameraEntry from './CameraEntry'
import UnifiedEscapeRoom from './UnifiedEscapeRoom'
import CypherpunkWelcomeMessage from './components/CypherpunkWelcomeMessage'
import { Shield, AlertCircle } from 'lucide-react';

function App() {
  const [isEntryComplete, setIsEntryComplete] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleEntryComplete = () => {
    setIsEntryComplete(true);
    setShowWelcome(true);
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  return (
    <>
      {!isEntryComplete ? (
        <CameraEntry onEntryComplete={handleEntryComplete} />
      ) : (
        <>
          {showWelcome && (
            <CypherpunkWelcomeMessage onClose={handleCloseWelcome} />
          )}
          {!showWelcome && <UnifiedEscapeRoom />}
          {/* Iconiță persistentă pentru redeschidere modal */}
          {!showWelcome && (
            <div className="fixed bottom-4 right-4 z-40">
              <button
                onClick={() => setShowWelcome(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-3 rounded-full shadow-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                title="Deschide mesajul Cypherpunk"
              >
                <AlertCircle className="h-20 w-20" />
              </button>
            </div>
          )}
        </>
      )}
      <div className="max-w-6xl mx-auto">
        {/* Eliminat headerul și containerul cu butonul de resetare */}
      </div>
    </>
  );
}

export default App
