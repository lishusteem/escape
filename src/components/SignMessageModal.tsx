import React, { useState } from 'react';
import { X, PenTool, Info, Shield } from 'lucide-react';

interface SignMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignMessage: () => Promise<void>;
  isLoading: boolean;
}

const SignMessageModal: React.FC<SignMessageModalProps> = ({
  isOpen,
  onClose,
  onSignMessage,
  isLoading
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen) return null;

  const message = "Susțin revoluția cypherpunk și libertatea financiară!";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <PenTool size={24} className="mr-2 text-blue-400" />
            Semnează Mesajul
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <div className="mb-3">
            <p className="text-gray-300 text-sm font-medium mb-2">
              <span className="text-yellow-300 mr-1">✊</span> 
              <span className="font-semibold">Mesajul de semnat:</span>
            </p>
            <div className="bg-gray-700 p-3 rounded-md border-l-4 border-blue-500">
              <p className="text-white font-medium italic">"{message}"</p>
            </div>
          </div>
        </div>

        {/* Detalii semnătură - educativ */}
        <div className="bg-gray-700 rounded-md p-3 mb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-sm text-blue-300 hover:text-blue-200 mb-2"
          >
            <Info size={16} className="mr-1" />
            {showDetails ? 'Ascunde' : 'Arată'} detaliile semnăturii
          </button>
          
          {showDetails && (
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Tip semnătură:</span>
                <span className="text-green-300">personal_sign (EIP-191)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cost:</span>
                <span className="text-green-300">GRATUIT (fără gas)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lungime mesaj:</span>
                <span className="text-yellow-300">{message.length} caractere</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Semnătură rezultat:</span>
                <span className="text-purple-300">65 bytes (hex)</span>
              </div>
              <div className="text-gray-500 text-xs mt-2">
                🔐 Semnătura dovedește că dețineți cheia privată
              </div>
            </div>
          )}
        </div>

        {/* Explicație educativă */}
        <div className="bg-purple-900 bg-opacity-30 border border-purple-600 rounded-md p-3 mb-4">
          <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center">
            <Shield size={16} className="mr-1" />
            🎓 Ce este o semnătură digitală:
          </h4>
          <ul className="text-xs text-purple-200 space-y-1">
            <li>• <strong>Autentificare:</strong> Dovedești că ești proprietarul wallet-ului</li>
            <li>• <strong>Fără cost:</strong> Nu necesită tranzacție sau gas</li>
            <li>• <strong>Offline:</strong> Se poate face fără conexiune la blockchain</li>
            <li>• <strong>Securitate:</strong> Cheia privată nu părăsește niciodată wallet-ul</li>
            <li>• <strong>Verificare:</strong> Oricine poate verifica că tu ai semnat mesajul</li>
          </ul>
        </div>

        {/* Secțiune de avertizare */}
        <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-md p-3 mb-4">
          <h4 className="text-sm font-semibold text-yellow-300 mb-2">⚠️ Important:</h4>
          <p className="text-xs text-yellow-200">
            Semnează doar mesaje de la aplicații în care ai încredere. 
            Verifică întotdeauna conținutul mesajului înainte de semnare.
          </p>
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
            onClick={onSignMessage}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Semnez...
              </>
            ) : (
              <>
                <PenTool size={16} className="mr-1" />
                Semnează Mesajul
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignMessageModal;