import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  Shield, 
  FileSignature, 
  Clock, 
  Vote, 
  Puzzle, 
  Send, 
  ArrowLeftRight,
  CheckCircle,
  Lock,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import TransactionLoadingModal from './components/TransactionLoadingModal';
import SendSecretMessageModal from './components/SendSecretMessageModal';
import SignMessageModal from './components/SignMessageModal';
import TimestampModal from './components/TimestampModal';
import VoteModal from './components/VoteModal';
import SymbolicDonationModal from './components/SymbolicDonationModal';
import SimpleSwapModal from './components/SimpleSwapModal';
import MetaMaskSetupGuide from './components/MetaMaskSetupGuide';

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

interface GameState {
  drawersUnlocked: boolean[];
  safeCombinationDigits: { [key: number]: string };
  finalUnlocked: boolean;
}

const EscapeRoom = () => {
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
              digits[Number(key)] = String(parsedState.safeCombinationDigits[key]); // Ensure string value
            }
          }
          loadedState.safeCombinationDigits = digits;
        } else if (parsedState.seedWords && typeof parsedState.seedWords === 'object') {
          // Migration: Keep drawers, reset digits
          loadedState.safeCombinationDigits = {}; 
          // If drawers were unlocked, mark digits as needing to be re-earned or show placeholder
          // This logic can be refined based on desired migration behavior.
          // For now, just resetting digits means user has to re-do challenges for digits.
        }
        
        if (typeof loadedState.safeCombinationDigits !== 'object' || loadedState.safeCombinationDigits === null) {
            loadedState.safeCombinationDigits = {};
        }

        if (typeof parsedState.finalUnlocked === 'boolean') {
          loadedState.finalUnlocked = parsedState.finalUnlocked;
        }
        
        // Recalculate finalUnlocked based on actual digits collected, not just drawer status
        const collectedDigitsCount = Object.keys(loadedState.safeCombinationDigits).filter(key => 
            loadedState.safeCombinationDigits[Number(key)] && loadedState.safeCombinationDigits[Number(key)] !== "_" && loadedState.safeCombinationDigits[Number(key)] !== "?"
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
  });  const [isLoading, setIsLoading] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [isTxLoadingModalOpen, setIsTxLoadingModalOpen] = useState(false);  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);  const [showSecretMessageModal, setShowSecretMessageModal] = useState(false);  const [showSignMessageModal, setShowSignMessageModal] = useState(false);
  const [showTimestampModal, setShowTimestampModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);  const [showSymbolicDonationModal, setShowSymbolicDonationModal] = useState(false);
  const [showSimpleSwapModal, setShowSimpleSwapModal] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

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
      // Potentially reset game or parts of it if account changes, based on requirements
      // For now, just updating the address.
      // resetGame(); // Example: uncomment to reset game on account change
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
    if (gameState.finalUnlocked) {
      const combination = revealSafeCombination();
      const allDigitsPresent = Object.keys(gameState.safeCombinationDigits).length === 6 && 
                               Object.values(gameState.safeCombinationDigits).every(d => d && d !== "_" && d !== "?");
      if (allDigitsPresent) {
        alert(`🎉 SEIF DESCHIS! 🎉\n\nCombinația seifului este: ${combination}\n\nFolosește-o cu înțelepciune!`);
      } else {
         alert(`🎉 Felicitări! Toate sertarele sunt deblocate! 🎉\n\nCombinația parțială a seifului este: ${combination}\n\nUnele cifre par să lipsească. Completează din nou provocările dacă este necesar.`);
      }
    }
  }, [gameState.finalUnlocked, gameState.safeCombinationDigits]); // Added gameState.safeCombinationDigits dependency

  const checkMetaMask = () => {
    if (!window.ethereum || !userAddress) {
      alert("MetaMask nu este conectat sau nu este selectată nicio adresă. Conectează-te și încearcă din nou.");
      return false;
    }
    return true;
  };

  const resetGame = () => {
    const freshState: GameState = {
      drawersUnlocked: Array(6).fill(false) as boolean[],
      safeCombinationDigits: {},
      finalUnlocked: false,
    };
    setGameState(freshState);
    alert("🔄 Jocul a fost resetat! Poți începe din nou cu adresa curentă.");
  };

  const unlockDrawer = (drawerIndex: number, digit: string) => {
    setGameState(prevGameState => {
      const newDigits = { ...prevGameState.safeCombinationDigits, [drawerIndex]: digit };
      const newDrawersUnlocked = [...prevGameState.drawersUnlocked];
      newDrawersUnlocked[drawerIndex] = true;
      
      const allDigitsCollected = Object.keys(newDigits).length === 6 && 
                                 Object.values(newDigits).every(d => d && d !== "_" && d !== "?");
      const allDrawersUnlocked = newDrawersUnlocked.every(unlocked => unlocked);

      return {
        ...prevGameState,
        drawersUnlocked: newDrawersUnlocked,
        safeCombinationDigits: newDigits,
        finalUnlocked: allDrawersUnlocked && allDigitsCollected,
      };
    });
  };

  const showMainTxLoadingModal = (txHash: string) => {
    setCurrentTxHash(txHash);
    setIsTxLoadingModalOpen(true);
  };
  const hideMainTxLoadingModal = () => {
    setIsTxLoadingModalOpen(false);
    setCurrentTxHash(null);
  };

  // Handler pentru semnarea mesajului
  const handleSignMessage = async () => {
    if (!checkMetaMask()) return;
    try {
      const message = "Susțin revoluția cypherpunk și libertatea financiară!";
      const signature = await window.ethereum!.request({
        method: 'personal_sign',
        params: [message, userAddress]
      });
      if (signature) {
        unlockDrawer(0, "3");
        setShowSignMessageModal(false);
        alert("🎉 Sertar 1 deblocat! Ai primit cifra '3' pentru seif!");
      }
    } catch (error) {
      console.error('Eroare semnare:', error);
      alert("❌ Eroare la semnarea mesajului. Asigură-te că ai selectat contul corect în MetaMask.");
    }
  };

  const challenge1_SignMessage = async () => {
    setShowSignMessageModal(true);
  };  // Handler pentru TimestampModal
  const handleCreateTimestamp = async () => {
    if (!checkMetaMask()) return;
    setIsLoading(true);
    try {
      const timestampData = `Cypherpunk ${Date.now()}`;
      const signer = getSigner();
      const burnAddress = "0x000000000000000000000000000000000000dEaD";
      const tx = await signer.sendTransaction({
        to: burnAddress, 
        value: ethers.utils.parseEther("0.000001"), 
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(timestampData)),
        gasLimit: 50000
      });
      showMainTxLoadingModal(tx.hash);
      await tx.wait();
      unlockDrawer(1, "7");
      setShowTimestampModal(false);
      alert(`🎉 Sertar 2 deblocat! Ai primit cifra '7' pentru seif!
      
📝 Timestamp înregistrat pe blockchain!
🔗 TX Hash: ${tx.hash.slice(0, 10)}...`);
    } catch (error) {      console.error('Eroare timestamp:', error);
      alert("❌ Eroare la crearea timestamp-ului. Verifică balanța ETH și rețeaua (Sepolia).");
    } finally {
      hideMainTxLoadingModal();
      setIsLoading(false);
    }
  };

  // Handler pentru VoteModal
  const handleVote = async (voteType: 'NU' | 'DA') => {
    if (!checkMetaMask()) return;
    setIsLoading(true);
    try {
      const signer = getSigner();
      const voteAmount = ethers.utils.parseEther("0.000001");
      
      // Verifică balanța înainte de tranzacție
      const balance = await signer.getBalance();
      const estimatedGasPrice = ethers.utils.parseUnits("20", "gwei");
      const estimatedGasCost = estimatedGasPrice.mul(21000);
      const totalCost = voteAmount.add(estimatedGasCost);
      
      if (balance.lt(totalCost)) {
        alert(`❌ Fonduri insuficiente! 
        
Ai nevoie de cel puțin ${ethers.utils.formatEther(totalCost)} ETH pentru:
• Vot: ${ethers.utils.formatEther(voteAmount)} ETH  
• Gas: ~${ethers.utils.formatEther(estimatedGasCost)} ETH
• Total: ~${ethers.utils.formatEther(totalCost)} ETH

Balanța ta: ${ethers.utils.formatEther(balance)} ETH

💡 Obține ETH de test de la: https://sepoliafaucet.com`);
        return;
      }      // Adresele pentru votare
      const voteAddresses = {
        NU: '0x742d35Cc6634C0532925a3b8D5c59009e0c20bba',  // Adresa validă pentru NU
        DA: '0x000000000000000000000000000000000000dEaD'  // Burn address pentru DA
      };
      
      const votingAddress = voteAddresses[voteType];
      
      // Debug logging
      console.log('Vot Type:', voteType);
      console.log('Voting Address:', votingAddress);
      console.log('Vote Amount:', ethers.utils.formatEther(voteAmount));
        // Verifică dacă adresa este validă
      if (!ethers.utils.isAddress(votingAddress)) {
        alert(`❌ Adresa de votare nu este validă: ${votingAddress}`);
        return;
      }
      
      console.log('Încep tranzacția de votare...');
      console.log('Signer:', await signer.getAddress());
      
      const tx = await signer.sendTransaction({
        to: votingAddress,
        value: voteAmount,
        gasLimit: 21000
      });
      
      console.log('Tranzacție trimisă:', tx.hash);
      
      showMainTxLoadingModal(tx.hash);
      await tx.wait();
      setShowVoteModal(false);
      
      // Doar votul DA deschide sertarul
      if (voteType === 'DA') {
        unlockDrawer(2, "1");
        alert(`🎉 Sertar 3 deblocat! Votul tău "${voteType}" pentru descentralizare a fost înregistrat! Ai primit cifra '1' pentru seif!
        
🗳️ Votul a fost trimis la: ${votingAddress.slice(0, 10)}...
🔗 TX Hash: ${tx.hash.slice(0, 10)}...`);
      } else {
        alert(`✅ Votul tău "${voteType}" a fost înregistrat pe blockchain!
        
🗳️ Votul a fost trimis la: ${votingAddress.slice(0, 10)}...
🔗 TX Hash: ${tx.hash.slice(0, 10)}...
        
❌ Doar votul "DA" deschide sertarul. Poți încerca din nou!`);
      }
    } catch (error) {
      console.error('Eroare vot:', error);
      alert("❌ Eroare la votare. Verifică balanța ETH și rețeaua (Sepolia).");
    } finally {
      hideMainTxLoadingModal();
      setIsLoading(false);
    }
  };

  // Challenge 2: Blockchain Timestamp
  const challenge2_Timestamp = () => {
    if (!checkMetaMask()) return;
    // Open the educational modal instead of direct execution
    setShowTimestampModal(true);
  };  // Challenge 3: Vote with LINK
  const challenge3_Vote = () => {
    if (!checkMetaMask()) return;
    // Open the educational modal instead of direct execution
    setShowVoteModal(true);
  };const challenge4_SendMessageToBlockchain = async () => {
    if (!checkMetaMask()) return;
    // Deschide modal-ul educațional pentru mesaje secrete
    setShowSecretMessageModal(true);
  };
  // Handler pentru modal-ul de mesaje secrete
  const handleSendSecretMessage = async (message: string) => {
    if (!checkMetaMask()) return;
    setIsLoading(true);
    try {
      const signer = getSigner(); 
      const transactionValue = ethers.utils.parseEther("0.000001"); 
      const burnAddress = "0x000000000000000000000000000000000000dEaD";
      const txParams = {
        to: burnAddress,
        value: transactionValue,
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message)),
        gasLimit: 60000 
      };
      const tx = await signer.sendTransaction(txParams);
      showMainTxLoadingModal(tx.hash);
      await tx.wait();
      unlockDrawer(3, "9");
      setShowSecretMessageModal(false);
      alert(`🎉 Sertar 4 deblocat! Ai primit cifra '9' pentru seif!
      
📜 Mesajul "${message}" a fost trimis pe blockchain!
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
  };  // Challenge 5: Symbolic Donation (Mailing List Subscription)
  const challenge5_Transfer = () => {
    setShowSymbolicDonationModal(true);
  };

  const handleSubscribeToMailingList = async () => {
    if (!checkMetaMask()) return;
    setIsLoading(true);
    try {
      const signer = getSigner();
      const transferAmount = ethers.utils.parseEther("0.0001"); // Reduced amount for testing
      const recipientAddress = "0x000000000000000000000000000000000000dEaD"; // Mock recipient
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: transferAmount,
        gasLimit: 21000
      });
      showMainTxLoadingModal(tx.hash);
      await tx.wait();
      setShowSymbolicDonationModal(false);
      unlockDrawer(4, "4");
      alert(`🎉 Sertar 5 deblocat! Ai primit cifra '4' pentru seif!
      
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

  // Challenge 6: Deschide modalul pentru swap simplu
  const challenge6_OpenSimpleSwapModal = () => {
    if (!checkMetaMask()) return;
    setShowSimpleSwapModal(true);
  };

  // Handler pentru succesul swap-ului din SimpleSwapModal
  const handleSimpleSwapSuccess = (txHash: string) => {
    hideMainTxLoadingModal(); // Ascunde modalul general de încărcare dacă era vizibil
    unlockDrawer(5, "8");
    setShowSimpleSwapModal(false);
    alert(`🎉 Sertar 6 deblocat! Ai primit cifra '8' pentru seif!\n    \n🦄 Swap ETH → Token (Simulat) completat cu succes!\n🔗 TX Hash: ${txHash.slice(0, 10)}...`);
  };

  // Handler pentru eroare în SimpleSwapModal
  const handleSimpleSwapError = (errorMessage: string) => {
    hideMainTxLoadingModal(); // Ascunde modalul general de încărcare
    alert(`❌ Eroare la Swap: ${errorMessage}`);
    // Considerăm să lăsăm SimpleSwapModal deschis pentru ca utilizatorul să poată reîncerca sau închide manual.
  };

  // Handler pentru când tranzacția de swap este trimisă (din SimpleSwapModal)
  const handleSimpleSwapTxSent = (txHash: string) => {
    showMainTxLoadingModal(txHash); // Afișează modalul general de încărcare
    // Nu închide SimpleSwapModal aici, lasă-l deschis până la confirmare/eroare
  };

  /*
  const challenge6_Swap = async () => {
    if (!checkMetaMask()) return;
    setIsLoading(true);
    
    try {
      const signer = getSigner();
      const swapAmount = ethers.utils.parseEther("0.001"); // 0.001 ETH
      const uniTokenAddress = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"; // Adresă reală UNI pe Mainnet, dar folosim Sepolia
      
      const tx = await signer.sendTransaction({
        to: uniTokenAddress, // Simulează trimiterea către un contract de swap sau token
        value: swapAmount,
        gasLimit: 21000 // Gas limit standard pentru transfer ETH
      });
      
      showMainTxLoadingModal(tx.hash);
      await tx.wait();
      
      unlockDrawer(5, "8");
      alert(`🎉 Sertar 6 deblocat! Ai primit cifra '8' pentru seif!
    
🦄 Swap ETH → UNI completat cu succes!
💰 Ai "schimbat" ${ethers.utils.formatEther(swapAmount)} ETH
🔗 TX Hash: ${tx.hash.slice(0, 10)}...`);
      
    } catch (error: any) {
      console.error('Eroare swap:', error);
      alert("❌ Eroare la swap. Verifică balanța ETH și rețeaua (Sepolia).");
    } finally {
      hideMainTxLoadingModal();
      setIsLoading(false);
    }
  };
  */

  const challenges = [
    { id: 1, title: "Semnătura Cypherpunk", description: "Semnează manifestul revoluției digitale", icon: FileSignature, action: challenge1_SignMessage, difficulty: "Ușor", reward: "O cifră pentru seif" },
    { id: 2, title: "Timestamping Blockchain", description: "Înregistrează momentul pe blockchain", icon: Clock, action: challenge2_Timestamp, difficulty: "Ușor", reward: "O cifră pentru seif" },
    { id: 3, title: "Vot Descentralizat (cu ETH)", description: "Votează simbolic trimițând 0.0001 ETH", icon: Vote, action: challenge3_Vote, difficulty: "Mediu", reward: "O cifră pentru seif" },
    { id: 4, title: "Mesajul Secret", description: "Trimite cuvântul 'descentralizare' pe blockchain", icon: Puzzle, action: challenge4_SendMessageToBlockchain, difficulty: "Mediu", reward: "O cifră pentru seif" },
    { id: 5, title: "Abonament Lista Criptată", description: "Donează simbolic pentru abonare la lista de mailing criptată", icon: Send, action: challenge5_Transfer, difficulty: "Ușor", reward: "O cifră pentru seif" },
    { id: 6, title: "Swap ETH → Token (Simplu)", description: "Realizează un swap simulat ETH pentru un token ERC20.", icon: ArrowLeftRight, action: challenge6_OpenSimpleSwapModal, difficulty: "Mediu", reward: "O cifră pentru seif" } // Actualizat aici
  ];

  const revealSafeCombination = () => {
    let combination = "";
    for (let i = 0; i < 6; i++) {
      combination += gameState.safeCombinationDigits[i] || "_";
    }
    return combination;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <Shield className="h-20 w-20 text-purple-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Camera Secretă Cypherpunk
          </h1>
          <p className="text-gray-300 text-xl mb-6">
            Rezolvă 6 provocări blockchain pentru a descoperi combinația seifului.
          </p>
          {userAddress && (
            <div className="mt-4 bg-gray-800 bg-opacity-50 rounded-lg p-3 inline-block shadow-md">
              <p className="text-blue-300 text-sm">
                👤 Conectat ca: {`${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`}
              </p>
            </div>
          )}          <div className="mt-6 flex justify-center items-center gap-4 flex-wrap">
            <button
              onClick={resetGame}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 text-sm"
            >
              🔄 Resetează Progresul
            </button>
            <button
              onClick={() => setShowSetupGuide(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 text-sm flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Ghid Configurare MetaMask
            </button>
            <button
              onClick={() => window.open('/interactive-escape.html', '_blank')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50 text-sm flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Pagina Interactivă
            </button>
          </div>
        </header>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {challenges.map((challenge, index) => {
            const Icon = challenge.icon;
            const isUnlocked = gameState.drawersUnlocked[index];
            const digitObtained = gameState.safeCombinationDigits[index];
            
            return (
              <div 
                key={challenge.id}
                className={`relative bg-gray-800 bg-opacity-70 rounded-xl p-6 border-2 transition-all duration-300 group hover:shadow-2xl 
                  ${isUnlocked 
                    ? 'border-green-500 shadow-lg shadow-green-500/40' 
                    : 'border-gray-700 hover:border-purple-500 hover:shadow-purple-500/30'
                }`}
              >
                {isUnlocked && (
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-lg">
                    <CheckCircle size={20} />
                  </div>
                )}
                {!isUnlocked && userAddress && (
                    <div className="absolute -top-3 -right-3 bg-gray-600 text-white p-2 rounded-full shadow-md">
                        <Lock size={20} />
                    </div>
                )}

                <Icon className={`h-10 w-10 mb-4 ${isUnlocked ? 'text-green-400' : 'text-purple-400 group-hover:text-purple-300'} transition-colors`} />
                <h3 className="text-xl font-semibold text-white mb-2 h-14">{challenge.title}</h3>
                <p className="text-gray-300 text-sm mb-4 h-16 overflow-hidden">{challenge.description}</p>
                
                <div className="flex justify-between items-center mb-5 text-xs">
                  <span className={`px-3 py-1 rounded-full font-medium text-white shadow-sm ${ 
                    challenge.difficulty === "Ușor" ? "bg-blue-600" :
                    challenge.difficulty === "Mediu" ? "bg-yellow-600" : "bg-red-600"
                  }`}>{challenge.difficulty}</span>
                  <span className="text-purple-300 font-medium">🎁 {challenge.reward}</span>
                </div>

                {!isUnlocked ? (                  <button
                    onClick={challenge.action}
                    disabled={isLoading || !userAddress}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    {isLoading ? 'Se procesează...' : 'Începe Provocarea'}
                  </button>
                ) : (
                  <div className="mt-2 text-center bg-green-800 bg-opacity-50 border border-green-600 p-4 rounded-lg">
                    <p className="text-sm text-green-300">Cifră obținută pentru seif:</p>
                    <p className="text-4xl font-bold text-green-200 tracking-wider mt-1">{digitObtained || "🔒"}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final Safe Combination Display */}
        {gameState.finalUnlocked && (
          <section className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-xl p-8 border-2 border-yellow-400 shadow-2xl shadow-orange-500/60 mb-12">
            <div className="text-center">
              <Shield className="h-20 w-20 text-yellow-200 mx-auto mb-5 animate-bounce" />
              <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                🎉 Felicitări, Cypherpunk! 🎉
              </h2>
              <p className="text-yellow-100 mb-6 text-xl">
                Ai demonstrat măiestrie și ai deblocat toate mecanismele.
              </p>
              <p className="text-white mb-3 text-2xl">Combinația finală a seifului este:</p>
              <div className="bg-black bg-opacity-75 rounded-lg p-6 mb-6 inline-block shadow-inner border border-gray-700">
                <p className="text-yellow-300 text-6xl font-mono tracking-widest break-all animate-pulse">
                  {revealSafeCombination()}
                </p>
              </div>
              <p className="text-gray-300 text-md">Folosește această combinație cu înțelepciune.</p>
            </div>
          </section>
        )}        {/* Help/Info Section */}
        <section className="bg-gray-800 bg-opacity-50 rounded-xl p-6 mb-8 border border-gray-700">
            <h3 className="text-xl font-semibold text-purple-300 mb-3">Informații Utile</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                <li>Acest escape room funcționează pe rețeaua de testare <strong className="text-purple-300">Sepolia</strong>.</li>
                <li>Vei avea nevoie de ETH pe Sepolia pentru a plăti taxele de gaz (gas fees). Poți obține ETH gratuit de la un <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">faucet Sepolia <ExternalLink size={12} className="inline"/></a>.</li>
                <li>Asigură-te că portofelul tău MetaMask este conectat și setat pe rețeaua Sepolia.</li>
                <li>Fiecare provocare deblocată îți oferă o cifră din combinația finală a seifului.</li>
                <li>Dacă întâmpini erori, verifică consola browserului (F12) pentru detalii.</li>
            </ul>
        </section>
      </div>      {/* Modals */}
      <SignMessageModal
        isOpen={showSignMessageModal}
        onClose={() => setShowSignMessageModal(false)}
        onSignMessage={handleSignMessage}
        isLoading={isLoading}
      />      <TimestampModal
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
      />      <SendSecretMessageModal
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
      />      <SimpleSwapModal
        isOpen={showSimpleSwapModal}
        onClose={() => {
          setShowSimpleSwapModal(false);
          hideMainTxLoadingModal(); // Ascunde și modalul de încărcare dacă se închide manual SimpleSwapModal
        }}
        onSwapSuccess={handleSimpleSwapSuccess}
        onError={handleSimpleSwapError}
        onTxSent={handleSimpleSwapTxSent} // Pasează noul handler
      />

      <MetaMaskSetupGuide
        isOpen={showSetupGuide}
        onClose={() => setShowSetupGuide(false)}
      />

      {isTxLoadingModalOpen && (
        <TransactionLoadingModal
          isOpen={isTxLoadingModalOpen}
          transactionHash={currentTxHash}
          // onClose prop is not used in TransactionLoadingModal, so it's removed here
        />
      )}
    </div>
  );
};

export default EscapeRoom;
