import React, { useState } from 'react';
import { ethers } from 'ethers';
import { X, Send, Info } from 'lucide-react';

interface SendSecretMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

const SendSecretMessageModal: React.FC<SendSecretMessageModalProps> = ({
  isOpen,
  onClose,
  onSendMessage,
  isLoading
}) => {
  const [message, setMessage] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen) return null;

  // Calculează detaliile tranzacției în timp real
  const messageBytes = ethers.utils.toUtf8Bytes(message);
  const messageHex = ethers.utils.hexlify(messageBytes);
  const messageSizeBytes = messageBytes.length;
  const estimatedGas = 21000 + (messageSizeBytes * 16); // Gas de bază + gas pentru data
  const estimatedCostEth = (estimatedGas * 20) / 1e9; // Estimare cu 20 gwei

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-6xl max-h-[90vh] overflow-y-auto"><div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <Send size={24} className="mr-2 text-purple-400" />
            📧 Trimite Mesaj Secret
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Educational Content */}
          <div className="lg:w-1/2">
            {/* Philosophy of Encrypted Communication */}
            <div className="bg-gradient-to-r from-cyan-900 to-blue-900 bg-opacity-30 border border-cyan-600 rounded-md p-4 mb-4">
              <h4 className="text-sm font-semibold text-cyan-300 mb-3 flex items-center">
                <span className="mr-2">🔒</span>
                Filozofia Comunicației Criptate
              </h4>
              <ul className="text-xs text-cyan-200 space-y-2">
                <li>• <span className="font-semibold">Confidențialitatea Absolută:</span> Mesajele tale nu pot fi citite de terți</li>
                <li>• <span className="font-semibold">Imutabilitatea Istoriei:</span> Odată trimis, mesajul devine parte din istoric</li>
                <li>• <span className="font-semibold">Rezistența la Cenzură:</span> Nimeni nu poate șterge sau bloca mesajul</li>
                <li>• <span className="font-semibold">Transparența Procesului:</span> Tranzacția este publică, conținutul privat</li>
              </ul>
            </div>

            {/* Evolution of Secret Communication */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 bg-opacity-30 border border-purple-600 rounded-md p-4 mb-4">
              <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center">
                <span className="mr-2">📡</span>
                Evoluția Comunicației Secrete
              </h4>
              <div className="text-xs text-purple-200 space-y-2">
                <div><span className="font-bold text-yellow-300">Antichitate</span> - Cifrul Caesar: primele coduri simple</div>
                <div><span className="font-bold text-yellow-300">1914-1918</span> - Enigma: criptografie mecanică în război</div>
                <div><span className="font-bold text-yellow-300">1991</span> - PGP: criptografia pentru toți cetățenii</div>
                <div><span className="font-bold text-yellow-300">2009</span> - Bitcoin: mesaje pe blockchain</div>
                <div><span className="font-bold text-yellow-300">2015+</span> - Ethereum: contracte cu date criptate</div>
              </div>
            </div>

            {/* Power of Decentralized Messaging */}
            <div className="bg-gradient-to-r from-emerald-900 to-green-900 bg-opacity-30 border border-emerald-600 rounded-md p-4">
              <h4 className="text-sm font-semibold text-emerald-300 mb-3 flex items-center">
                <span className="mr-2">💬</span>
                Puterea Mesageriei Descentralizate
              </h4>
              <ul className="text-xs text-emerald-200 space-y-2">
                <li>• <span className="font-semibold">Jurnaliștii:</span> Protejează sursele prin comunicare anonimă</li>
                <li>• <span className="font-semibold">Activiștii:</span> Organizează rezistența fără supraveghere</li>
                <li>• <span className="font-semibold">Cetățenii:</span> Comunică liber în regimuri opresive</li>
                <li>• <span className="font-semibold">Dezvoltatorii:</span> Salvează documentația în mod permanent</li>
              </ul>
            </div>
          </div>          {/* Right Column - Existing Technical Content */}
          <div className="lg:w-1/2">
            <div className="mb-3">
              <p className="text-gray-300 text-sm font-medium mb-2">
                <span className="text-yellow-300 mr-1">🧩</span> 
                <span className="font-semibold">Ghicitoare:</span> "Sunt opusul controlului din centru, ce sunt?"
              </p>
              <p className="text-gray-400 text-xs italic mb-4">
                Introdu răspunsul pentru a apela funcția de verificare din contractul lui Satoshi.
              </p>
            </div>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introducă mesajul tău secret..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 resize-none"
              rows={3}
              maxLength={100}
              disabled={isLoading}
            />
            
            <div className="flex justify-between text-xs text-gray-400 mt-1 mb-4">
              <span>{message.length}/100 caractere</span>
              <span>{messageSizeBytes} bytes</span>
            </div>

            {/* Detalii tranzacție - educativ */}
            <div className="bg-gray-700 rounded-md p-3 mb-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center text-sm text-blue-300 hover:text-blue-200 mb-2"
              >
                <Info size={16} className="mr-1" />
                {showDetails ? 'Ascunde' : 'Arată'} detaliile tranzacției
              </button>
              
              {showDetails && (
                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mesaj în format hex:</span>
                    <span className="text-green-300 font-mono text-xs break-all">
                      {messageHex.slice(0, 20)}...
                    </span>
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
                    💡 Mai multe date = mai mult gas necesar
                  </div>
                </div>
              )}
            </div>

            {/* Explicație educativă */}
            <div className="bg-blue-900 bg-opacity-30 border border-blue-600 rounded-md p-3 mb-4">
              <h4 className="text-sm font-semibold text-blue-300 mb-2">🎓 Ce se întâmplă:</h4>
              <ul className="text-xs text-blue-200 space-y-1">
                <li>• Mesajul tău va fi stocat permanent pe blockchain</li>
                <li>• Vei plăti gas pentru stocarea datelor</li>
                <li>• Tranzacția va fi vizibilă public pe Etherscan</li>
                <li>• Nu poate fi șters sau modificat ulterior</li>
              </ul>
            </div>
          </div>
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
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Trimit...
              </>
            ) : (
              <>
                <Send size={16} className="mr-1" />
                Trimite
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendSecretMessageModal;