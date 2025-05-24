import React, { useState } from 'react';
import { X, ArrowDownUp, Info } from 'lucide-react';

interface HybridSwapComponentProps {
  userAddress: string;
  onSwapSuccess: (txHash: string) => void;
  onSwapError: (error: any) => void;
  onClose: () => void;
  showTxLoadingModal: (txHash: string) => void;
  hideTxLoadingModal: () => void;
  contracts?: any;
}

const HybridSwapComponent: React.FC<HybridSwapComponentProps> = ({
  userAddress,
  onSwapSuccess,
  onSwapError,
  onClose,
  showTxLoadingModal,
  hideTxLoadingModal,
}) => {
  const [ethAmount, setEthAmount] = useState('0.001');
  const [isSwapping, setIsSwapping] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSwap = async () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      onSwapError(new Error('Introduceți o sumă validă'));
      return;
    }

    setIsSwapping(true);
    
    try {
      // Simplu transfer ETH către adresa UNI pentru simularea swap-ului
      const provider = new (window as any).ethereum ? 
        new (await import('ethers')).ethers.providers.Web3Provider((window as any).ethereum) : null;
      
      if (!provider) {
        throw new Error('MetaMask nu este disponibil');
      }

      const signer = provider.getSigner();
      const swapAmount = (await import('ethers')).ethers.utils.parseEther(ethAmount);
      
      // Adresa UNI pentru "swap" (în realitate un transfer simplu)
      const uniTokenAddress = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
      
      const tx = await signer.sendTransaction({
        to: uniTokenAddress,
        value: swapAmount,
        gasLimit: 21000
      });

      showTxLoadingModal(tx.hash);
      await tx.wait();
      hideTxLoadingModal();
      
      onSwapSuccess(tx.hash);
      
    } catch (error: any) {
      console.error('Eroare swap:', error);
      hideTxLoadingModal();
      onSwapError(error);
    } finally {
      setIsSwapping(false);
    }
  };

  const estimatedUni = (parseFloat(ethAmount) * 1000).toFixed(2); // Rate estimat 1 ETH = 1000 UNI

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-lg relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">🦄 Swap ETH → UNI</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Educational Header */}
      <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 mb-6">
        <h4 className="text-blue-300 font-semibold mb-2">🎓 Despre acest swap:</h4>
        <p className="text-blue-200 text-sm">
          Pentru simplificare educațională, acest "swap" trimite ETH către adresa token-ului UNI.
          În realitate, Uniswap folosește contracte inteligente complexe pentru schimbul de token-uri.
        </p>
      </div>

      {/* Swap Interface */}
      <div className="space-y-4 mb-6">
        {/* From ETH */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">De la</span>
            <span className="text-xs text-gray-400">ETH</span>
          </div>
          <input
            type="number"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
            placeholder="0.001"
            className="w-full bg-transparent text-xl font-semibold text-white border-none outline-none"
            step="0.001"
            min="0.001"
            disabled={isSwapping}
          />
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center">
          <ArrowDownUp className="text-purple-400" size={24} />
        </div>

        {/* To UNI */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Către</span>
            <span className="text-xs text-gray-400">UNI</span>
          </div>
          <div className="text-xl font-semibold text-gray-400">
            ~{estimatedUni} UNI
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-gray-700 rounded-md p-3 mb-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center text-sm text-blue-300 hover:text-blue-200 mb-2"
        >
          <Info size={16} className="mr-1" />
          {showDetails ? 'Ascunde' : 'Arată'} detaliile swap-ului
        </button>
        
        {showDetails && (
          <div className="text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Rate estimat:</span>
              <span className="text-green-300">1 ETH = 1000 UNI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Taxe de rețea:</span>
              <span className="text-yellow-300">~21,000 gas</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tip tranzacție:</span>
              <span className="text-purple-300">Transfer simplu</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onClose}
          disabled={isSwapping}
          className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white py-2 px-4 rounded-md transition-colors"
        >
          Anulează
        </button>
        <button
          onClick={handleSwap}
          disabled={!ethAmount || parseFloat(ethAmount) <= 0 || isSwapping}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
        >
          {isSwapping ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Swap în curs...
            </>
          ) : (
            'Swap ETH → UNI'
          )}
        </button>
      </div>
    </div>
  );
};

export default HybridSwapComponent;
