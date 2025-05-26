import { useState, useEffect } from 'react';
import { Shield, Wallet, Globe, Fuel, CheckCircle, X, Download, Copy, ExternalLink, Info } from 'lucide-react';

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
  const [showFaucet, setShowFaucet] = useState(false);
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
    // Mark as ready when sufficient balance
    if (connectionStatus.balance === 'sufficient' && currentStep === 5) {
      setConnectionStatus(prev => ({ ...prev, ready: true }));
    }
  }, [connectionStatus, currentStep]);
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
            </div>

            {/* Educational Progress Summary */}
            <div className="mt-8 p-4 bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl border border-gray-600">
              <h4 className="font-bold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-cyan-400" />
                Rezumat Progres
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-800/50">
                  <span className="text-gray-300 font-medium">MetaMask:</span>
                  <span className={`font-bold ${window.ethereum ? 'text-emerald-400' : 'text-red-400'}`}>
                    {window.ethereum ? '✅ Instalat' : '❌ Lipsește'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-800/50">
                  <span className="text-gray-300 font-medium">Portofel:</span>
                  <span className={`font-bold ${connectionStatus.wallet === 'connected' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {connectionStatus.wallet === 'connected' ? '✅ Conectat' : '❌ Deconectat'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-800/50">
                  <span className="text-gray-300 font-medium">Rețea:</span>
                  <span className={`font-bold ${connectionStatus.network === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {connectionStatus.network === 'correct' ? '✅ Sepolia' : '❌ Greșită'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-800/50">
                  <span className="text-gray-300 font-medium">ETH:</span>
                  <span className={`font-bold ${connectionStatus.balance === 'sufficient' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {connectionStatus.balance === 'sufficient' ? '✅ Suficient' : '❌ Insuficient'}
                  </span>
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
        </div>        {/* Main Content Area - using full width */}
        <div className="flex-1 ml-80 p-8">
          <div className="w-full">
            {/* Enhanced Educational Header */}
            <div className="text-center mb-12">
              <div className="relative">
                <Shield className="h-24 w-24 text-cyan-400 mx-auto mb-6 drop-shadow-lg filter" />
                <div className="absolute inset-0 h-24 w-24 mx-auto animate-pulse bg-cyan-400/20 rounded-full blur-xl"></div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                🎓 Ghid Educativ: Blockchain Setup
              </h1>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Învață fundamentele crypto prin practică: conectarea la MetaMask și rețeaua Sepolia
              </p>
              <div className="bg-gradient-to-r from-cyan-900/80 to-blue-900/80 border border-cyan-700 rounded-xl p-6 inline-block backdrop-blur">
                <p className="text-cyan-200 font-medium">
                  🚀 <strong>Misiune Educativă:</strong> Parcurge cei 5 pași pentru a învăța să folosești blockchain-ul Ethereum
                </p>
                <p className="text-cyan-300 text-sm mt-2">
                  📚 Fiecare pas îți va explica concepte importante din lumea crypto
                </p>
              </div>
            </div>            {/* Educational Setup Content */}
            <div className="space-y-8 w-full">
              {/* Step 1: Install MetaMask - Enhanced Educational */}
              <div className={`w-full bg-gradient-to-r from-gray-800/90 to-gray-700/90 rounded-2xl border-2 transition-all duration-300 backdrop-blur ${
                currentStep === 1 ? 'border-cyan-500 ring-2 ring-cyan-500 ring-opacity-30 shadow-xl shadow-cyan-500/20' : 'border-gray-600 hover:border-gray-500'
              }`}>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-full mr-4 shadow-lg">
                      <Download className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">📱 Pasul 1: Instalează MetaMask</h2>
                      <p className="text-gray-300 text-lg">Primul pas în lumea crypto: portofelul digital pentru Ethereum</p>
                      <div className="mt-2 px-3 py-1 bg-blue-600/20 rounded-full inline-block">
                        <span className="text-blue-300 text-sm font-medium">🎯 Concept: Portofele Crypto</span>
                      </div>
                    </div>
                  </div>

                  {!window.ethereum ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-red-900/80 to-pink-900/80 border border-red-600 rounded-xl p-6">
                        <h4 className="text-red-200 font-bold mb-4 flex items-center">
                          🚫 MetaMask nu este detectat în browser
                        </h4>
                        <div className="bg-red-800/50 p-4 rounded-lg mb-4">
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
                        <div className="space-y-3">
                          <p className="text-red-300 font-semibold">🔧 Pași pentru instalare:</p>
                          <ol className="list-decimal list-inside space-y-2 text-red-200 text-sm bg-red-800/30 p-4 rounded-lg">
                            <li>Mergi la site-ul oficial MetaMask</li>
                            <li>Descarcă extensia pentru browser-ul tău</li>
                            <li>Instalează extensia și urmează instrucțiunile</li>
                            <li>Creează un portofel nou cu o parolă sigură</li>
                            <li>Salvează secret phrase-ul într-un loc sigur</li>
                            <li>Reîncarcă această pagină după instalare</li>
                          </ol>
                        </div>
                        <button
                          onClick={() => window.open('https://metamask.io/download/', '_blank')}
                          className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl transition-all duration-300 inline-flex items-center space-x-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
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
                  )}
                </div>              </div>{/* Step 2: Create Wallet */}
              <div className={`w-full bg-gray-800 rounded-xl border-2 transition-all ${
                currentStep === 2 ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-700'
              }`}>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-green-600 p-3 rounded-full mr-4">
                      <Copy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">2. Creează și Salvează Portofelul</h2>
                      <p className="text-gray-400">Configurează MetaMask și fă backup la seed phrase</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-amber-900 border border-amber-700 rounded-lg p-4">
                      <h4 className="text-amber-300 font-semibold mb-3 flex items-center">
                        ⚠️ FOARTE IMPORTANT - Seed Phrase Backup
                      </h4>
                      <div className="space-y-3 text-amber-200 text-sm">
                        <p>Seed phrase-ul este cheia principală care îți permite să recuperezi portofelul. <strong>FĂRĂ el, îți poți pierde permanent fondurile!</strong></p>
                        
                        <div className="bg-amber-800 p-3 rounded">
                          <p className="font-semibold mb-2">📋 Pași pentru setup portofel nou:</p>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>Deschide MetaMask și click "Create a wallet"</li>
                            <li>Creează o parolă puternică (min. 8 caractere)</li>
                            <li>Va apărea seed phrase-ul de 12 cuvinte</li>
                            <li><strong>SCRIE cuvintele pe hârtie în ordinea exactă</strong></li>
                            <li>Verifică că ai scris corect toate cuvintele</li>
                            <li>Păstrează hârtia într-un loc FOARTE sigur</li>
                            <li>Nu face screenshot și nu îl salvezi digital!</li>
                          </ol>
                        </div>

                        <div className="bg-red-800 p-3 rounded border border-red-600">
                          <p className="font-semibold text-red-200 mb-1">🚨 NICIODATĂ NU:</p>
                          <ul className="list-disc list-inside space-y-1 text-red-300">
                            <li>Nu împărtăși seed phrase-ul cu nimeni</li>
                            <li>Nu îl introduci pe site-uri necunoscute</li>
                            <li>Nu îl salvezi în cloud sau email</li>
                            <li>Nu faci poze la el cu telefonul</li>
                          </ul>
                        </div>
                      </div>
                    </div>                    {window.ethereum && (
                      <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                        <p className="text-blue-200 mb-3">
                          💡 <strong>Ai deja MetaMask instalat!</strong> Dacă ai deja un portofel configurat, poți trece direct la conectare.
                        </p>
                        <p className="text-blue-300 text-sm mb-4">
                          Dacă vrei să creezi un portofel nou, deschide MetaMask → Settings → Advanced → Reset Account (atenție: vei pierde portofelul curent dacă nu ai backup!)
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setCurrentStep(3)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                          >
                            ✅ Am Portofel Configurat
                          </button>
                          <button
                            onClick={() => window.open('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html', '_blank')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                          >
                            📱 Deschide MetaMask
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>              {/* Step 3: Connect Wallet */}
              <div className={`w-full bg-gray-800 rounded-xl border-2 transition-all ${
                currentStep === 3 ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-700'
              }`}>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-emerald-600 p-3 rounded-full mr-4">
                      <Wallet className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">3. Conectează Portofelul</h2>
                      <p className="text-gray-400">Autorizează accesul aplicației la MetaMask</p>
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
                  )}
                </div>              </div>              {/* Step 4: Switch to Sepolia */}
              <div className={`w-full bg-gray-800 rounded-xl border-2 transition-all ${
                currentStep === 4 ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-700'
              }`}>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-purple-600 p-3 rounded-full mr-4">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">4. Schimbă la Rețeaua Sepolia</h2>
                      <p className="text-gray-400">Rețeaua de test pentru Ethereum</p>
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
                      <div className="bg-purple-900 border border-purple-700 rounded-lg p-4">
                        <p className="text-purple-200 mb-4">
                          🌐 Trebuie să schimbi rețeaua la Sepolia pentru a folosi ETH gratuit.
                        </p>
                        <div className="space-y-3">
                          <p className="text-purple-300 font-semibold">De ce Sepolia?</p>
                          <ul className="list-disc list-inside space-y-1 text-purple-200 text-sm">
                            <li>Este o rețea de test - ETH-ul nu costă bani reali</li>
                            <li>Poți obține ETH gratuit de la faucet-uri</li>
                            <li>Perfect pentru învățare și experimentare</li>
                            <li>Funcționează exact ca Ethereum Mainnet</li>
                          </ul>
                        </div>
                      </div>
                      <button
                        onClick={switchToSepolia}
                        disabled={connectionStatus.wallet !== 'connected'}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
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
                  )}
                </div>              </div>              {/* Step 5: Get Test ETH */}
              <div className={`w-full bg-gray-800 rounded-xl border-2 transition-all ${
                currentStep === 5 ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-700'
              }`}>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-yellow-600 p-3 rounded-full mr-4">
                      <Fuel className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">5. Obține ETH de Test</h2>
                      <p className="text-gray-400">Combustibil pentru tranzacțiile blockchain</p>
                    </div>
                  </div>

                  {connectionStatus.balance === 'sufficient' ? (
                    <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                          <div>
                            <p className="text-green-200">✅ Ai suficient ETH pentru aventură!</p>
                            <p className="text-green-300 text-sm">
                              Sold curent: {ethBalance} ETH (Minim necesar: {MIN_ETH_REQUIRED} ETH)
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={checkBalance}
                          className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Actualizează
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
                        <p className="text-yellow-200 mb-4">
                          ⛽ Ai nevoie de ETH pentru a plăti taxele de tranzacție (gas fees).
                        </p>
                        <div className="bg-yellow-800 p-3 rounded">
                          <p className="text-yellow-300 text-sm mb-2">Sold curent: <span className="font-semibold">{ethBalance} ETH</span></p>
                          <p className="text-yellow-300 text-sm">Minim necesar: <span className="font-semibold">{MIN_ETH_REQUIRED} ETH</span></p>
                        </div>
                        <div className="mt-4 space-y-3">
                          <p className="text-yellow-300 font-semibold">Cum să obții ETH gratuit:</p>
                          <ol className="list-decimal list-inside space-y-1 text-yellow-200 text-sm">
                            <li>Copiază adresa portofelului tău</li>
                            <li>Deschide Google Cloud Faucet pentru Sepolia</li>
                            <li>Lipește adresa în câmpul "Recipient Address"</li>
                            <li>Completează captcha-ul și apasă "Request"</li>
                            <li>Așteaptă ~30 secunde să primești ETH</li>
                          </ol>
                        </div>
                      </div>

                      {userAddress && (
                        <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                          <p className="text-blue-300 text-sm mb-2">Adresa ta pentru faucet:</p>
                          <div className="flex items-center space-x-2">
                            <code className="bg-blue-800 px-3 py-1 rounded text-blue-200 text-sm font-mono flex-1">
                              {userAddress}
                            </code>
                            <button
                              onClick={() => copyToClipboard(userAddress)}
                              className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                            >
                              <Copy className="h-4 w-4" />
                              <span>Copiază</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowFaucet(true)}
                          disabled={connectionStatus.network !== 'correct'}
                          className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
                        >
                          <ExternalLink className="h-5 w-5" />
                          <span>Deschide Faucet în App</span>
                        </button>
                        <button
                          onClick={() => window.open('https://cloud.google.com/application/web3/faucet/ethereum/sepolia', '_blank')}
                          disabled={connectionStatus.network !== 'correct'}
                          className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
                        >
                          <ExternalLink className="h-5 w-5" />
                          <span>Deschide în Tab Nou</span>
                        </button>
                        <button
                          onClick={checkBalance}
                          disabled={connectionStatus.network !== 'correct'}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors"
                        >
                          Verifică Sold
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>              {/* Ready to Enter */}
              {connectionStatus.ready && (
                <div className="w-full bg-gradient-to-r from-emerald-900 to-blue-900 border-2 border-emerald-500 rounded-xl p-8 text-center">
                  <div className="mb-6">
                    <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">🎉 Gata de Aventură!</h2>
                    <p className="text-emerald-200">
                      Ai completat cu succes toate cerințele pentru a accesa camera secretă.
                    </p>
                  </div>
                  <button
                    onClick={enterCryptoRoom}
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    🚪 Intră în Camera Secretă
                  </button>
                </div>
              )}
            </div>
          </div>        </div>
      </div>{/* Faucet Modal */}
      {showFaucet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full h-[80vh] border border-gray-700">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Google Cloud Faucet - Sepolia ETH</h3>
              <button
                onClick={() => setShowFaucet(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4 bg-blue-900 border border-blue-700 rounded p-3">
                <p className="text-blue-300 text-sm">
                  📝 Adresa ta: <span className="font-mono text-blue-200">{userAddress}</span>
                </p>
                <p className="text-blue-300 text-sm mt-1">
                  💡 Copiază această adresă în faucet pentru a primi ETH
                </p>
              </div>
              <iframe
                src="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                className="w-full h-[calc(80vh-180px)] border border-gray-600 rounded"
                title="Google Cloud Faucet"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CameraEntry;

