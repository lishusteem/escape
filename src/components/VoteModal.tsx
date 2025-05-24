import React, { useState } from 'react';
import { X, Vote, Info, CheckCircle, XCircle } from 'lucide-react';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVote: (voteType: 'NU' | 'DA') => Promise<void>;
  isLoading: boolean;
}

const VoteModal: React.FC<VoteModalProps> = ({
  isOpen,
  onClose,
  onVote,
  isLoading
}) => {
  const [selectedVote, setSelectedVote] = useState<'NU' | 'DA' | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen) return null;

  const estimatedGas = 21000;
  const estimatedCostEth = (estimatedGas * 20) / 1e9; // 20 gwei  // Adresele pentru votare
  const voteAddresses = {
    NU: '0x742d35Cc6634C0532925a3b8D5c59009e0c20bba',  // Adresa validă pentru NU
    DA: '0x000000000000000000000000000000000000dEaD'  // Burn address pentru DA
  };

  const handleVote = () => {
    if (selectedVote) {
      onVote(selectedVote);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <Vote size={24} className="mr-2 text-purple-400" />
            Votează pentru Descentralizare
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <div className="mb-3">
            <p className="text-gray-300 text-sm font-medium mb-2">
              <span className="text-yellow-300 mr-1">🗳️</span> 
              <span className="font-semibold">Întrebare:</span> "Crezi că descentralizarea este viitorul financiar?"
            </p>
            <p className="text-gray-400 text-xs italic mb-4">
              Votul tău va fi înregistrat permanent pe blockchain. Alege cu înțelepciune!
            </p>
          </div>

          {/* Opțiuni de vot */}
          <div className="space-y-3 mb-4">
            <button
              onClick={() => setSelectedVote('NU')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedVote === 'NU'
                  ? 'border-red-500 bg-red-900 bg-opacity-30'
                  : 'border-gray-600 bg-gray-700 hover:border-red-400'
              }`}
              disabled={isLoading}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle size={20} className="mr-3 text-red-400" />
                  <span className="font-medium">NU</span>
                </div>
                <span className="text-xs text-gray-400">Sistemul tradițional e mai bun</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedVote('DA')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedVote === 'DA'
                  ? 'border-green-500 bg-green-900 bg-opacity-30'
                  : 'border-gray-600 bg-gray-700 hover:border-green-400'
              }`}
              disabled={isLoading}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle size={20} className="mr-3 text-green-400" />
                  <span className="font-medium">DA</span>
                </div>
                <span className="text-xs text-gray-400">Libertatea financiară pentru toți!</span>
              </div>
            </button>
          </div>

          {selectedVote && (
            <div className="bg-blue-900 bg-opacity-30 border border-blue-600 rounded-md p-3 mb-4">
              <p className="text-sm text-blue-200">
                <span className="font-semibold">Adresa pentru {selectedVote}:</span>
              </p>
              <p className="text-xs font-mono text-blue-300 break-all mt-1">
                {voteAddresses[selectedVote]}
              </p>
            </div>
          )}
        </div>

        {/* Detalii tranzacție - educativ */}
        <div className="bg-gray-700 rounded-md p-3 mb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-sm text-blue-300 hover:text-blue-200 mb-2"
          >
            <Info size={16} className="mr-1" />
            {showDetails ? 'Ascunde' : 'Arată'} detaliile votării
          </button>
          
          {showDetails && (
            <div className="text-xs space-y-2">              <div className="flex justify-between">
                <span className="text-gray-400">Valoare tranzacție:</span>
                <span className="text-purple-300">0.000001 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gas estimat:</span>
                <span className="text-yellow-300">{estimatedGas.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cost estimat:</span>
                <span className="text-red-300">~{estimatedCostEth.toFixed(6)} ETH</span>
              </div>
              <div className="text-gray-500 text-xs mt-2">
                💡 Votul tău va fi înregistrat permanent pe blockchain
              </div>
            </div>
          )}
        </div>

        {/* Explicație educativă */}
        <div className="bg-purple-900 bg-opacity-30 border border-purple-600 rounded-md p-3 mb-4">
          <h4 className="text-sm font-semibold text-purple-300 mb-2">🎓 Despre votare descentralizată:</h4>
          <ul className="text-xs text-purple-200 space-y-1">
            <li>• Voturile sunt transparente și verificabile</li>
            <li>• Nu pot fi modificate sau șterse</li>
            <li>• Fiecare adresă poate vota o singură dată</li>
            <li>• Rezultatele sunt accesibile tuturor</li>
            <li>• {selectedVote === 'DA' ? '🔓 Votul DA deschide sertarul!' : '🔒 Doar votul DA deschide sertarul'}</li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
            disabled={isLoading}
          >
            Anulează
          </button>
          <button
            onClick={handleVote}
            disabled={!selectedVote || isLoading}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Votez...
              </>
            ) : (
              <>
                <Vote size={16} className="mr-1" />
                Votează {selectedVote}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteModal;