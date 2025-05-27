import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import CypherpunkWelcomeMessage from './CypherpunkWelcomeMessage';

interface ProjectionConfig {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface OverlayConfig {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface CryptoWalletPageProps {
  isOpen: boolean;
  onClose: () => void;
}

// Interfață pentru componentul de modal al portofelului
interface WalletModalProps {
  onClose: () => void;
  onWalletUnlocked: (unlocked: boolean) => void;
}

// Componenta principală pentru modalul portofelului
const WalletModal: React.FC<WalletModalProps> = ({ onClose, onWalletUnlocked }) => {
  const [seedPhraseInput, setSeedPhraseInput] = useState<string[]>(Array(12).fill(''));
  const [isWalletUnlocked, setIsWalletUnlocked] = useState(false);
  const [fundAddress, setFundAddress] = useState('');
  const [missionComplete, setMissionComplete] = useState(false);

  // Seed phrase-ul corect pentru validare
  const correctSeedPhrase = [
    'talent', 'witness', 'glance', 'midnight', 'escape', 'ocean',
    'response', 'silent', 'together', 'volcano', 'robot', 'dream'
  ];

  // Lista inițială de cuvinte amestecate o dată
  const initialWordList = [
    'talent', 'witness', 'glance', 'midnight', 'escape', 'ocean',
    'response', 'silent', 'together', 'volcano', 'robot', 'dream',
    // Adăugăm și niște cuvinte false pentru dificultate
    'freedom', 'crypto', 'block', 'chain', 'bitcoin', 'ethereum',
    'hash', 'wallet', 'node', 'mining', 'fork', 'ledger'
  ].sort(() => Math.random() - 0.5); // Amestecă cuvintele o dată

  // Starea pentru cuvintele disponibile (se actualizează când sunt selectate)
  const [availableWords, setAvailableWords] = useState<string[]>(initialWordList);  const handleWordClick = (word: string) => {
    // Găsește primul slot gol și adaugă cuvântul acolo
    const firstEmptyIndex = seedPhraseInput.findIndex(slot => slot === '');
    if (firstEmptyIndex !== -1) {
      const newSeedPhrase = [...seedPhraseInput];
      newSeedPhrase[firstEmptyIndex] = word;
      setSeedPhraseInput(newSeedPhrase);
      
      // Elimină cuvântul din lista de cuvinte disponibile
      setAvailableWords(prev => prev.filter(w => w !== word));
    }
  };

  const handleSlotClick = (index: number) => {
    // Click pe slot îl golește (dacă nu este deja gol)
    if (seedPhraseInput[index] !== '') {
      clearSlot(index);
    }
  };
  const clearSlot = (index: number) => {
    const word = seedPhraseInput[index];
    if (word) {
      // Readaugă cuvântul în lista de cuvinte disponibile
      setAvailableWords(prev => [...prev, word]);
      
      // Golește slot-ul
      const newSeedPhrase = [...seedPhraseInput];
      newSeedPhrase[index] = '';
      setSeedPhraseInput(newSeedPhrase);
    }
  };
  const validateSeedPhrase = () => {
    const isCorrect = seedPhraseInput.every((word, index) => 
      word.toLowerCase().trim() === correctSeedPhrase[index]
    );
    
    if (isCorrect) {
      setIsWalletUnlocked(true);
      onWalletUnlocked(true);
    } else {
      alert('❌ Seed phrase incorect! Verifică ordinea cuvintelor.');
    }
  };const handleFundTransfer = () => {
    if (fundAddress.toLowerCase().includes('revolution') || 
        fundAddress.toLowerCase().includes('revolt') ||
        fundAddress.toLowerCase().includes('0x1234567890123456789012345678901234567890') ||
        fundAddress.toLowerCase() === '0x742d35cc6634c0532925a3b844bc454e4438f44e') {
      setMissionComplete(true);
    } else {
      alert('❌ Adresa nu pare să fie cea a revoluției. Încearcă din nou.');
    }
  };

  const resetSeedPhrase = () => {
    setSeedPhraseInput(Array(12).fill(''));
    setAvailableWords(initialWordList);
  };  const restartMission = () => {
    setSeedPhraseInput(Array(12).fill(''));
    setIsWalletUnlocked(false);
    onWalletUnlocked(false);
    setFundAddress('');
    setMissionComplete(false);
    onClose();
  };
  if (missionComplete) {
    return (
      <div className="absolute inset-4 bg-gray-900/95 backdrop-blur rounded-lg border border-gray-600 shadow-2xl z-20">
        <div className="h-full p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">🎉 Misiune Completată!</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <div className="text-2xl text-yellow-400 mb-3 font-bold">
              Felicitări, adevărat Cypherpunk!
            </div>
            <div className="text-lg text-white/80 mb-6 max-w-xl">
              Ai demonstrat cunoștințele necesare pentru a naviga în lumea crypto și blockchain.
            </div>
            
            <div className="bg-gradient-to-r from-cyan-400/20 to-pink-500/20 border border-cyan-400/50 rounded-xl p-6 mb-6 max-w-xl">
              <div className="text-xl font-bold text-yellow-400 mb-3">
                🎯 Certificat de Finalizare
              </div>
              <div className="text-white/90 text-base leading-relaxed">
                Continuă să explorezi lumea fascinantă a criptografiei și blockchain-ului.
                <br/>Puterea este în mâinile celor care înțeleg tehnologia!
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={restartMission}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-base transition-all duration-300 hover:scale-105"
              >
                🔄 Reîncepe
              </button>
              <button 
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-bold text-base transition-all duration-300"
              >
                📜 Închide
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isWalletUnlocked) {
    return (
      <div className="absolute inset-4 bg-gray-900/95 backdrop-blur rounded-lg border border-gray-600 shadow-2xl z-20">        <div className="h-full p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">💼 Portofel Deblocat</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl font-bold"
            >
              ×
            </button>
          </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-4"><div className="bg-gray-800/50 rounded-xl p-4 mb-4 w-full max-w-lg border border-gray-600">
              <div className="text-lg font-bold text-white mb-3 text-center">💰 Balanță</div>
              <div className="bg-orange-600/20 p-4 rounded-lg border border-orange-600/30 text-center">
                <div className="text-orange-400 font-bold mb-1">Bitcoin (BTC)</div>
                <div className="text-3xl text-white font-mono">1,096,354</div>
              </div>
            </div>            <div className="w-full max-w-lg bg-gray-800/50 rounded-xl p-4 border border-gray-600">              <div className="text-center mb-3">
                <h3 className="text-white font-bold text-base">🎯 Transfer Fonduri</h3>
                <p className="text-gray-400 text-xs">Trimite către adresa dorită</p>
              </div>
              
              <label className="block text-cyan-400 font-bold mb-2 text-sm">
                Adresa Destinație:
              </label>              <input 
                type="text"
                value={fundAddress}
                onChange={(e) => setFundAddress(e.target.value)}
                className="w-full bg-gray-700 text-white p-3 rounded-lg border-2 border-gray-600 focus:border-cyan-400 focus:outline-none mb-4 text-xs font-mono"
                placeholder="0x... sau cuvânt cheie"
              />
              
              <button
                onClick={handleFundTransfer}
                className="w-full bg-gradient-to-r from-green-600 via-cyan-600 to-blue-600 hover:from-green-500 hover:via-cyan-500 hover:to-blue-500 text-white px-4 py-3 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/50 border-2 border-transparent hover:border-cyan-400/50"
              >                <div className="flex items-center justify-center gap-2">
                  <span>💸</span>
                  <span>TRANSFERĂ FONDURI</span>
                  <span>🚀</span>
                </div>
              </button>
              
              <div className="text-center mt-2">
                <div className="text-xs text-gray-500">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="absolute inset-4 bg-gray-900/95 backdrop-blur rounded-lg border border-gray-600 shadow-2xl z-20">
      <div className="h-full p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Seed Phrase</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4">          {/* Word Bank - Stânga */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <h3 className="text-sm font-bold text-white mb-3 text-center">
              Cuvinte Disponibile
            </h3>            <div className="grid grid-cols-4 gap-1">
              {availableWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word)}
                  className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white px-1 py-1 rounded text-[10px] transition-all duration-200 border border-blue-600/30 hover:border-blue-400 min-h-[24px] leading-tight"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>{/* Seed Phrase Slots - Dreapta */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <h3 className="text-sm font-bold text-white mb-3 text-center">
              12 Cuvinte
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {seedPhraseInput.map((word, index) => {
                const isNextEmpty = !word && seedPhraseInput.slice(0, index).every(slot => slot !== '');
                return (
                  <div key={index} className="relative">
                    <div className="text-xs text-gray-400 mb-1">{index + 1}.</div>
                    <button
                      onClick={() => handleSlotClick(index)}
                      className={`w-full h-10 rounded border-2 transition-all duration-200 flex items-center justify-center text-xs font-mono ${
                        word
                          ? 'border-green-600 bg-green-600/20 text-green-300 hover:border-red-500 hover:bg-red-500/20'
                          : isNextEmpty
                          ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300 animate-pulse'
                          : 'border-gray-600 bg-gray-700/50 text-gray-400 cursor-default'
                      }`}
                      title={
                        word 
                          ? 'Click pentru a goli' 
                          : isNextEmpty 
                          ? 'Următorul' 
                          : `${index + 1}`
                      }
                    >
                      {word || (isNextEmpty ? '←' : `${index + 1}`)}
                    </button>
                    {word && (
                      <button
                        onClick={() => clearSlot(index)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                        title="Șterge"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 space-y-2">
              <button 
                onClick={validateSeedPhrase}
                disabled={seedPhraseInput.some(word => !word)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105"
              >
                Restaurează Portofel
              </button>
                <button 
                onClick={resetSeedPhrase}
                className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-red-600/30 text-sm"
              >
                Șterge Tot
              </button>
            </div>
          </div>
        </div>        <div className="mt-3 text-center">
          <div className="text-xs text-gray-400 bg-gray-800/30 rounded p-2">
            Click pe cuvinte pentru a le adăuga în ordine. Click pe casetele verzi pentru a le goli.
          </div>
        </div>
      </div>
    </div>
  );
};

// Componenta principală CryptoWalletPage
const CryptoWalletPage: React.FC<CryptoWalletPageProps> = ({ isOpen, onClose }) => {
  const [currentScreen, setCurrentScreen] = useState<'boot' | 'password' | 'desktop'>('boot');
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletUnlocked, setWalletUnlocked] = useState(false);
  const [welcomeMessageOpen, setWelcomeMessageOpen] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootMessages, setBootMessages] = useState<string[]>([]);

  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const overlayContainerRef = useRef<HTMLDivElement>(null);
  const projectionAreaRef = useRef<HTMLDivElement>(null);
  const overlayImageRef = useRef<HTMLImageElement>(null);

  // Configurația pentru aria de proiecție relativă la imaginea de fundal (pe bază de procente)
  // UPDATED: Coordonate finale optimizate pentru zona ecranului din finish_line.png
  const projectionConfig: ProjectionConfig = {
    left: 16.00,        // Poziționare finală optimizată
    top: 11.50,         // Poziționare finală optimizată
    width: 80.50,       // Lățime finală optimizată
    height: 63.50       // Înălțime finală optimizată
  };

  const TARGET_ASPECT_RATIO = projectionConfig.width / projectionConfig.height; // ~1.27 (width/height)

  // Configurație pentru imaginea de overlay relativă la imaginea de fundal (pe bază de procente)
  const overlayConfig: OverlayConfig = {
    left: 0,            // 0% - overlay acoperă întreaga imagine de fundal
    top: 0,             // 0% - overlay acoperă întreaga imagine de fundal
    width: 100,         // 100% - la fel ca imaginea de fundal
    height: 100         // 100% - la fel ca imaginea de fundal
  };
  // Secvența de mesaje de boot
  const bootSequence = [
    "INITIALIZING QUANTUM ENCRYPTION PROTOCOLS...",
    "ESTABLISHING SECURE BLOCKCHAIN CONNECTION...",
    "LOADING CYPHERPUNK NETWORK INTERFACES...",
    "VERIFYING CRYPTOGRAPHIC KEY SIGNATURES...",
    "ACTIVATING PRIVACY PROTECTION SYSTEMS...",
    "SYSTEM READY - AUTHENTICATION REQUIRED"
  ];

  // Funcția pentru actualizarea layout-ului zonei de proiecție
  const updateProjectionAreaLayout = () => {
    const backgroundContainer = document.getElementById('backgroundContainer');
    const img = backgroundImageRef.current;
    const overlayContainer = overlayContainerRef.current;
    const projectionDiv = projectionAreaRef.current;
    const overlayImg = overlayImageRef.current;

    if (!img || !projectionDiv || !backgroundContainer || !overlayContainer) {
      console.error("Required elements missing for container-based layout.");
      return;
    }

    if (!img.naturalWidth || !img.naturalHeight || img.naturalWidth === 0) {
      console.warn("Background image not loaded yet, waiting...");
      return;
    }

    // Obține dimensiunile afișate ale imaginii de fundal
    const imgRect = img.getBoundingClientRect();
    
    // Actualizează containerul de overlay să se potrivească cu dimensiunile și poziția exacte ale imaginii de fundal
    overlayContainer.style.left = (imgRect.left - backgroundContainer.getBoundingClientRect().left) + 'px';
    overlayContainer.style.top = (imgRect.top - backgroundContainer.getBoundingClientRect().top) + 'px';
    overlayContainer.style.width = imgRect.width + 'px';
    overlayContainer.style.height = imgRect.height + 'px';
    
    // Calculează dimensiunile zonei de proiecție relative la imaginea de fundal
    const projectionWidth = imgRect.width * projectionConfig.width / 100;
    const projectionHeight = imgRect.height * projectionConfig.height / 100;
    
    // Poziționează zona de proiecție relativă la containerul de overlay
    const projectionLeft = imgRect.width * projectionConfig.left / 100;
    const projectionTop = imgRect.height * projectionConfig.top / 100;
    
    projectionDiv.style.left = projectionLeft + 'px';
    projectionDiv.style.top = projectionTop + 'px';
    projectionDiv.style.width = projectionWidth + 'px';
    projectionDiv.style.height = projectionHeight + 'px';
    
    // Poziționează imaginea de overlay relativă la containerul de overlay
    if (overlayImg) {
      const overlayLeft = imgRect.width * overlayConfig.left / 100;
      const overlayTop = imgRect.height * overlayConfig.top / 100;
      const overlayWidth = imgRect.width * overlayConfig.width / 100;
      const overlayHeight = imgRect.height * overlayConfig.height / 100;
      
      overlayImg.style.left = overlayLeft + 'px';
      overlayImg.style.top = overlayTop + 'px';
      overlayImg.style.width = overlayWidth + 'px';
      overlayImg.style.height = overlayHeight + 'px';
    }
    
    console.log('🎯 Container-based positioning applied:', {
      backgroundImage: {
        natural: `${img.naturalWidth}x${img.naturalHeight}`,
        displayed: `${imgRect.width.toFixed(1)}x${imgRect.height.toFixed(1)}`,
        position: `(${imgRect.left.toFixed(1)}, ${imgRect.top.toFixed(1)})`
      },
      projection: {
        config: `${projectionConfig.left}%, ${projectionConfig.top}%, ${projectionConfig.width}%, ${projectionConfig.height}%`,
        finalDimensions: `${projectionWidth.toFixed(1)}x${projectionHeight.toFixed(1)} at (${projectionLeft.toFixed(1)}, ${projectionTop.toFixed(1)})`,
        currentAspectRatio: (projectionWidth / projectionHeight).toFixed(3),
        targetAspectRatio: TARGET_ASPECT_RATIO.toFixed(3)
      }
    });
  };

  // Funcția pentru inițializarea mediului de proiecție
  const initializeProjectionEnvironment = () => {
    const backgroundImg = backgroundImageRef.current;
    const overlayImg = overlayImageRef.current;
    
    console.log('🚀 Initializing percentage-based positioning system...');
    
    if (backgroundImg) {
      if (backgroundImg.complete && backgroundImg.naturalWidth > 0) {
        console.log("✅ Background image already loaded. Updating projection area layout.");
        updateProjectionAreaLayout();
      } else {
        console.log("⏳ Waiting for background image to load for projection area positioning.");
        backgroundImg.onload = () => {
          console.log("✅ Background image loaded. Updating projection area layout.");
          updateProjectionAreaLayout();
        };
        backgroundImg.onerror = () => {
          console.error("❌ Error loading background image.");
        };
      }
      
      // Handle overlay image loading
      if (overlayImg) {
        if (overlayImg.complete && overlayImg.naturalWidth > 0) {
          console.log("✅ Overlay image already loaded.");
        } else {
          console.log("⏳ Waiting for overlay image to load.");
          overlayImg.onload = () => {
            console.log("✅ Overlay image loaded.");
            updateProjectionAreaLayout();
          };
          overlayImg.onerror = () => {
            console.error("❌ Error loading overlay image.");
            if (overlayImg) overlayImg.style.display = 'none';
          };
        }
      }
      
      // Update layout on window resize
      const handleResize = () => {
        console.log('🔄 Window resized, updating percentage-based positioning...');
        updateProjectionAreaLayout();
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  };

  // Funcția pentru pornirea secvenței de boot
  const startBootSequence = () => {
    let messageIndex = 0;
    const messages: string[] = [];

    const interval = setInterval(() => {
      if (messageIndex < bootSequence.length) {
        messages.push(bootSequence[messageIndex]);
        setBootMessages([...messages]);

        const progress = messageIndex + 1;
        const percentage = Math.round((progress / bootSequence.length) * 100);
        setBootProgress(percentage);

        messageIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentScreen('password');
        }, 2000);
      }
    }, 1200);
  };

  // Funcția pentru gestionarea submit-ului parolei
  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;

    if (password?.toLowerCase().trim() === 'bailout') {
      setCurrentScreen('desktop');
    } else {
      alert('❌ ACCESS DENIED - INVALID CREDENTIALS');
      (event.target as HTMLFormElement).reset();
    }
  };

  // Funcția pentru deschiderea portofelului
  const openWallet = () => {
    setWalletOpen(true);
  };  // Funcția pentru închiderea portofelului
  const closeWallet = () => {
    setWalletOpen(false);
    setWalletUnlocked(false); // Reset starea când se închide portofelul
  };

  // Funcția pentru gestionarea stării portofelului deblocat
  const handleWalletUnlocked = (unlocked: boolean) => {
    setWalletUnlocked(unlocked);
  };

  // Efecte pentru inițializare
  useEffect(() => {
    if (isOpen) {
      initializeProjectionEnvironment();
      setTimeout(() => {
        startBootSequence();
      }, 1500);
    }
  }, [isOpen]);

  // Actualizează layout-ul când imaginea se încarcă
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        updateProjectionAreaLayout();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentScreen]);

  // Gestionează tasta Escape pentru închidere
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (walletOpen) {
          closeWallet();
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, walletOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Container pentru imaginea de fundal - menține aspectul și servește ca referință */}
      <div id="backgroundContainer" className="relative w-full h-full flex items-center justify-center bg-black">
        <img 
          ref={backgroundImageRef}
          id="pageBackgroundImage" 
          src="/finishline/finish_line.png" 
          alt="Full page background"
          className="max-w-full max-h-full w-auto h-auto object-contain block"
        />
        
        {/* Container de Overlay pentru Imagini - poziționat relativ la imaginea de fundal */}
        <div 
          ref={overlayContainerRef}
          id="imageOverlayContainer" 
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >          <img 
            ref={overlayImageRef}
            id="overlayImage" 
            src={walletUnlocked ? "/finishline/4.png" : "/finishline/5.png"} 
            alt="Overlay image" 
            className="absolute select-none pointer-events-none z-[10000]"
            draggable={false}
          />
          
          <div 
            ref={projectionAreaRef}
            id="projectionArea" 
            className="absolute bg-black/80 overflow-hidden pointer-events-auto"
          >
            {/* Ecranul de Boot */}
            {currentScreen === 'boot' && (
              <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center transition-all duration-500">
                <div className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-[15px] p-6 shadow-lg max-w-[95%] max-h-[95%] mx-auto">
                  <div className="text-center mb-6">
                    <div className="text-[2rem] font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent mb-4 animate-pulse">
                      CYPHERPUNK SYSTEM
                    </div>
                    <div className="text-[0.9rem] text-white/60 mb-4 tracking-wide">
                      QUANTUM ENCRYPTED • BLOCKCHAIN POWERED
                    </div>
                  </div>
                  <div className="mb-4 min-h-[150px] text-[0.8rem]">
                    {bootMessages.map((message, index) => (
                      <div key={index} className="flex items-center mb-3 opacity-100 animate-slideIn p-2">
                        <span className="text-cyan-400 mr-2 font-bold">▶</span>
                        <span className={index === bootMessages.length - 1 ? "text-cyan-400" : "text-white/40"}>
                          {message}
                        </span>
                        {index === bootMessages.length - 1 && (
                          <span className="text-cyan-400 ml-2 font-bold animate-pulse">█</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mb-4">
                    <div className="w-full h-3 bg-white/10 rounded-[10px] overflow-hidden relative shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 rounded-[10px] transition-all duration-800 relative overflow-hidden"
                        style={{ width: `${bootProgress}%` }}
                      >
                        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    <div className="text-center font-mono text-white/70 text-[0.9rem] mt-4">
                      LOADING CYPHERPUNK SYSTEMS... {bootProgress}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ecranul de Parolă */}
            {currentScreen === 'password' && (
              <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center transition-all duration-500">
                <div className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-[15px] p-6 shadow-lg w-4/5 max-w-md mx-auto">
                  <div className="text-[3rem] mb-4 text-center">🔐</div>
                  <div className="text-[1.8rem] font-bold mb-2 text-center bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                    SECURE ACCESS
                  </div>
                  <div className="text-white/60 text-[0.9rem] mb-6 text-center tracking-wide">
                    AUTHORIZED PERSONNEL ONLY
                  </div>
                  <form onSubmit={handlePasswordSubmit} className="mb-4">
                    <label className="block text-left mb-2 text-cyan-400 font-semibold text-[0.9rem]">
                      ACCESS CODE REQUIRED:
                    </label>
                    <input 
                      type="password" 
                      name="password"
                      className="w-full bg-white/5 backdrop-blur-[10px] border-2 border-cyan-400/30 text-white p-3 rounded-[15px] font-mono text-[0.9rem] mb-4 outline-none transition-all duration-300 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/30 focus:bg-white/8 hover:border-cyan-400/50"
                      placeholder="Enter security passphrase..."
                      autoComplete="off"
                    />
                    <button type="submit" className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-black border-none p-3 rounded-[15px] font-bold text-[1rem] cursor-pointer transition-all duration-300 uppercase tracking-wide hover:from-cyan-300 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-400/40 hover:-translate-y-1">
                      AUTHENTICATE
                    </button>
                  </form>
                  <div className="text-[0.8rem] text-white/60 leading-relaxed">
                    <div>🔍 <span className="text-yellow-400 font-semibold">HINT:</span> Think about the 2008 financial crisis...</div>
                    <div className="mt-2">What word did Satoshi use in the Genesis block?</div>
                  </div>
                </div>
              </div>
            )}

            {/* Ecranul Desktop */}
            {currentScreen === 'desktop' && (
              <div className="absolute top-0 left-0 w-full h-full transition-all duration-500">                {/* Iconița Desktop */}
                <div 
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-110 group flex flex-col items-center"
                  style={{ left: '20px', top: '20px' }}
                  onClick={openWallet}
                >
                  <div className="text-[3rem] mb-1 group-hover:animate-bounce">💼</div>
                  <div className="text-white text-[0.9rem] font-semibold text-center">Portofelul</div>
                  <div className="text-white/60 text-[0.7rem] text-center">Accesează portofelul</div>
                </div>

                {/* Bara de Taskuri */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-800/80 backdrop-blur border-t border-gray-600/50 flex items-center px-4">
                  <div className="w-8 h-8 bg-blue-600 rounded mr-4"></div>
                  {walletOpen && (
                    <div 
                      className="bg-gray-700/50 px-3 py-1 rounded cursor-pointer hover:bg-gray-600/50"
                      onClick={openWallet}
                    >
                      Portofelul Secret
                    </div>
                  )}
                </div>
              </div>
            )}            {/* Fereastra Portofelului */}
            {walletOpen && (
              <WalletModal onClose={closeWallet} onWalletUnlocked={handleWalletUnlocked} />
            )}            {/* Componenta CypherpunkWelcomeMessage în colțul dreapta jos */}
            {welcomeMessageOpen && (
              <div className="absolute bottom-14 right-2 z-[20000]">
                <CypherpunkWelcomeMessage
                  onClose={() => setWelcomeMessageOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>      {/* Buton de închidere în colțul din dreapta sus */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[60] bg-red-600/80 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 hover:scale-110"
        title="Închide (Escape)"
      >
        ×
      </button>

      {/* Buton Cypherpunk Message în colțul dreapta jos al paginii */}
      {!welcomeMessageOpen && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setWelcomeMessageOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-3 rounded-full shadow-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:scale-110"
            title="Deschide mesajul Cypherpunk"
          >
            <AlertCircle className="h-20 w-20" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CryptoWalletPage;
