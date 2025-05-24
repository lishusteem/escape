import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useZeroXSwap } from '../hooks/useZeroXSwap';

interface ZeroXSwapComponentProps {
  onSwapSuccess?: (txHash: string) => void;
  onError?: (error: string) => void;
}

const ZeroXSwapComponent: React.FC<ZeroXSwapComponentProps> = ({
  onSwapSuccess,
  onError
}) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState('');
  const [ethAmount, setEthAmount] = useState('0.01');
  const [tokenAddress, setTokenAddress] = useState('0x87385341ddc97a7610603299f42fc386e2c13e59'); // TEST token
  const [balance, setBalance] = useState('0');

  const { quote, loading, error, txHash, getSwapQuote, executeSwap, resetState } = useZeroXSwap();

  const SEPOLIA_CHAIN_ID = 11155111;

  // Token options for Sepolia
  const TOKEN_OPTIONS = {
    'TEST': '0x87385341ddc97a7610603299f42fc386e2c13e59',
    'LINK': '0x779877A7B0D9E8603169DdbD7836e478b4624789',
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask nu este instalat!');
      }
      
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
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
      if (provider && account) {
        try {
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
  }, [provider, account]);

  // Handle swap process
  const handleSwap = async () => {
    if (!signer) {
      if (onError) onError('Conectați wallet-ul mai întâi!');
      return;
    }

    try {
      // Get quote
      await getSwapQuote(ethAmount, tokenAddress, signer);
      
      // Execute swap immediately after getting quote
      const resultTxHash = await executeSwap(signer);
      
      if (onSwapSuccess && resultTxHash) {
        onSwapSuccess(resultTxHash);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Swap-ul a eșuat';
      if (onError) onError(errorMsg);
    }
  };

  return (
    <div className="zero-x-swap-container bg-gray-800 rounded-lg p-6 text-white">
      <h3 className="text-xl font-bold mb-4 text-center text-cyan-400">
        🚀 0x Protocol Swap (Real)
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                🎯 Token țintă:
              </label>
              <select
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                disabled={loading}
              >
                {Object.entries(TOKEN_OPTIONS).map(([name, address]) => (
                  <option key={name} value={address}>{name} Token</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quote Display */}
          {quote && (
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-sm font-medium text-cyan-400 mb-2">📊 Cotație 0x:</div>
              <div className="text-xs space-y-1">
                <div>ETH In: {ethers.utils.formatEther(quote.sellAmount)}</div>
                <div>Tokens Out: {quote.buyAmount}</div>
                <div>Gas: {parseInt(quote.gas).toLocaleString()}</div>
                <div>Gas Price: {ethers.utils.formatUnits(quote.gasPrice, 'gwei')} gwei</div>
                {quote.estimatedPriceImpact && (
                  <div>Impact: {quote.estimatedPriceImpact}%</div>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-600/20 border border-red-500 rounded-lg p-3 text-red-200">
              ❌ {error}
            </div>
          )}

          {/* Success Display */}
          {txHash && (
            <div className="bg-green-600/20 border border-green-500 rounded-lg p-3 text-green-200">
              ✅ Swap 0x reușit!
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
          )}

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={loading || !ethAmount || parseFloat(ethAmount) <= 0 || parseFloat(ethAmount) > parseFloat(balance)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Procesez...' : '⚡ Execută Swap 0x'}
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

export default ZeroXSwapComponent;
