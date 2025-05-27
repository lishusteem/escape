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

  const message = "Susțin Manifestul Cypherpunk: Privacy ca drept fundamental!";
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">          <h3 className="text-xl font-bold flex items-center">
            <PenTool size={24} className="mr-2 text-blue-400" />
            🎓 Lecția 1: Identitate Digitală
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Layout cu două coloane */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Coloana stângă - Context educațional */}
          <div className="lg:w-1/2 space-y-4">
            {/* Filosofia Cypherpunk */}            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="text-cyan-300 font-semibold mb-3 flex items-center">
                🎓 Cypherpunk Academy - Fundamentele
              </h4>
              <p className="text-cyan-100 text-sm mb-3">
                "Cypherpunks write code" - Eric Hughes, 1993. În această lecție descoperi cum 
                semnăturile digitale îți oferă identitate autonomă, fără autorități centrale.
              </p>
              <div className="text-xs text-cyan-200 space-y-1">
                <div>• <strong>Auto-suveranitate:</strong> Tu îți controlezi identitatea</div>
                <div>• <strong>Pseudonimie:</strong> Identitate fără dezvăluire personală</div>
                <div>• <strong>Rezistență la cenzură:</strong> Nu poate fi blocată de nimeni</div>
              </div>
            </div>

            {/* Evoluția Istorică */}
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-300 font-semibold mb-3">
                📜 Evoluția Istorică
              </h4>
              <div className="text-xs text-purple-100 space-y-2">
                <div><strong>1976:</strong> Diffie-Hellman inventează criptografia cu cheie publică</div>
                <div><strong>1991:</strong> Phil Zimmermann creează PGP pentru email criptat</div>
                <div><strong>1993:</strong> Manifestul Cypherpunk declară: "Privacy is necessary"</div>
                <div><strong>2009:</strong> Bitcoin implementează semnături pentru tranzacții</div>
                <div><strong>2015:</strong> Ethereum extinde conceptul la contracte inteligente</div>
              </div>
            </div>

            {/* Impactul Social */}            <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-500/30 rounded-lg p-4">
              <h4 className="text-emerald-300 font-semibold mb-3">
                🌍 Aplicații în Lumea Reală
              </h4>
              <p className="text-emerald-100 text-sm mb-2">
                Semnăturile digitale democratizează autentificarea, oferind oricui puterea 
                să-și dovedească identitatea fără documente de stat sau corporații.
              </p>
              <div className="text-xs text-emerald-200 space-y-1">
                <div>• <strong>Activiști:</strong> Protejează identitatea în regimuri opresive</div>
                <div>• <strong>Jurnaliști:</strong> Verifică autenticitatea surselor</div>
                <div>• <strong>Dezvoltatori:</strong> Semnează cod pentru securitate</div>
                <div>• <strong>Artiști:</strong> Autentifică opere digitale (NFT-uri)</div>
              </div>
            </div>
          </div>

          {/* Coloana dreaptă - Conținutul tehnic existent */}
          <div className="lg:w-1/2">
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
      </div>
    </div>
  );
};

export default SignMessageModal;