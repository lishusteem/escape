import React, { useState } from 'react';
import { X, Clock, Info, Calendar } from 'lucide-react';

interface TimestampModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTimestamp: () => Promise<void>;
  isLoading: boolean;
}

const TimestampModal: React.FC<TimestampModalProps> = ({
  isOpen,
  onClose,
  onCreateTimestamp,
  isLoading
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen) return null;

  const currentDate = new Date();
  const timestamp = Math.floor(currentDate.getTime() / 1000);
  const estimatedGas = 21000;
  const estimatedCostEth = (estimatedGas * 20) / 1e9; // 20 gwei

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <Clock size={24} className="mr-2 text-green-400" />
            Timestamp pe Blockchain
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <div className="mb-3">
            <p className="text-gray-300 text-sm font-medium mb-2">
              <span className="text-yellow-300 mr-1">🕐</span> 
              <span className="font-semibold">Timestamp-ul care va fi înregistrat:</span>
            </p>
            <div className="bg-gray-700 p-3 rounded-md border-l-4 border-green-500">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">{currentDate.toLocaleString('ro-RO')}</span>
                <span className="text-green-300 font-mono text-sm">{timestamp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detalii timestamp - educativ */}
        <div className="bg-gray-700 rounded-md p-3 mb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-sm text-blue-300 hover:text-blue-200 mb-2"
          >
            <Info size={16} className="mr-1" />
            {showDetails ? 'Ascunde' : 'Arată'} detaliile timestamp-ului
          </button>
          
          {showDetails && (
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Format Unix:</span>
                <span className="text-green-300 font-mono">{timestamp} secunde</span>
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
                ⏰ Timestamp-ul va fi permanent pe blockchain
              </div>
            </div>
          )}
        </div>

        {/* Explicație educativă */}
        <div className="bg-green-900 bg-opacity-30 border border-green-600 rounded-md p-3 mb-4">
          <h4 className="text-sm font-semibold text-green-300 mb-2 flex items-center">
            <Calendar size={16} className="mr-1" />
            🎓 Ce este un timestamp pe blockchain:
          </h4>
          <ul className="text-xs text-green-200 space-y-1">
            <li>• <strong>Dovada timpului:</strong> Înregistrează momentul exact când s-a făcut tranzacția</li>
            <li>• <strong>Imutabil:</strong> Nu poate fi modificat sau falsificat</li>
            <li>• <strong>Sincronizat:</strong> Toate nodurile din rețea confirmă același timp</li>
            <li>• <strong>Unix Format:</strong> Timpul este stocat în secunde de la 1 ianuarie 1970</li>
            <li>• <strong>Verificabil:</strong> Oricine poate verifica când s-a făcut tranzacția</li>
          </ul>
        </div>

        {/* Cazuri de utilizare */}
        <div className="bg-blue-900 bg-opacity-30 border border-blue-600 rounded-md p-3 mb-4">
          <h4 className="text-sm font-semibold text-blue-300 mb-2">💡 Utilizări practice:</h4>
          <ul className="text-xs text-blue-200 space-y-1">
            <li>• Dovezi legale pentru contracte</li>
            <li>• Înregistrarea proprietății intelectuale</li>
            <li>• Audit trail pentru tranzacții financiare</li>
            <li>• Sisteme de votare transparente</li>
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
            onClick={onCreateTimestamp}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Înregistrez...
              </>
            ) : (
              <>
                <Clock size={16} className="mr-1" />
                Creează Timestamp
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimestampModal;