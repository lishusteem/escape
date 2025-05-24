import { useState, useEffect } from 'react';
import { Shield, Wallet, Globe, Fuel, CheckCircle, AlertCircle, X } from 'lucide-react';

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
  }, []);

  // Check balance when user address changes and we're on the right network
  useEffect(() => {
    if (userAddress && connectionStatus.network === 'correct') {
      checkBalance();
    }
  }, [userAddress, connectionStatus.network]);

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'connected':
      case 'correct':
      case 'sufficient':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'connecting':
      case 'checking':
        return <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };
  const enterCryptoRoom = () => {
    // Trigger intrarea în camera principală
    onEntryComplete();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
          {/* Header */}
          <div className="p-8 text-center border-b border-gray-700">
            <Shield className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Intrarea în Camera Secretă
            </h1>
            <p className="text-gray-300">
              Pentru a accesa misterele lui Satoshi Nakamoto, verifică-ți pregătirea digitală
            </p>
          </div>

          {/* Status Checks */}
          <div className="p-8 space-y-6">
            
            {/* Wallet Connection */}
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Wallet className="h-6 w-6 text-blue-400" />
                <div>
                  <h3 className="text-white font-medium">Portofel Digital</h3>
                  <p className="text-gray-400 text-sm">
                    {connectionStatus.wallet === 'connected' 
                      ? `Conectat: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
                      : 'Conectează MetaMask pentru a continua'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <StatusIcon status={connectionStatus.wallet} />
                {connectionStatus.wallet !== 'connected' && (
                  <button
                    onClick={connectWallet}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Conectează
                  </button>
                )}
              </div>
            </div>

            {/* Network Check */}
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="h-6 w-6 text-green-400" />
                <div>
                  <h3 className="text-white font-medium">Rețea Blockchain</h3>
                  <p className="text-gray-400 text-sm">
                    {connectionStatus.network === 'correct' 
                      ? 'Conectat la Sepolia Testnet'
                      : 'Trebuie să fii pe rețeaua Sepolia'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <StatusIcon status={connectionStatus.network} />
                {connectionStatus.network === 'wrong' && (
                  <button
                    onClick={switchToSepolia}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Schimbă
                  </button>
                )}
              </div>
            </div>

            {/* Balance Check */}
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Fuel className="h-6 w-6 text-yellow-400" />
                <div>
                  <h3 className="text-white font-medium">Combustibil Digital</h3>
                  <p className="text-gray-400 text-sm">
                    Sold: {ethBalance} ETH 
                    {connectionStatus.balance === 'sufficient' 
                      ? ' (Suficient pentru aventură)'
                      : ` (Minim ${MIN_ETH_REQUIRED} ETH necesar)`
                    }
                  </p>
                </div>
              </div>            <div className="flex items-center space-x-2">
                <StatusIcon status={connectionStatus.balance} />
                {connectionStatus.wallet === 'connected' && connectionStatus.network === 'correct' && (
                  <button
                    onClick={checkBalance}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Verifică
                  </button>
                )}              {connectionStatus.balance === 'insufficient' && (
                  <button
                    onClick={() => setShowFaucet(true)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                  >
                    <span>Obține ETH</span>
                    <Fuel className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>        {/* Google Cloud Faucet Info */}
        {!connectionStatus.ready && (
          <div className="px-8 pb-4">
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
              <h4 className="text-blue-300 font-medium mb-2">🚰 Obține ETH pentru teste:</h4>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => setShowFaucet(true)}
                  className="w-full text-blue-400 hover:text-blue-300 bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded transition-colors"
                >
                  📱 Deschide Google Cloud Faucet în aplicație
                </button>
                <p className="text-blue-300 text-xs">
                  💡 Click pe butonul de mai sus pentru a deschide faucet-ul direct în aplicație
                </p>
              </div>
            </div>
          </div>
        )}

          {/* Entry Button */}
          <div className="p-8 pt-4">
            {connectionStatus.ready ? (
              <button
                onClick={enterCryptoRoom}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🚪 Intră în Camera Secretă
              </button>
            ) : (
              <div className="w-full bg-gray-600 text-gray-400 font-bold py-4 px-6 rounded-lg text-lg text-center">
                Completează toate verificările pentru a continua
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="px-8 pb-8 text-center">
            <p className="text-gray-400 text-sm">
              💡 Dacă întâmpini probleme, verifică că MetaMask este instalat și deblokat.
              <br />
              Pentru prima vizită, va trebui să obții ETH gratuit de la un faucet.
            </p>
          </div>
        </div>
      </div>

      {/* Faucet Modal */}
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
