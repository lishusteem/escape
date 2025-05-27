import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import TransactionLoadingModal from './components/TransactionLoadingModal';
import SendSecretMessageModal from './components/SendSecretMessageModal';
import SignMessageModal from './components/SignMessageModal';
import TimestampModal from './components/TimestampModal';
import VoteModal from './components/VoteModal';
import SymbolicDonationModal from './components/SymbolicDonationModal';
import SimpleSwapModal from './components/SimpleSwapModal';
import MetaMaskSetupGuide from './components/MetaMaskSetupGuide';
import CryptoWalletPage from './components/CryptoWalletPage';

// Helper function to get signer
const getSigner = () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    return provider.getSigner();
  }
  console.error("MetaMask is not available. Make sure it's installed and enabled.");
  alert("Portofelul MetaMask nu este disponibil. Asigură-te că este instalat și activat.");
  throw new Error("MetaMask is not available.");
};

interface AreaCoordinates {
  left: string;
  top: string;
  width: string;
  height: string;
}

interface ImageDimensions {
  displayedWidth: number;
  displayedHeight: number;
  offsetX: number;
  offsetY: number;
}

interface GameState {
  drawersUnlocked: boolean[];
  safeCombinationDigits: { [key: number]: string };
  finalUnlocked: boolean;
}

// Drawer to crypto challenge mapping
const DRAWER_CHALLENGES = {
  1: 'signature',    // Sign message challenge
  2: 'timestamp',    // Timestamp challenge  
  3: 'vote',         // Voting challenge
  4: 'transaction',  // Send secret message challenge
  5: 'donation',     // Symbolic donation challenge
  6: 'swap'          // Token swap challenge
} as const;

// Area coordinates for clickable regions (relative to background image)
const AREA_COORDINATES = {
 area1: { left: '17.1%', top: '59.2%', width: '14.0%', height: '10.5%' },
            area2: { left: '17.2%', top: '68.7%', width: '14.0%', height: '10.2%' },
            area3: { left: '17.3%', top: '78.8%', width: '14.0%', height: '10.1%' },
            area4: { left: '67.8%', top: '59.1%', width: '17.6%', height: '10%' },
            area5: { left: '67.9%', top: '68.5%', width: '17.2%', height: '10.4%' },
            area6: { left: '67.8%', top: '79%', width: '17.2%', height: '10.2%' },
            areaSeif: { left: '60%', top: '32%', width: '18%', height: '22%' }
};

const UnifiedEscapeRoom = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialDefaultState: GameState = {
      drawersUnlocked: Array(6).fill(false) as boolean[],
      safeCombinationDigits: {},
      finalUnlocked: false,
    };
    try {
      const savedStateString = localStorage.getItem('cryptoEscapeRoom');
      if (savedStateString) {
        const parsedState = JSON.parse(savedStateString);
        const loadedState: GameState = { ...initialDefaultState };

        if (
          Array.isArray(parsedState.drawersUnlocked) &&
          parsedState.drawersUnlocked.length === 6 &&
          parsedState.drawersUnlocked.every((u: any) => typeof u === 'boolean')
        ) {
          loadedState.drawersUnlocked = parsedState.drawersUnlocked;
        }

        if (parsedState.safeCombinationDigits && typeof parsedState.safeCombinationDigits === 'object') {
          const digits: { [key: number]: string } = {};
          for (const key in parsedState.safeCombinationDigits) {
            if (Object.prototype.hasOwnProperty.call(parsedState.safeCombinationDigits, key)) {
              digits[Number(key)] = String(parsedState.safeCombinationDigits[key]);
            }
          }
          loadedState.safeCombinationDigits = digits;
        }
        
        if (typeof loadedState.safeCombinationDigits !== 'object' || loadedState.safeCombinationDigits === null) {
            loadedState.safeCombinationDigits = {};
        }

        if (typeof parsedState.finalUnlocked === 'boolean') {
          loadedState.finalUnlocked = parsedState.finalUnlocked;
        }
        
        // Recalculate finalUnlocked based on actual digits collected
        const collectedDigitsCount = Object.keys(loadedState.safeCombinationDigits).filter(key => 
            loadedState.safeCombinationDigits[Number(key)] && 
            loadedState.safeCombinationDigits[Number(key)] !== "_" && 
            loadedState.safeCombinationDigits[Number(key)] !== "?"
        ).length;

        if (loadedState.drawersUnlocked.every(unlocked => unlocked) && collectedDigitsCount === 6) {
            loadedState.finalUnlocked = true;
        } else {
            loadedState.finalUnlocked = false;
        }

        return loadedState;
      }
    } catch (error) {
      console.error("Error loading game state from localStorage:", error);
    }
    return initialDefaultState;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [isTxLoadingModalOpen, setIsTxLoadingModalOpen] = useState(false);
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);
  const [showSecretMessageModal, setShowSecretMessageModal] = useState(false);
  const [showSignMessageModal, setShowSignMessageModal] = useState(false);
  const [showTimestampModal, setShowTimestampModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showSymbolicDonationModal, setShowSymbolicDonationModal] = useState(false);
  const [showSimpleSwapModal, setShowSimpleSwapModal] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showCryptoWalletPage, setShowCryptoWalletPage] = useState(false);
  const [seifVisible, setSeifVisible] = useState(false);
  const [solvedEffect, setSolvedEffect] = useState<number | null>(null);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({
    displayedWidth: 0,
    displayedHeight: 0,
    offsetX: 0,
    offsetY: 0
  });

  const imageContainerRef = useRef<HTMLDivElement>(null);
  // Calculate actual image dimensions and offsets
  useEffect(() => {
    const calculateImageDimensions = () => {
      if (!imageContainerRef.current) return;

      const container = imageContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Create a temporary image to get natural dimensions
      const tempImg = new Image();
      tempImg.onload = () => {
        const imageNaturalWidth = tempImg.naturalWidth;
        const imageNaturalHeight = tempImg.naturalHeight;
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // Calculate the displayed size using contain logic
        const imageAspectRatio = imageNaturalWidth / imageNaturalHeight;
        const containerAspectRatio = containerWidth / containerHeight;
        
        let displayedWidth, displayedHeight, offsetX, offsetY;
        
        if (imageAspectRatio > containerAspectRatio) {
          // Image is wider, fit to container width
          displayedWidth = containerWidth;
          displayedHeight = containerWidth / imageAspectRatio;
          offsetX = 0;
          offsetY = (containerHeight - displayedHeight) / 2;
        } else {
          // Image is taller, fit to container height
          displayedWidth = containerHeight * imageAspectRatio;
          displayedHeight = containerHeight;
          offsetX = (containerWidth - displayedWidth) / 2;
          offsetY = 0;
        }
        
        console.log('Image dimensions calculated:', {
          containerWidth,
          containerHeight,
          imageNaturalWidth,
          imageNaturalHeight,
          displayedWidth,
          displayedHeight,
          offsetX,
          offsetY
        });
        
        setImageDimensions({
          displayedWidth,
          displayedHeight,
          offsetX,
          offsetY
        });
      };
      
      tempImg.src = '/background.gif';
    };

    // Wait a bit for the container to be properly sized
    const timer = setTimeout(() => {
      calculateImageDimensions();
    }, 100);

    // Recalculate on window resize
    const handleResize = () => {
      setTimeout(calculateImageDimensions, 100);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Convert percentage coordinates to pixel coordinates relative to the displayed image
  const convertCoordinatesToPixels = (coords: AreaCoordinates) => {
    const { displayedWidth, displayedHeight, offsetX, offsetY } = imageDimensions;
    
    if (displayedWidth === 0 || displayedHeight === 0) {
      // Fallback to percentage if dimensions not calculated yet
      return coords;
    }
    
    const leftPercent = parseFloat(coords.left) / 100;
    const topPercent = parseFloat(coords.top) / 100;
    const widthPercent = parseFloat(coords.width) / 100;
    const heightPercent = parseFloat(coords.height) / 100;
    
    const leftPx = offsetX + (leftPercent * displayedWidth);
    const topPx = offsetY + (topPercent * displayedHeight);
    const widthPx = widthPercent * displayedWidth;
    const heightPx = heightPercent * displayedHeight;
    
    return {
      left: `${leftPx}px`,
      top: `${topPx}px`,
      width: `${widthPx}px`,
      height: `${heightPx}px`
    };
  };

  useEffect(() => {
    localStorage.setItem('cryptoEscapeRoom', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    const fetchInitialAccount = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
          if (accounts.length > 0) {
            setUserAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error fetching initial accounts:", error);
        }
      }
    };
    fetchInitialAccount();

    const handleAccountsChanged = (accounts: string[]) => {
      setUserAddress(accounts.length > 0 ? accounts[0] : '');
    };

    if (window.ethereum && window.ethereum.on) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    // Show safe when all drawers are unlocked
    if (gameState.drawersUnlocked.every(unlocked => unlocked) && !seifVisible) {
      setTimeout(() => {
        setSeifVisible(true);
        playVictorySound();
      }, 1000);
    }
  }, [gameState.drawersUnlocked, seifVisible]);

  const checkMetaMask = () => {
    if (!window.ethereum) {
      alert("MetaMask nu este instalat! Te rog să îl instalezi și să îl configurezi pentru rețeaua Sepolia.");
      return false;
    }
    if (!userAddress) {
      alert("Te rog să conectezi portofelul MetaMask.");
      return false;
    }
    return true;
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert("MetaMask nu este instalat! Te rog să îl instalezi și să îl configurezi pentru rețeaua Sepolia.");
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];
      
      if (accounts.length > 0) {
        setUserAddress(accounts[0]);
        console.log('MetaMask conectat cu succes:', accounts[0]);
      }
    } catch (error: any) {
      console.error('Eroare la conectarea MetaMask:', error);
      if (error.code === 4001) {
        alert("Conectarea la MetaMask a fost anulată de utilizator.");
      } else {
        alert("❌ Eroare la conectarea cu MetaMask. Încearcă din nou.");
      }
    }
  };

  const unlockDrawer = (drawerIndex: number, digit: string) => {
    setGameState(prev => {
      const newDrawersUnlocked = [...prev.drawersUnlocked];
      const newSafeCombinationDigits = { ...prev.safeCombinationDigits };
      
      newDrawersUnlocked[drawerIndex] = true;
      newSafeCombinationDigits[drawerIndex] = digit;
      
      const allUnlocked = newDrawersUnlocked.every(unlocked => unlocked);
      const allDigitsCollected = Object.keys(newSafeCombinationDigits).length === 6;
      
      return {
        ...prev,
        drawersUnlocked: newDrawersUnlocked,
        safeCombinationDigits: newSafeCombinationDigits,
        finalUnlocked: allUnlocked && allDigitsCollected
      };
    });
    
    // Show solved effect
    setSolvedEffect(drawerIndex + 1);
    setTimeout(() => setSolvedEffect(null), 1000);
    
    playClickSound();
  };

  const resetGame = () => {
    if (confirm("Ești sigur că vrei să resetezi progresul? Toate provocările vor trebui refăcute.")) {
      setGameState({
        drawersUnlocked: Array(6).fill(false) as boolean[],
        safeCombinationDigits: {},
        finalUnlocked: false,
      });
      setSeifVisible(false);
      localStorage.removeItem('cryptoEscapeRoom');
    }
  };

  const playClickSound = () => {
    try {
      const audio = new Audio('/sounds/click.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors if sound fails
    } catch (error) {
      // Ignore audio errors
    }
  };

  const playVictorySound = () => {
    try {
      const audio = new Audio('/sounds/victory.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (error) {
      // Ignore audio errors
    }
  };

  const showMainTxLoadingModal = (txHash: string) => {
    setCurrentTxHash(txHash);
    setIsTxLoadingModalOpen(true);
  };
  const hideMainTxLoadingModal = () => {
    setIsTxLoadingModalOpen(false);
    setCurrentTxHash(null);
  };

  // Challenge handlers
  const handleSignMessage = async () => {
    if (!checkMetaMask()) return;
    setIsLoading(true);
    try {
      const message = "Susțin revoluția cypherpunk și libertatea financiară!";
      
      // Convertește mesajul în hex corect pentru MetaMask
      const hexMessage = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message));
      
      // Folosește MetaMask direct pentru semnătura
      const signature = await window.ethereum!.request({
        method: 'personal_sign',
        params: [hexMessage, userAddress]
      });
      
      setShowSignMessageModal(false);
      unlockDrawer(0, "C");
      alert(`🎉 Sertar 1 deblocat! Ai primit cifra 'C' pentru seif!
      
✍️ Mesajul a fost semnat cu succes!
🔗 Semnătura: ${signature.slice(0, 20)}...`);
    } catch (error: any) {
      console.error('Eroare semnare mesaj:', error);
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        alert("Semnarea a fost anulată de utilizator.");
      } else {
        alert("❌ Eroare la semnarea mesajului. Încearcă din nou.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateTimestamp = async () => {
    if (!checkMetaMask()) return;
    setIsLoading(true);
    try {
      const timestampData = `Cypherpunk-${Date.now()}`;
      const signer = getSigner();
      
      // Folosește burn address pentru a putea include data
      const burnAddress = "0x000000000000000000000000000000000000dEaD";
      
      const tx = await signer.sendTransaction({
        to: burnAddress,
        value: ethers.utils.parseEther("0.000001"), // Micro amount
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(timestampData)),
        gasLimit: 50000
      });
      showMainTxLoadingModal(tx.hash);
      await tx.wait();
      setShowTimestampModal(false);
      unlockDrawer(1, "Y");
      alert(`🎉 Sertar 2 deblocat! Ai primit cifra 'Y' pentru seif!
      
⏰ Timestamp salvat pe blockchain!
📅 Data: ${new Date().toLocaleString('ro-RO')}
🔗 TX Hash: ${tx.hash.slice(0, 10)}...`);
    } catch (error) {
      console.error('Eroare timestamp:', error);
      alert("❌ Eroare la crearea timestamp-ului. Verifică balanța și rețeaua.");
    } finally {
      hideMainTxLoadingModal();
      setIsLoading(false);
    }
  };
  const handleVote = async (candidate: string) => {
    if (!checkMetaMask()) return;
    setIsLoading(true);
    try {
      const signer = getSigner();
      const voteAmount = ethers.utils.parseEther("0.000001"); // Micro amount pentru siguranță
      const voteAddress = "0x000000000000000000000000000000000000dEaD"; // Burn address sigur
      const tx = await signer.sendTransaction({
        to: voteAddress,
        value: voteAmount,
        gasLimit: 21000
      });
      showMainTxLoadingModal(tx.hash);
      await tx.wait();
      setShowVoteModal(false);
      unlockDrawer(2, "P");
      alert(`🎉 Sertar 3 deblocat! Ai primit cifra 'P' pentru seif!
      
🗳️ Votul pentru "${candidate}" a fost înregistrat!
💰 Ai votat cu ${ethers.utils.formatEther(voteAmount)} ETH
🔗 TX Hash: ${tx.hash.slice(0, 10)}...`);
    } catch (error) {
      console.error('Eroare vot:', error);
      alert("❌ Eroare la înregistrarea votului. Verifică balanța și rețeaua.");
    } finally {
      hideMainTxLoadingModal();
      setIsLoading(false);
    }
  };
  const handleSendSecretMessage = async (message: string) => {
    if (!checkMetaMask()) return;
    setIsLoading(true);
    try {
      const signer = getSigner();
      
      // Folosește burn address pentru a putea include data
      const burnAddress = "0x000000000000000000000000000000000000dEaD";
      
      const tx = await signer.sendTransaction({
        to: burnAddress,
        value: ethers.utils.parseEther("0.000001"), // Micro amount
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message)),
        gasLimit: 50000
      });
      showMainTxLoadingModal(tx.hash);
      await tx.wait();
      setShowSecretMessageModal(false);
      unlockDrawer(3, "H");
      alert(`🎉 Sertar 4 deblocat! Ai primit cifra 'H' pentru seif!
      
📨 Mesajul secret "${message}" a fost trimis pe blockchain!
🔗 TX Hash: ${tx.hash.slice(0, 10)}...`);
    } catch (error: any) {
      console.error('Eroare trimitere mesaj:', error);
      let detailedMessage = "Verifică balanța și rețeaua (Sepolia), apoi încearcă din nou.";
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        detailedMessage = "Tranzacția a fost respinsă de utilizator.";
      }
      alert(`❌ Eroare la trimiterea mesajului pe blockchain.\n${detailedMessage}`);
    } finally {
      hideMainTxLoadingModal();
      setIsLoading(false);
    }
  };

  const handleSubscribeToMailingList = async () => {
    if (!checkMetaMask()) return;
    setIsLoading(true);
    try {
      const signer = getSigner();
      const transferAmount = ethers.utils.parseEther("0.0001");
      const recipientAddress = "0x000000000000000000000000000000000000dEaD";
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: transferAmount,
        gasLimit: 21000
      });
      showMainTxLoadingModal(tx.hash);
      await tx.wait();
      setShowSymbolicDonationModal(false);
      unlockDrawer(4, "E");
      alert(`🎉 Sertar 5 deblocat! Ai primit cifra 'E' pentru seif!
      
💸 Donație simbolică pentru lista de mailing realizată cu succes!
📧 Te-ai abonat cu succes la lista criptată!
🔗 TX Hash: ${tx.hash.slice(0, 10)}...`);
    } catch (error) {
      console.error('Eroare transfer:', error);
      alert("❌ Eroare la donația simbolică. Verifică balanța și rețeaua.");
    } finally {
      hideMainTxLoadingModal();
      setIsLoading(false);
    }
  };

  const handleSimpleSwapSuccess = (txHash: string) => {
    hideMainTxLoadingModal();
    unlockDrawer(5, "R");
    setShowSimpleSwapModal(false);
    alert(`🎉 Sertar 6 deblocat! Ai primit cifra 'R' pentru seif!
    
🦄 Swap ETH → Token (Simulat) completat cu succes!
🔗 TX Hash: ${txHash.slice(0, 10)}...`);
  };

  const handleSimpleSwapError = (errorMessage: string) => {
    hideMainTxLoadingModal();
    alert(`❌ Eroare la Swap: ${errorMessage}`);
  };

  const handleSimpleSwapTxSent = (txHash: string) => {
    showMainTxLoadingModal(txHash);
  };

  const handleAreaClick = (areaNumber: number) => {
    if (gameState.drawersUnlocked[areaNumber - 1]) {
      return; // Already unlocked
    }

    const challengeType = DRAWER_CHALLENGES[areaNumber as keyof typeof DRAWER_CHALLENGES];
    
    switch (challengeType) {
      case 'signature':
        setShowSignMessageModal(true);
        break;
      case 'timestamp':
        setShowTimestampModal(true);
        break;
      case 'vote':
        setShowVoteModal(true);
        break;
      case 'transaction':
        setShowSecretMessageModal(true);
        break;
      case 'donation':
        setShowSymbolicDonationModal(true);
        break;
      case 'swap':
        setShowSimpleSwapModal(true);
        break;
    }
  };
  const handleSeifClick = () => {
    if (gameState.finalUnlocked) {
      // Deschide pagina crypto wallet în loc de alert
      setShowCryptoWalletPage(true);
      playVictorySound();
    }
  };

  const revealSafeCombination = () => {
    let combination = "";
    for (let i = 0; i < 6; i++) {
      combination += gameState.safeCombinationDigits[i] || "_";
    }
    return combination;
  };

  const getChallengeTitle = (areaNumber: number) => {
    const challengeType = DRAWER_CHALLENGES[areaNumber as keyof typeof DRAWER_CHALLENGES];
    const challengeTitles = {
      signature: 'Semnătura Cypherpunk',
      timestamp: 'Timestamp Blockchain',
      vote: 'Vot Descentralizat',
      transaction: 'Mesajul Secret',
      donation: 'Abonament Lista Criptată',
      swap: 'Swap ETH → Token'
    };
    return challengeTitles[challengeType] || `Provocarea ${areaNumber}`;
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Main Game Container */}
      <div ref={imageContainerRef} className="relative w-full h-full">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat bg-contain"
          style={{ 
            backgroundImage: "url('/background.gif')",
            backgroundSize: 'contain',
            backgroundPosition: 'center'
          }}
        />

        {/* Solved Images Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <img
              key={num}
              src={`/solved_${num}.png`}
              alt={`Solved ${num}`}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                gameState.drawersUnlocked[num - 1] ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          
          {/* Safe Image */}
          <img
            src="/solved_seif.png"
            alt="Solved Seif"
            className={`absolute inset-0 w-full h-full object-contain transition-none ${
              seifVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>        {/* Clickable Areas */}
        {[1, 2, 3, 4, 5, 6].map(num => {
          const areaKey = `area${num}` as keyof typeof AREA_COORDINATES;
          const coords = AREA_COORDINATES[areaKey];
          const isUnlocked = gameState.drawersUnlocked[num - 1];
          const isLeft = num <= 3;
          
          const pixelCoords = convertCoordinatesToPixels(coords);
          
          return (
            <div
              key={num}
              className={`absolute cursor-pointer transition-all duration-300 border-2 rounded-lg z-10 ${
                isUnlocked 
                  ? 'opacity-0 pointer-events-none' 
                  : `border-cyan-400/50 hover:border-cyan-400 hover:shadow-lg ${
                      isLeft 
                        ? 'bg-blue-400/10 hover:bg-blue-400/20 hover:shadow-blue-400/50' 
                        : 'bg-purple-400/10 hover:bg-purple-400/20 hover:shadow-purple-400/50'
                    }`
              }`}
              style={{
                left: pixelCoords.left,
                top: pixelCoords.top,
                width: pixelCoords.width,
                height: pixelCoords.height
              }}
              onClick={() => handleAreaClick(num)}
              title={!isUnlocked ? getChallengeTitle(num) : ''}
            />
          );
        })}        {/* Safe Clickable Area */}
        {seifVisible && (
          <div
            className="absolute cursor-pointer transition-all duration-300 border-2 border-yellow-400/50 rounded-lg z-10 bg-yellow-400/10 hover:border-yellow-400 hover:bg-yellow-400/20 hover:shadow-lg hover:shadow-yellow-400/60"
            style={convertCoordinatesToPixels(AREA_COORDINATES.areaSeif)}
            onClick={handleSeifClick}
            title="Seiful - Clicește pentru a deschide!"
          />
        )}

        {/* Solved Effect */}
        {solvedEffect && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="text-6xl font-bold text-green-400 animate-bounce bg-black/50 px-8 py-4 rounded-lg">
              ✅ Sertar {solvedEffect} Deblocat!
            </div>
          </div>
        )}

        {/* Game UI Overlay */}
        <div className="absolute top-4 left-4 right-4 z-20">
          {/* Controls */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={resetGame}
              className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors backdrop-blur-sm"
            >
              🔄 Resetează
            </button>
          </div>
        </div>        {/* Instructions for empty areas */}
        {!userAddress && (
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="bg-orange-600/80 backdrop-blur-sm rounded-lg p-4 border border-orange-400 text-center">
              <p className="text-white mb-3">⚠️ Conectează-te cu MetaMask și asigură-te că ești pe rețeaua Sepolia pentru a începe!</p>
              <button
                onClick={connectMetaMask}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors font-semibold"
              >
                🦊 Conectează MetaMask
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <SignMessageModal
        isOpen={showSignMessageModal}
        onClose={() => setShowSignMessageModal(false)}
        onSignMessage={handleSignMessage}
        isLoading={isLoading}
      />

      <TimestampModal
        isOpen={showTimestampModal}
        onClose={() => setShowTimestampModal(false)}
        onCreateTimestamp={handleCreateTimestamp}
        isLoading={isLoading}
      />

      <VoteModal
        isOpen={showVoteModal}
        onClose={() => setShowVoteModal(false)}
        onVote={handleVote}
        isLoading={isLoading}
      />

      <SendSecretMessageModal
        isOpen={showSecretMessageModal}
        onClose={() => setShowSecretMessageModal(false)}
        onSendMessage={handleSendSecretMessage}
        isLoading={isLoading}
      />

      <SymbolicDonationModal
        isOpen={showSymbolicDonationModal}
        onClose={() => setShowSymbolicDonationModal(false)}
        onSubscribe={handleSubscribeToMailingList}
        isLoading={isLoading}
      />

      <SimpleSwapModal
        isOpen={showSimpleSwapModal}
        onClose={() => {
          setShowSimpleSwapModal(false);
          hideMainTxLoadingModal();
        }}
        onSwapSuccess={handleSimpleSwapSuccess}
        onError={handleSimpleSwapError}
        onTxSent={handleSimpleSwapTxSent}
      />

      <MetaMaskSetupGuide
        isOpen={showSetupGuide}
        onClose={() => setShowSetupGuide(false)}
      />      <TransactionLoadingModal
        isOpen={isTxLoadingModalOpen}      transactionHash={currentTxHash}
      />

      {/* Crypto Wallet Page Modal */}
      <CryptoWalletPage 
        isOpen={showCryptoWalletPage}
        onClose={() => setShowCryptoWalletPage(false)}
      />
    </div>
  );
};

export default UnifiedEscapeRoom;
