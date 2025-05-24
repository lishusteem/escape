import React, { useState } from 'react';
import { X, Vote, Info, Users } from 'lucide-react';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVote: () => Promise<void>;
  isLoading: boolean;
}

const VoteModal: React.FC<VoteModalProps> = ({
  isOpen,
  onClose,
  onVote,
  isLoading
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen) return null;

  const proposalText = "Susții implementarea noilor protocoale de guvernanță descentralizată?";
  const voteOption = "DA - Susțin";
  const estimatedGas = 25000;
  const estimatedCostEth = (estimatedGas * 20) / 1e9; // 20 gwei

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <Vote size={24} className="mr-2 text-purple-400" />
            Votare Descentralizată
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <div className="mb-3">
            <p className="text-gray-300 text-sm font-medium mb-2">
              <span className="text-yellow-300 mr-1">🗳️</span> 
              <span className="font-semibold">Propunerea de votat:</span>
            </p>
            <div className="bg-gray-700 p-3 rounded-md border-l-4 border-purple-500">
              <p className="text-white font-medium mb-2">"{proposalText}"</p>
              <div className="flex items-center justify-between">
                <span className="text-purple-300 font-semibold">Votul tău: {voteOption}</span>
                <span className="text-green-400">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detalii vot - educativ */}
        <div className="bg-gray-700 rounded-md p-3 mb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-sm text-blue-300 hover:text-blue-200 mb-2"
          >
            <Info size={16} className="mr-1" />
            {showDetails ? 'Ascunde' : 'Arată'} detaliile votului
          </button>
          
          {showDetails && (
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Tip guvernanță:</span>
                <span className="text-green-300">DAO (Organizație Autonomă Descentralizată)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gas estimat:</span>
                <span className="text-yellow-300">{estimatedGas.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cost estimat:</span>
                <span className="text-red-300">~{estimatedCostEth.toFixed(6)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Valoare ETH:</span>
                <span className="text-purple-300">0.000001 ETH</span>
              </div>
              <div className="text-gray-500 text-xs mt-2">
                🗳️ Votul va fi înregistrat permanent pe blockchain
              </div>
            </div>
          )}
        </div>

        {/* Explicație educativă */}
        <div className="bg-purple-900 bg-opacity-30 border border-purple-600 rounded-md p-3 mb-4">
          <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center">
            <Users size={16} className="mr-1" />
            🎓 Votarea pe blockchain:
          </h4>
          <ul className="text-xs text-purple-200 space-y-1">
            <li>• <strong>Transparență:</strong> Toate voturile sunt vizibile public</li>
            <li>• <strong>Imutabilitate:</strong> Voturile nu pot fi modificate sau șterse</li>
            <li>• <strong>Descentralizare:</strong> Nicio autoritate centrală nu controlează procesul</li>
            <li>• <strong>Verificabilitate:</strong> Oricine poate verifica rezultatele</li>
            <li>• <strong>Pseudonimitate:</strong> Adresa wallet-ului este publică, nu identitatea</li>
          </ul>
        </div>

        {/* Avantajele DAO */}
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-600 rounded-md p-3 mb-4">
          <h4 className="text-sm font-semibold text-indigo-300 mb-2">🏛️ Avantajele DAO:</h4>
          <ul className="text-xs text-indigo-200 space-y-1">
            <li>• Eliminarea intermediarilor și birocrației</li>
            <li>• Participare globală 24/7</li>
            <li>• Execuție automată prin smart contracts</li>
            <li>• Guvernanță comunitară democratică</li>
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
            onClick={onVote}
            disabled={isLoading}
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
                Votează DA
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteModal;