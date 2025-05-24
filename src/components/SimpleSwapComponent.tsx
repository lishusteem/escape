import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useUniSwap } from '../hooks/useEthSwap';

interface SimpleSwapComponentProps {
  onSwapSuccess?: (txHash: string) => void;
  onError?: (error: string) => void;
  onTxSent?: (txHash: string) => void;      // Callback when transaction is sent
  // onTxConfirmed is effectively onSwapSuccess for this component's parent
}

const SimpleSwapComponent: React.FC<SimpleSwapComponentProps> = ({
  onSwapSuccess,
  onError,
  onTxSent,
}) => {  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState('');
  const [ethAmount, setEthAmount] = useState('0.01');
  const [balance, setBalance] = useState('0');

  const { 
    quote, 
    loading, 
    isConfirming, 
    error,
    txHash, 
    swapSuccess, 
    getSwapQuote, 
    executeSwap, 
    resetState 
  } = useUniSwap({
    onTxSent: (hash) => {
      if (onTxSent) onTxSent(hash);
    },
    onTxConfirmed: (hash) => {
      if (onSwapSuccess) onSwapSuccess(hash);
    },
    onTxError: (err) => {
      if (onError) onError(err.message || 'A apărut o eroare la swap.');
    }
  });

  const SEPOLIA_CHAIN_ID = 11155111;

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask nu este instalat!');
      }      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      await provider.send("eth_requestAccounts", []);
      
      const network = await provider.getNetwork();
      if (network.chainId !== SEPOLIA_CHAIN_ID) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
        });
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
    } catch (err: any) {
      const errorMsg = err.message || 'Conectarea wallet-ului a eșuat';
      if (onError) onError(errorMsg);
    }
  };

  // Update balance
  useEffect(() => {
    const updateBalance = async () => {
      if (provider && account) {        try {
          const balance = await provider.getBalance(account);
          setBalance(ethers.utils.formatEther(balance));
        } catch (error) {
          console.error('Balance check failed:', error);
        }
      }
    };

    updateBalance();
    if (provider && account) {
      const interval = setInterval(updateBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [provider, account]);  // useEffect to get initial/updated quote when wallet is connected or ethAmount changes.
  useEffect(() => {
    let timeoutId: number;

    const fetchQuoteForCurrentAmount = async () => {
      if (account && signer && provider && ethAmount && parseFloat(ethAmount) > 0) {
        await getSwapQuote(ethAmount, signer);
      }
    };

    if (account && signer && provider && ethAmount && parseFloat(ethAmount) > 0) {
      // Add a small delay to debounce rapid changes
      timeoutId = setTimeout(() => {
        fetchQuoteForCurrentAmount();
      }, 500); // 500ms debounce
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [account, signer, provider, ethAmount, getSwapQuote]); // Include getSwapQuote but it's now memoized

  // Handle swap process
  const handleSwap = async () => {
    if (!signer) {
      if (onError) onError('Conectați wallet-ul mai întâi!');
      return;
    }
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      // Error will be set by getSwapQuote if amount is invalid regarding balance
      // but good to have a basic check here too.
      if (onError) onError('Suma ETH trebuie să fie un număr pozitiv valid.');
      return;
    }

    try {
      // setLoading(true) is handled by the hook now
      const currentQuote = await getSwapQuote(ethAmount, signer);
      if (!currentQuote || error) { // Check error state from hook after getSwapQuote
        // onError would have been called by the hook if getSwapQuote failed
        return;
      }
      
      // executeSwap will call onTxSent, onTxConfirmed, onTxError via the hook
      await executeSwap(signer);
      
      // onSwapSuccess is called via onTxConfirmed callback in useUniSwap options

    } catch (err: any) { 
      // This catch should ideally not be hit if the hook handles errors properly
      // and calls onTxError. Kept as a fallback.
      const errorMsg = err.message || 'Swap-ul a eșuat (catch general în componentă)';
      if (onError) onError(errorMsg);
    }
    // setLoading(false) is handled by the hook now
  };

  return (
    <div className="simple-swap-container bg-gray-800 rounded-lg p-6 text-white">      <h3 className="text-xl font-bold mb-4 text-center text-cyan-400">
        🦄 UNI Token Swap (ETH Direct)
      </h3>

      {/* Wallet Status */}
      {!account ? (
        <div className="text-center">
          <button 
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            disabled={loading}
          >
            🔗 Conectează Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Account Info */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-sm text-gray-300">Cont:</div>
            <div className="font-mono text-cyan-400">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
            <div className="text-sm text-gray-300 mt-1">
              Balanță: {parseFloat(balance).toFixed(4)} ETH
            </div>
          </div>

          {/* Swap Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                💰 Sumă ETH:
              </label>
              <input
                type="number"
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
                step="0.001"
                min="0.001"
                max={balance}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                disabled={loading}
              />
            </div>            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                🦄 Primești UNI:
              </label>
              <div className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-cyan-400 font-mono">
                {quote ? ethers.utils.formatUnits(quote.buyAmount, 18) : loading ? 'Se încarcă...' : '0.00'} UNI
              </div>              <div className="text-xs text-gray-400 mt-1">
                {quote ? `Rate: 1 ETH = ${parseFloat(quote.rate).toFixed(2)} UNI (simulat direct)` : 'Introduceți suma pentru cotație'}
              </div>
            </div>
          </div>          {/* Quote Display */}
          {quote && (
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-sm font-medium text-cyan-400 mb-2">📊 Cotație Simulată:</div>
              <div className="text-xs space-y-1">
                <div>💰 ETH In: {ethers.utils.formatEther(quote.sellAmount)}</div>
                <div>🦄 UNI Out: {ethers.utils.formatUnits(quote.buyAmount, 18)}</div>
                <div>📊 Rate: 1 ETH = {parseFloat(quote.rate).toFixed(4)} UNI</div>
                <div>⛽ Gas estimat: {ethers.BigNumber.from(quote.estimatedGas).toString()}</div>
                <div className="text-gray-400">🔄 Transfer direct ETH</div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-600/20 border border-red-500 rounded-lg p-3 text-red-200">
              ❌ {error} {/* Display error from hook */}
            </div>
          )}

          {/* Transaction Status Display - Unified */}
          {txHash && !swapSuccess && !error && (
            <div className={`p-3 rounded-lg ${isConfirming ? 'bg-yellow-600/20 border-yellow-500 text-yellow-200' : 'bg-blue-600/20 border-blue-500 text-blue-200'}`}>
              {isConfirming 
                ? `⏳ Confirmare tranzacție...` 
                : `🔗 Tranzacție trimisă! Aștept confirmarea...`}
              <div className="mt-1">
                <a 
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline text-sm"
                >
                  Vezi pe Etherscan
                </a>
              </div>
            </div>
          )}          {/* Success Display */}
          {swapSuccess && txHash && (
            <div className="bg-green-600/20 border border-green-500 rounded-lg p-3 text-green-200">
              ✅ Swap ETH direct reușit!
              <div className="mt-1">
                <a 
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline text-sm"
                >
                  Vezi pe Etherscan
                </a>
              </div>
            </div>
          )}          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={loading || isConfirming || !ethAmount || parseFloat(ethAmount) <= 0 || parseFloat(ethAmount) > parseFloat(balance)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
          >
            {loading || isConfirming ? '⏳ Procesez ETH...' : '⚡ Execută Swap Direct'}
          </button>

          {/* Reset Button */}
          {(quote || error || txHash) && (
            <button
              onClick={resetState}
              className="w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              disabled={loading}
            >
              🔄 Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleSwapComponent;
