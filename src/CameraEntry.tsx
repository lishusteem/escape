import { useState, useEffect } from 'react';
import { Shield, Wallet, Globe, Fuel, CheckCircle, Download, Copy, ExternalLink, Info } from 'lucide-react';

interface CameraEntryProps {
  onEntryComplete: () => void;
}

const CameraEntry = ({ onEntryComplete }: CameraEntryProps) => {
  const [connectionStatus, setConnectionStatus] = useState({
    wallet: 'disconnected', // disconnected, connecting, connected
    network: 'wrong', // wrong, checking, correct
    balance: 'insufficient', // insufficient, checking, sufficient
    ready: false
  });
  const [userAddress, setUserAddress] = useState('');
  const [ethBalance, setEthBalance] = useState('0');
  const [currentStep, setCurrentStep] = useState(1);

  // Sepolia Network Details
  const SEPOLIA_NETWORK = {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SepoliaETH',
      decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/']
  };
  const MIN_ETH_REQUIRED = 0.005; // 0.005 ETH minimum pentru gas fees

  // Validation function to check if wallet is properly configured
  const checkWalletConfiguration = async () => {
    if (!window.ethereum) {
      return { isConfigured: false, message: 'MetaMask nu este instalat!' };
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        return { isConfigured: false, message: 'Nu există conturi în MetaMask. Te rugăm să creezi sau importezi un portofel.' };
      }
      return { isConfigured: true, message: 'Portofelul este configurat corect!' };
    } catch (error) {
      return { isConfigured: false, message: 'Eroare la verificarea configurației portofelului.' };
    }
  };

  // Enhanced skip function with validation
  const handleSkipToWalletConnection = async () => {
    const validation = await checkWalletConfiguration();
    
    if (!validation.isConfigured) {
      alert(`❌ ${validation.message}\n\nTe rugăm să configurezi portofelul MetaMask înainte de a continua.`);
      return;
    }
    
    // Show confirmation message and advance to step 3
    alert(`✅ ${validation.message}\n\nTreci la conectarea portofelului.`);
    setCurrentStep(3);
  };

  // Check wallet connection
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask nu este instalat! Te rugăm să instalezi MetaMask.');
      window.open('https://metamask.io/', '_blank');
      return;
    }

    setConnectionStatus(prev => ({ ...prev, wallet: 'connecting' }));

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      setUserAddress(accounts[0]);
      setConnectionStatus(prev => ({ ...prev, wallet: 'connected' }));
      
      // Check network after connection
      await checkNetwork();
    } catch (error) {
      console.error('Eroare conectare portofel:', error);
      setConnectionStatus(prev => ({ ...prev, wallet: 'disconnected' }));
    }
  };
  // Check if on Sepolia network
  const checkNetwork = async () => {
    if (!window.ethereum) return;
    
    setConnectionStatus(prev => ({ ...prev, network: 'checking' }));
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chainId === SEPOLIA_NETWORK.chainId) {
        setConnectionStatus(prev => ({ ...prev, network: 'correct' }));
        await checkBalance();
      } else {
        setConnectionStatus(prev => ({ ...prev, network: 'wrong' }));
      }
    } catch (error) {
      console.error('Eroare verificare rețea:', error);
    }
  };
  // Switch to Sepolia network
  const switchToSepolia = async () => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_NETWORK.chainId }],
      });
    } catch (switchError: any) {
      // Network not added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_NETWORK],
          });
        } catch (addError) {
          console.error('Eroare adăugare rețea:', addError);
        }
      }
    }
  };  // Check ETH balance
  const checkBalance = async () => {
    if (!window.ethereum || !userAddress) {
      console.log('Nu se poate verifica soldul - MetaMask sau adresa lipsește:', { ethereum: !!window.ethereum, userAddress });
      return;
    }
    
    setConnectionStatus(prev => ({ ...prev, balance: 'checking' }));
    
    try {
      console.log('Verifică soldul pentru adresa:', userAddress);
      
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [userAddress, 'latest']
      });
      
      console.log('Sold brut:', balance);
      
      const ethAmount = parseInt(balance, 16) / 1e18;
      setEthBalance(ethAmount.toFixed(4));
        console.log('Sold convertit:', ethAmount, 'ETH');
        if (ethAmount >= MIN_ETH_REQUIRED) {
        setConnectionStatus(prev => ({ 
          ...prev, 
          balance: 'sufficient',
          ready: true
        }));
        // Ensure containers minimize by setting currentStep to 0 after state update
        setTimeout(() => {
          setCurrentStep(0);
        }, 100);
        console.log('Sold suficient pentru aventură!');
      } else {
        setConnectionStatus(prev => ({ ...prev, balance: 'insufficient' }));
        console.log(`Sold insuficient. Necesar: ${MIN_ETH_REQUIRED} ETH, ai: ${ethAmount} ETH`);
      }
    } catch (error) {
      console.error('Eroare verificare sold:', error);
      setConnectionStatus(prev => ({ ...prev, balance: 'insufficient' }));
    }
  };
  // Listen for account/network changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          checkNetwork();
        } else {
          setConnectionStatus({
            wallet: 'disconnected',
            network: 'wrong',
            balance: 'insufficient',
            ready: false
          });
        }
      });

      window.ethereum.on('chainChanged', () => {
        checkNetwork();
      });
    }
  }, []);  // Auto-advance steps based on completion
  useEffect(() => {
    // Auto-advance from step 1 to 2 when MetaMask is detected
    if (window.ethereum && currentStep === 1) {
      setCurrentStep(2);
    }
    // Auto-advance from step 3 to 4 when wallet is connected
    if (connectionStatus.wallet === 'connected' && currentStep === 3) {
      setCurrentStep(4);
    }
    // Auto-advance from step 4 to 5 when on correct network
    if (connectionStatus.network === 'correct' && currentStep === 4) {
      setCurrentStep(5);
    }
  }, [currentStep, connectionStatus.wallet, connectionStatus.network]);

  // Separate effect for handling balance completion
  useEffect(() => {
    // Mark as ready when sufficient balance
    if (connectionStatus.balance === 'sufficient' && !connectionStatus.ready) {
      setConnectionStatus(prev => ({ ...prev, ready: true }));
      // Reset currentStep to 0 when all steps are completed to minimize all containers
      if (currentStep === 5) {
        console.log('Minimizing all containers - setting currentStep to 0');
        setCurrentStep(0);
      }
    }
  }, [connectionStatus.balance, connectionStatus.ready, currentStep]);
  // Check balance when user address changes and we're on the right network
  useEffect(() => {
    if (userAddress && connectionStatus.network === 'correct') {
      checkBalance();
    }
  }, [userAddress, connectionStatus.network]);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const enterCryptoRoom = () => {
    onEntryComplete();
  };  const steps = [
    {
      id: 1,
      title: 'Instalează MetaMask',
      icon: Download,
      status: window.ethereum ? 'completed' : 'pending',
      description: 'Portofelul digital pentru blockchain'
    },
    {
      id: 2,
      title: 'Creează Portofel',
      icon: Copy,
      status: window.ethereum ? 'completed' : 'pending',
      description: 'Setup și backup seed phrase'
    },
    {
      id: 3,
      title: 'Conectează Portofelul',
      icon: Wallet,
      status: connectionStatus.wallet === 'connected' ? 'completed' : 
              connectionStatus.wallet === 'connecting' ? 'loading' : 'pending',
      description: 'Autorizează accesul la portofel'
    },
    {
      id: 4,
      title: 'Schimbă la Sepolia',
      icon: Globe,
      status: connectionStatus.network === 'correct' ? 'completed' : 
              connectionStatus.network === 'checking' ? 'loading' : 'pending',
      description: 'Rețeaua de test Ethereum'
    },
    {
      id: 5,
      title: 'Obține ETH de Test',
      icon: Fuel,
      status: connectionStatus.balance === 'sufficient' ? 'completed' : 
              connectionStatus.balance === 'checking' ? 'loading' : 'pending',
      description: 'Combustibil pentru tranzacții'
    }
  ];
  return (
    <>      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 flex">
        {/* Fixed Progress Sidebar */}
        <div className="w-80 bg-gray-900/95 backdrop-blur border-r border-gray-700 fixed left-0 top-0 h-screen overflow-y-auto z-10">
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Info className="h-6 w-6 mr-2 text-cyan-400" />
              Progres Educațional
            </h3>
            
            {/* Educational Progress Steps */}
            <div className="space-y-4">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      step.status === 'completed' 
                        ? 'bg-gradient-to-r from-emerald-900/80 to-green-900/80 border-emerald-500 shadow-lg shadow-emerald-500/20' 
                        : step.status === 'loading'
                        ? 'bg-gradient-to-r from-blue-900/80 to-cyan-900/80 border-cyan-500 shadow-lg shadow-cyan-500/20'
                        : currentStep === step.id
                        ? 'bg-gradient-to-r from-blue-900/80 to-purple-900/80 border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'bg-gray-800/60 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-full transition-all duration-300 ${
                        step.status === 'completed' 
                          ? 'bg-emerald-600 shadow-lg shadow-emerald-500/30' 
                          : step.status === 'loading'
                          ? 'bg-cyan-600 shadow-lg shadow-cyan-500/30'
                          : currentStep === step.id
                          ? 'bg-blue-600 shadow-lg shadow-blue-500/30'
                          : 'bg-gray-600'
                      }`}>
                        {step.status === 'loading' ? (
                          <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : step.status === 'completed' ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : (
                          <Icon className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm ${
                          step.status === 'completed' ? 'text-emerald-200' : 'text-white'
                        }`}>
                          {step.title}
                        </h4>
                        <p className={`text-xs ${
                          step.status === 'completed' ? 'text-emerald-300' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>            {/* Secret Room Visual Status */}
            <div className="mt-8 relative">
              {/* Camera 3D Container */}
              <div className={`relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-2xl border-2 transition-all duration-1000 ${
                connectionStatus.ready 
                  ? 'border-emerald-500 shadow-2xl shadow-emerald-500/30' 
                  : 'border-red-600 shadow-2xl shadow-red-600/30'
              }`}>
                {/* Room Interior */}
                <div className="relative p-8 h-48 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]"></div>
                  </div>
                  
                  {/* Corner Progress Lights */}
                  <div className="absolute top-2 left-2 w-3 h-3 rounded-full transition-all duration-500">
                    <div className={`w-full h-full rounded-full ${
                      window.ethereum ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse' : 'bg-gray-600'
                    }`}></div>
                  </div>
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full transition-all duration-500">
                    <div className={`w-full h-full rounded-full ${
                      connectionStatus.wallet === 'connected' ? 'bg-blue-400 shadow-lg shadow-blue-400/50 animate-pulse' : 'bg-gray-600'
                    }`}></div>
                  </div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full transition-all duration-500">
                    <div className={`w-full h-full rounded-full ${
                      connectionStatus.network === 'correct' ? 'bg-purple-400 shadow-lg shadow-purple-400/50 animate-pulse' : 'bg-gray-600'
                    }`}></div>
                  </div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full transition-all duration-500">
                    <div className={`w-full h-full rounded-full ${
                      connectionStatus.balance === 'sufficient' ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse' : 'bg-gray-600'
                    }`}></div>
                  </div>                  {/* Central Access Panel - Minimal Text */}
                  <div className="absolute inset-y-8 left-1/2 transform -translate-x-1/2 w-32">
                    {!connectionStatus.ready ? (
                      // Locked State - Minimal
                      <div className="relative h-full flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full border-4 border-red-500 bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center shadow-xl shadow-red-500/30 transition-all duration-1000">
                          <div className="text-3xl text-red-400 animate-pulse">🔒</div>
                        </div>
                      </div>
                    ) : (
                      // Open State - Minimal with Entry Button
                      <div className="relative h-full flex flex-col items-center justify-center animate-fade-in">
                        <div className="w-20 h-20 rounded-full border-4 border-emerald-500 bg-gradient-to-b from-emerald-600 to-emerald-800 flex items-center justify-center shadow-xl shadow-emerald-500/50 transition-all duration-1000 mb-4">
                          <div className="text-3xl text-emerald-200 animate-pulse">🔓</div>
                        </div>
                        
                        {/* Entry Button */}
                        <button
                          onClick={onEntryComplete}
                          className="group relative bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-emerald-400/50 border border-emerald-400/50"
                        >
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">INTRĂ</span>
                            <div className="text-sm group-hover:animate-bounce">🚪</div>
                          </div>
                          
                          {/* Button Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>                {/* Progress Footer - Minimal */}
                <div className={`px-4 py-2 border-t transition-all duration-500 ${
                  connectionStatus.ready 
                    ? 'bg-emerald-900/30 border-emerald-600' 
                    : 'bg-red-900/30 border-red-600'
                }`}>
                  <div className="flex justify-center items-center">
                    <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      connectionStatus.ready 
                        ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' 
                        : 'bg-red-400 shadow-lg shadow-red-400/50'
                    }`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Tips */}
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl border border-cyan-600/50">
              <h4 className="font-bold text-cyan-200 mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                💡 Sfat Educativ
              </h4>
              <p className="text-cyan-300 text-xs leading-relaxed">
                Această aventură te învață fundamentele blockchain-ului Ethereum într-un mod practic și sigur.
              </p>
            </div>
          </div>
        </div>        {/* Main Content Area - optimized for full width */}
        <div className="flex-1 ml-80 p-4 xl:p-8">
          <div className="w-full">            {/* Enhanced Educational Header - optimized for space - Only show when currentStep > 0 */}
            {currentStep > 0 && (
            <div className="text-center mb-8 xl:mb-12">
              <div className="relative">
                <Shield className="h-16 w-16 xl:h-20 xl:w-20 text-cyan-400 mx-auto mb-4 drop-shadow-lg filter" />
                <div className="absolute inset-0 h-16 w-16 xl:h-20 xl:w-20 mx-auto animate-pulse bg-cyan-400/20 rounded-full blur-xl"></div>
              </div>
              <h1 className="text-3xl xl:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                🎓 Ghid Educativ: Wallet Setup
              </h1>
              <p className="text-lg xl:text-xl text-gray-300 mb-4 leading-relaxed">
                Învață fundamentele navigării universului crypto prin practică: conectarea la portofelul MetaMask și rețeaua de test Sepolia
              </p>
              <div className="bg-gradient-to-r from-cyan-900/80 to-blue-900/80 border border-cyan-700 rounded-xl p-4 xl:p-6 backdrop-blur">
                <p className="text-cyan-200 font-medium text-base xl:text-lg">
                  🚀 <strong>Misiune :</strong> Parcurge cei 5 pași pentru a a putea intra în camera secretă!
                </p>
                <p className="text-cyan-300 text-sm xl:text-base mt-1">
                  📚 Fiecare pas este o actiune practică și fundamentală în navigarea web3.
                </p>
              </div>
            </div>
            )}{/* Educational Setup Content - optimized spacing */}
            <div className="space-y-6 xl:space-y-8 w-full">              {/* Setup Complete Summary - Professional & Educational */}
              {currentStep === 0 && connectionStatus.ready && (
                <div className="w-full bg-gradient-to-br from-emerald-900/95 via-green-900/95 to-teal-900/95 border border-emerald-400 rounded-xl backdrop-blur-sm shadow-xl shadow-emerald-500/20">
                  <div className="p-6 xl:p-8">
                    {/* Professional Header */}
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-400/30">
                        <div className="text-2xl text-emerald-900 font-bold">✓</div>
                      </div>
                      <h1 className="text-2xl xl:text-3xl font-bold text-white mb-3">
                        Setup Web3 Complet
                      </h1>
                      <p className="text-lg text-emerald-200 mb-2">
                        Configurarea wallet-ului a fost finalizată cu succes
                      </p>
                      <p className="text-sm text-emerald-300">
                        Toate componentele necesare sunt funcționale și verificate
                      </p>
                    </div>{/* Technical Configuration Summary - Same structure as transaction cards */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {/* System Status */}
                      <div className="bg-blue-700/50 border border-blue-500 rounded-lg p-4">
                        <h3 className="text-blue-200 font-semibold mb-3 flex items-center">
                          <span className="text-lg mr-2">✅</span>
                          Status Sistem
                        </h3>
                        <p className="text-blue-100 text-sm mb-2">
                          Toate componentele blockchain sunt conectate și funcționale pentru interacțiuni sigure
                        </p>
                        <div className="text-blue-300 text-xs">
                          🎯 Configurat: MetaMask, Sepolia Network, ETH Balance ({ethBalance})
                        </div>
                      </div>

                      {/* Technical Knowledge */}
                      <div className="bg-indigo-700/50 border border-indigo-500 rounded-lg p-4">
                        <h3 className="text-indigo-200 font-semibold mb-3 flex items-center">
                          <span className="text-lg mr-2">🧠</span>
                          Competențe Tehnice
                        </h3>
                        <p className="text-indigo-100 text-sm mb-2">
                          Ai dobândit cunoștințe fundamentale pentru navigarea în ecosistemul blockchain
                        </p>
                        <div className="text-indigo-300 text-xs">
                          🎯 Învățat: Wallet setup, Network config, Gas management, Security practices
                        </div>
                      </div>
                    </div>{/* Real-World Blockchain Transactions Explanation */}
                    <div className="bg-gradient-to-br from-blue-800/80 to-purple-800/80 border border-blue-600 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-semibold text-blue-200 mb-4 flex items-center">
                        <Fuel className="h-6 w-6 mr-3 text-blue-400" />
                        Ce Urmează: Tranzacții Blockchain Reale
                      </h3>
                      
                      <p className="text-blue-100 mb-5 leading-relaxed">
                        Acum că ai configurat wallet-ul pe testnet Sepolia, vei învăța să execuți <strong>exact aceleași tipuri de tranzacții</strong> 
                        ca în lumea reală, dar <strong>fără niciun risc financiar</strong>. Testnet-ul replică perfect mainnet-ul Ethereum.
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 mb-5">
                        <div className="bg-blue-700/50 border border-blue-500 rounded-lg p-4">
                          <h4 className="text-blue-200 font-semibold mb-3 flex items-center">
                            <span className="text-lg mr-2">💸</span>
                            Transfer ETH
                          </h4>
                          <p className="text-blue-100 text-sm mb-2">
                            Trimite criptomonedă către alte adrese - exact ca un transfer bancar, dar descentralizat
                          </p>
                          <div className="text-blue-300 text-xs">
                            🎯 Învață: Gas fees, confirmări blockchain, irreversibilitate
                          </div>
                        </div>

                        <div className="bg-purple-700/50 border border-purple-500 rounded-lg p-4">
                          <h4 className="text-purple-200 font-semibold mb-3 flex items-center">
                            <span className="text-lg mr-2">✍️</span>
                            Semnare Mesaje
                          </h4>
                          <p className="text-purple-100 text-sm mb-2">
                            Autentificare criptografică fără costuri - dovedește-ți identitatea fără tranzacție
                          </p>
                          <div className="text-purple-300 text-xs">
                            🎯 Învață: Semnături digitale, autentificare Web3, zero gas
                          </div>
                        </div>

                        <div className="bg-indigo-700/50 border border-indigo-500 rounded-lg p-4">
                          <h4 className="text-indigo-200 font-semibold mb-3 flex items-center">
                            <span className="text-lg mr-2">🔄</span>
                            Token Swaps
                          </h4>
                          <p className="text-indigo-100 text-sm mb-2">
                            Schimbă între diferite criptomonede - fundamentul DeFi și exchange-urilor descentralizate
                          </p>
                          <div className="text-indigo-300 text-xs">
                            🎯 Învață: DEX trading, slippage, liquidity pools
                          </div>
                        </div>

                        <div className="bg-cyan-700/50 border border-cyan-500 rounded-lg p-4">
                          <h4 className="text-cyan-200 font-semibold mb-3 flex items-center">
                            <span className="text-lg mr-2">🗳️</span>
                            Voting DAO
                          </h4>
                          <p className="text-cyan-100 text-sm mb-2">
                            Participă la guvernarea descentralizată - votează pentru decizii importante în comunitate
                          </p>
                          <div className="text-cyan-300 text-xs">
                            🎯 Învață: Governance tokens, DAO participation, on-chain voting
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-900/60 border border-emerald-600 rounded-lg p-4 mb-5">
                        <h4 className="text-emerald-200 font-semibold mb-2 flex items-center">
                          <span className="text-lg mr-2">🛡️</span>
                          De ce este Perfectă Rețeaua de Test?
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="text-emerald-100 text-sm">
                            <span className="font-medium text-emerald-200">• Zero risc financiar:</span> ETH-ul de test nu are valoare reală
                          </div>
                          <div className="text-emerald-100 text-sm">
                            <span className="font-medium text-emerald-200">• Experiență identică:</span> Aceleași interfețe și procese
                          </div>
                          <div className="text-emerald-100 text-sm">
                            <span className="font-medium text-emerald-200">• Învățare rapidă:</span> Confirmări mai rapide decât mainnet
                          </div>
                          <div className="text-emerald-100 text-sm">
                            <span className="font-medium text-emerald-200">• Repetabilitate:</span> Poți încerca de câte ori vrei
                          </div>
                        </div>
                      </div>
                    </div>                      <div className="text-center">
                        <button
                          onClick={enterCryptoRoom}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                        >
                          🚀 Intră în Camera Secretă
                        </button>
                        
                        <p className="text-blue-300 text-sm mt-3">
                          Începe călătoria în universul tranzacțiilor blockchain
                        </p>
                      </div>
                  </div>
                </div>
              )}{/* Step 1: Install MetaMask - Enhanced Educational - Only show when currentStep > 0 */}
              {currentStep > 0 && (
              <div className={`w-full bg-gradient-to-r from-gray-800/90 to-gray-700/90 rounded-2xl border-2 transition-all duration-300 backdrop-blur ${
                currentStep === 1 ? 'border-cyan-500 ring-2 ring-cyan-500 ring-opacity-30 shadow-xl shadow-cyan-500/20' : 'border-gray-600 hover:border-gray-500'
              }`}>
                <div className="p-4 xl:p-6">
                  <div className="flex items-center mb-4 xl:mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 xl:p-4 rounded-full mr-3 xl:mr-4 shadow-lg">
                      <Download className="h-6 w-6 xl:h-8 xl:w-8 text-white" />
                    </div>                    <div className="flex-1">
                      <h2 className="text-2xl xl:text-3xl font-bold text-white mb-2">Pasul 1: Instalează MetaMask</h2>
                      <p className="text-gray-300 text-base xl:text-lg">Primul pas în lumea crypto: portofelul digital pentru Ethereum</p>
                      <div className="mt-2 px-3 py-1 bg-blue-600/20 rounded-full inline-block">
                        <span className="text-blue-300 text-xs xl:text-sm font-medium">🎯 Concept: Portofele Crypto</span>
                      </div>
                    </div>
                  </div>

                  {!window.ethereum ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-red-900/80 to-pink-900/80 border border-red-600 rounded-xl p-6">
                        <h4 className="text-red-200 font-bold mb-4 flex items-center">
                          🚫 MetaMask nu este detectat în browser
                        </h4>
                        
                        <div className="grid lg:grid-cols-2 gap-6 mb-6">
                          <div className="bg-red-800/50 p-4 rounded-lg">
                            <h5 className="text-red-300 font-semibold mb-2">📚 Ce este MetaMask?</h5>
                            <p className="text-red-200 text-sm leading-relaxed mb-3">
                              MetaMask este o extensie de browser care funcționează ca un portofel digital pentru criptomonede. 
                              Este ca un cont bancar, dar pentru blockchain-ul Ethereum.
                            </p>
                            <div className="bg-red-700/50 p-3 rounded">
                              <p className="text-red-200 text-xs">
                                💡 <strong>De reținut:</strong> MetaMask îți permite să interacționezi cu aplicații descentralizate (dApps) 
                                și să gestionezi criptomonede în siguranță.
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-red-800/50 p-4 rounded-lg">
                            <p className="text-red-300 font-semibold mb-3">🔧 Pași pentru instalare:</p>
                            <ol className="list-decimal list-inside space-y-2 text-red-200 text-sm">
                              <li>Mergi la site-ul oficial MetaMask</li>
                              <li>Descarcă extensia pentru browser-ul tău</li>
                              <li>Instalează extensia și urmează instrucțiunile</li>
                              <li>Creează un portofel nou cu o parolă sigură</li>
                              <li>Salvează secret phrase-ul într-un loc sigur</li>
                              <li>Reîncarcă această pagină după instalare</li>
                            </ol>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => window.open('https://metamask.io/download/', '_blank')}
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl transition-all duration-300 inline-flex items-center space-x-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <ExternalLink className="h-6 w-6" />
                          <span>🚀 Descarcă MetaMask</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-emerald-900/80 to-green-900/80 border border-emerald-600 rounded-xl p-6">
                      <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 text-emerald-400 mr-4" />
                        <div>
                          <p className="text-emerald-200 font-bold text-lg">
                            🎉 Excelent! MetaMask este instalat!
                          </p>
                          <p className="text-emerald-300 text-sm mt-1">
                            Ai completat primul pas în învățarea blockchain-ului. Poți trece la configurarea portofelului.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}                </div>
              </div>
              )}

              {/* Step 2: Create Wallet */}
              {currentStep > 0 && (
              <div className={`w-full bg-gray-800 rounded-xl border-2 transition-all ${
                currentStep === 2 ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-700'
              }`}>
                <div className="p-4 xl:p-6">
                  <div className="flex items-center mb-4 xl:mb-6">
                    <div className="bg-green-600 p-3 xl:p-4 rounded-full mr-3 xl:mr-4">
                      <Copy className="h-6 w-6 xl:h-8 xl:w-8 text-white" />
                    </div>                    <div className="flex-1">
                      <h2 className="text-2xl xl:text-3xl font-bold text-white mb-2">2. Creează și Salvează Portofelul</h2>
                      <p className="text-gray-300 text-base xl:text-lg">Configurează MetaMask și fă backup la seed phrase</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-amber-900 border border-amber-700 rounded-lg p-4">
                      <h4 className="text-amber-300 font-semibold mb-3 flex items-center">
                        ⚠️ FOARTE IMPORTANT - Seed Phrase Backup
                      </h4>
                      <p className="text-amber-200 text-sm mb-4">Seed phrase-ul este cheia principală care îți permite să recuperezi portofelul. <strong>FĂRĂ el, îți poți pierde permanent fondurile!</strong></p>
                      
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div className="bg-amber-800 p-4 rounded">
                          <p className="font-semibold mb-3 text-amber-200">📋 Pași pentru setup portofel nou:</p>
                          <ol className="list-decimal list-inside space-y-1 text-amber-200 text-sm">
                            <li>Deschide MetaMask și click "Create a wallet"</li>
                            <li>Creează o parolă puternică (min. 8 caractere)</li>
                            <li>Va apărea seed phrase-ul de 12 cuvinte</li>
                            <li><strong>SCRIE cuvintele pe hârtie în ordinea exactă</strong></li>
                            <li>Verifică că ai scris corect toate cuvintele</li>
                            <li>Păstrează hârtia într-un loc FOARTE sigur</li>
                            <li>Nu face screenshot și nu îl salvezi digital!</li>
                          </ol>
                        </div>

                        <div className="bg-red-800 p-4 rounded border border-red-600">
                          <p className="font-semibold text-red-200 mb-3">🚨 NICIODATĂ NU:</p>
                          <ul className="list-disc list-inside space-y-1 text-red-300 text-sm">
                            <li>Nu împărtăși seed phrase-ul cu nimeni</li>
                            <li>Nu îl introduci pe site-uri necunoscute</li>
                            <li>Nu îl salvezi în cloud sau email</li>
                            <li>Nu faci poze la el cu telefonul</li>
                            <li>Nu îl introduci în chat-uri sau Discord</li>
                            <li>Nu îl trimiți prin WhatsApp sau Telegram</li>
                          </ul>
                        </div>
                      </div>
                    </div>{window.ethereum && (
                      <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                        <p className="text-blue-200 mb-3">
                          💡 <strong>Ai deja MetaMask instalat!</strong> Dacă ai deja un portofel configurat, poți trece direct la conectare.
                        </p>
                        <p className="text-blue-300 text-sm mb-4">
                          Dacă vrei să creezi un portofel nou, deschide MetaMask → Settings → Advanced → Reset Account (atenție: vei pierde portofelul curent dacă nu ai backup!)
                        </p>
                        <div className="flex space-x-3">                          <button
                            onClick={handleSkipToWalletConnection}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                          >
                            ✅ Am Portofel Configurat
                          </button><button
                            onClick={() => window.open('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html', '_blank')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                          >
                            Deschide MetaMask
                          </button>
                        </div>
                      </div>
                    )}                  </div>
                </div>
              </div>
              )}

              {/* Step 3: Connect Wallet */}
              {currentStep > 0 && (
              <div className={`w-full bg-gray-800 rounded-xl border-2 transition-all ${
                currentStep === 3 ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-700'
              }`}>
                <div className="p-4 xl:p-6">
                  <div className="flex items-center mb-4 xl:mb-6">
                    <div className="bg-emerald-600 p-3 xl:p-4 rounded-full mr-3 xl:mr-4">
                      <Wallet className="h-6 w-6 xl:h-8 xl:w-8 text-white" />
                    </div>                    <div className="flex-1">
                      <h2 className="text-2xl xl:text-3xl font-bold text-white mb-2">3. Conectează Portofelul</h2>
                      <p className="text-gray-300 text-base xl:text-lg">Autorizează accesul aplicației la MetaMask</p>
                    </div>
                  </div>

                  {connectionStatus.wallet === 'connected' ? (
                    <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                          <div>
                            <p className="text-green-200">✅ Portofel conectat cu succes!</p>
                            <p className="text-green-300 text-sm font-mono">
                              Adresa: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(userAddress)}
                          className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Copiază</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
                        <p className="text-yellow-200 mb-4">
                          🔑 Trebuie să conectezi portofelul MetaMask pentru a continua.
                        </p>
                        <div className="space-y-3">
                          <p className="text-yellow-300 font-semibold">Ce se va întâmpla:</p>
                          <ul className="list-disc list-inside space-y-1 text-yellow-200 text-sm">
                            <li>MetaMask va solicita permisiunea să se conecteze</li>
                            <li>Alege contul pe care vrei să îl folosești</li>
                            <li>Confirmă conexiunea în popup-ul MetaMask</li>
                            <li>Adresa portofelului va fi afișată aici</li>
                          </ul>
                        </div>
                      </div>
                      <button
                        onClick={connectWallet}
                        disabled={!window.ethereum}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
                      >
                        {connectionStatus.wallet === 'connecting' ? (
                          <>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Conectare...</span>
                          </>
                        ) : (
                          <>
                            <Wallet className="h-5 w-5" />
                            <span>Conectează MetaMask</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}                </div>
              </div>
              )}

              {/* Step 4: Switch to Sepolia */}
              {currentStep > 0 && (
              <div className={`w-full bg-gray-800 rounded-xl border-2 transition-all ${
                currentStep === 4 ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-700'
              }`}>
                <div className="p-4 xl:p-6">
                  <div className="flex items-center mb-4 xl:mb-6">
                    <div className="bg-purple-600 p-3 xl:p-4 rounded-full mr-3 xl:mr-4">
                      <Globe className="h-6 w-6 xl:h-8 xl:w-8 text-white" />
                    </div>                    <div className="flex-1">
                      <h2 className="text-2xl xl:text-3xl font-bold text-white mb-2">4. Schimbă la Rețeaua Sepolia</h2>
                      <p className="text-gray-300 text-base xl:text-lg">Rețeaua de test pentru Ethereum</p>
                    </div>
                  </div>

                  {connectionStatus.network === 'correct' ? (
                    <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                        <p className="text-green-200">
                          ✅ Conectat la rețeaua Sepolia Testnet!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-purple-900 border border-purple-700 rounded-lg p-6">
                        <div className="grid lg:grid-cols-2 gap-6">
                          <div>
                            <p className="text-purple-200 mb-4 font-semibold">
                              🌐 Trebuie să schimbi rețeaua la Sepolia pentru a folosi ETH gratuit.
                            </p>
                            <button
                              onClick={switchToSepolia}
                              disabled={connectionStatus.wallet !== 'connected'}
                              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2 w-full justify-center"
                            >
                              {connectionStatus.network === 'checking' ? (
                                <>
                                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Schimbare rețea...</span>
                                </>
                              ) : (
                                <>
                                  <Globe className="h-5 w-5" />
                                  <span>Schimbă la Sepolia</span>
                                </>
                              )}
                            </button>
                          </div>
                          
                          <div className="bg-purple-800/50 p-4 rounded-lg">
                            <p className="text-purple-300 font-semibold mb-3">De ce Sepolia?</p>
                            <ul className="list-disc list-inside space-y-1 text-purple-200 text-sm">
                              <li>Este o rețea de test - ETH-ul nu costă bani reali</li>
                              <li>Poți obține ETH gratuit de la faucet-uri</li>
                              <li>Perfect pentru învățare și experimentare</li>
                              <li>Funcționează exact ca Ethereum Mainnet</li>
                              <li>Dezvoltatorii o folosesc pentru testare</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>                  )}
                </div>
              </div>
              )}

              {/* Step 5: Get Test ETH */}
              {currentStep > 0 && (
              <div className={`w-full bg-gray-800 rounded-xl border-2 transition-all ${
                currentStep === 5 ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-700'
              }`}>
                <div className="p-4 xl:p-6">
                  <div className="flex items-center mb-4 xl:mb-6">
                    <div className="bg-yellow-600 p-3 xl:p-4 rounded-full mr-3 xl:mr-4">
                      <Fuel className="h-6 w-6 xl:h-8 xl:w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl xl:text-3xl font-bold text-white mb-2">5. Obține ETH de Test</h2>
                      <p className="text-gray-300 text-base xl:text-lg">Combustibil pentru tranzacțiile blockchain</p>
                      <div className="mt-2 px-3 py-1 bg-yellow-600/20 rounded-full inline-block">
                        <span className="text-yellow-300 text-xs xl:text-sm font-medium">🎯 Concept: Gas Fees & Securitate</span>
                      </div>
                    </div>
                  </div>

                  {connectionStatus.balance === 'sufficient' ? (
                    <div className="bg-gradient-to-r from-emerald-900/80 to-green-900/80 border border-emerald-600 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-8 w-8 text-emerald-400 mr-4" />
                          <div>
                            <p className="text-emerald-200 font-bold text-lg">
                              🎉 Perfect! Ai suficient ETH pentru aventură!
                            </p>                            <p className="text-emerald-300 text-sm mt-1">
                              Sold curent: <span className="font-semibold">{ethBalance || '0.0000'} ETH</span> (Minim necesar: {MIN_ETH_REQUIRED} ETH)
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={checkBalance}
                          className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Actualizează
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Educational explanation about keys and security */}
                      <div className="bg-gradient-to-r from-cyan-900/80 to-blue-900/80 border border-cyan-600 rounded-xl p-6">
                        <h4 className="text-cyan-200 font-bold mb-4 flex items-center text-lg">
                          🔐 Lecție Importantă: Cheia Publică vs Cheia Privată
                        </h4>
                        
                        <div className="grid lg:grid-cols-2 gap-6 mb-6">
                          <div className="bg-cyan-800/50 p-5 rounded-lg border border-cyan-700">
                            <h5 className="text-cyan-300 font-semibold mb-3 flex items-center">
                              🌍 Cheia Publică (Adresa)
                            </h5>
                            <ul className="text-cyan-200 text-sm space-y-2">
                              <li>✅ <strong>SIGUR</strong> să o împărtășești</li>
                              <li>📧 Ca o adresă de email publică</li>
                              <li>💰 Oamenii îți pot trimite crypto</li>
                              <li>🔍 Vizibilă pe blockchain</li>
                              <li>📋 O folosești pentru faucet-uri</li>
                            </ul>
                            <div className="mt-3 p-3 bg-cyan-700/50 rounded text-xs text-cyan-300">
                              💡 Adresa ta: <code className="font-mono break-all">{userAddress?.slice(0, 10)}...{userAddress?.slice(-6)}</code>
                            </div>
                          </div>
                          
                          <div className="bg-red-800/50 p-5 rounded-lg border border-red-600">
                            <h5 className="text-red-300 font-semibold mb-3 flex items-center">
                              🔒 Cheia Privată / Seed Phrase
                            </h5>
                            <ul className="text-red-200 text-sm space-y-2">
                              <li>❌ <strong>NICIODATĂ</strong> nu o împărtăși</li>
                              <li>🔑 Ca parola ta secretă</li>
                              <li>💸 Cine o are, controlează banii</li>
                              <li>🚫 Nu o introduci pe site-uri</li>
                              <li>📝 Doar pe hârtie, în siguranță</li>
                            </ul>
                            <div className="mt-3 p-3 bg-red-700/50 rounded text-xs text-red-300">
                              ⚠️ <strong>IMPORTANT:</strong> Site-urile legitime nu îți cer niciodată seed phrase-ul!
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Current balance and faucet info */}
                      <div className="bg-gradient-to-r from-yellow-900/80 to-orange-900/80 border border-yellow-600 rounded-xl p-6">
                        <h4 className="text-yellow-200 font-bold mb-4 flex items-center text-lg">
                          ⛽ Cum să Obții ETH de Test Gratuit
                        </h4>
                        
                        <div className="grid lg:grid-cols-2 gap-6">
                          <div>
                            <div className="bg-yellow-800/50 p-4 rounded-lg mb-4">
                              <p className="text-yellow-300 text-sm mb-2">
                                📊 <strong>Status curent:</strong>
                              </p>                              <p className="text-yellow-200 text-sm mb-1">
                                Sold: <span className="font-bold text-yellow-100">{ethBalance || '0.0000'} ETH</span>
                              </p>
                              <p className="text-yellow-200 text-sm">
                                Necesar: <span className="font-bold text-yellow-100">{MIN_ETH_REQUIRED} ETH</span>
                              </p>
                            </div>
                            
                            <div className="bg-orange-800/50 p-4 rounded-lg">
                              <p className="text-orange-300 font-semibold mb-2">🚀 Procesul simplu:</p>
                              <ol className="list-decimal list-inside space-y-1 text-orange-200 text-sm">
                                <li>Copiază adresa ta publică de mai jos</li>
                                <li>Click pe butonul "🌐 Mergi la Google Faucet"</li>
                                <li>Se va deschide un tab nou cu faucet-ul</li>
                                <li>Lipește adresa în câmpul "Recipient Address"</li>
                                <li>Completează CAPTCHA-ul pentru verificare</li>
                                <li>Apasă "Request" și așteaptă ~30 secunde</li>
                                <li><strong>Întoarce-te în acest tab</strong> și verifică soldul</li>
                              </ol>
                            </div>
                          </div>
                          
                          <div className="bg-yellow-800/50 p-4 rounded-lg">
                            <p className="text-yellow-300 font-semibold mb-3">🛡️ Sfaturi de Securitate:</p>
                            <ul className="text-yellow-200 text-sm space-y-2">
                              <li>✅ Faucet-ul Google este 100% sigur și oficial</li>
                              <li>🔍 Verifică că URL-ul începe cu "cloud.google.com"</li>
                              <li>⚠️ Nu introduce NICIODATĂ seed phrase-ul pe faucet</li>
                              <li>💡 Faucet-ul îți cere doar adresa publică</li>
                              <li>🔄 Poți reveni aici oricând pentru a verifica soldul</li>
                              <li>⏰ Un faucet per adresă la 24h</li>
                            </ul>
                            
                            <div className="mt-4 p-3 bg-green-800/50 rounded border border-green-600">
                              <p className="text-green-300 text-xs font-semibold">
                                🎯 <strong>Obiectiv:</strong> După ce primești ETH-ul, revino în joc pentru a continua aventura crypto!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>                      {/* Address display and action */}
                      {(userAddress || currentStep === 5) && (
                        <div className="bg-gradient-to-r from-blue-900/80 to-indigo-900/80 border border-blue-600 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-blue-200 font-bold text-lg">📋 Adresa Ta Publică pentru Faucet</h4>
                            <div className="text-xs text-blue-300 bg-blue-800/50 px-2 py-1 rounded">
                              Sigur de împărtășit
                            </div>
                          </div>
                          
                          {userAddress ? (
                            <>
                              <div className="bg-blue-800/50 p-4 rounded-lg mb-4">
                                <p className="text-blue-300 text-sm mb-2">
                                  Copiază această adresă și folosește-o în faucet:
                                </p>
                                <div className="flex items-center space-x-3">
                                  <code className="bg-blue-900 px-4 py-3 rounded text-blue-100 text-sm font-mono flex-1 break-all border border-blue-600">
                                    {userAddress}
                                  </code>
                                  <button
                                    onClick={() => copyToClipboard(userAddress)}
                                    className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-3 rounded-lg text-sm flex items-center space-x-2 whitespace-nowrap transition-colors"
                                  >
                                    <Copy className="h-4 w-4" />
                                    <span>Copiază</span>
                                  </button>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between gap-4">
                                <button
                                  onClick={() => window.open('https://cloud.google.com/application/web3/faucet/ethereum/sepolia', '_blank')}
                                  disabled={connectionStatus.network !== 'correct'}
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-4 rounded-xl transition-all duration-300 inline-flex items-center space-x-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex-1"
                                >
                                  <ExternalLink className="h-5 w-5" />
                                  <span>🌐 Mergi la Google Faucet</span>
                                </button>
                                
                                <button
                                  onClick={checkBalance}
                                  disabled={connectionStatus.network !== 'correct'}
                                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-4 rounded-xl transition-colors inline-flex items-center space-x-2 font-semibold"
                                >
                                  <Fuel className="h-5 w-5" />
                                  <span>Verifică Soldul</span>
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="bg-yellow-900/50 p-4 rounded-lg border border-yellow-600">
                              <p className="text-yellow-300 text-sm mb-2">
                                ⚠️ Pentru a accesa faucet-ul, trebuie mai întâi să conectezi portofelul MetaMask.
                              </p>
                              <button
                                onClick={() => setCurrentStep(3)}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                              >
                                🔙 Înapoi la Conectare Portofel
                              </button>
                            </div>
                          )}
                          
                          <div className="mt-4 p-3 bg-indigo-800/50 rounded-lg border border-indigo-600">
                            <p className="text-indigo-300 text-sm flex items-center">
                              <Info className="h-4 w-4 mr-2" />
                              <strong>Reminder:</strong> După ce primești ETH de la faucet, întoarce-te în această pagină și apasă "Verifică Soldul" pentru a continua.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>                  )}
                </div>
              </div>
              )}

              
            </div>
          </div>        </div>
      </div>
    </>
  );
};

export default CameraEntry;

