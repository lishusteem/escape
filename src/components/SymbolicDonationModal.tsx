import React from 'react';
import { X, Mail, Info, ArrowRight } from 'lucide-react';

interface SymbolicDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  isLoading: boolean;
}

const SymbolicDonationModal: React.FC<SymbolicDonationModalProps> = ({
  isOpen,
  onClose,
  onSubscribe,
  isLoading
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">          <h3 className="text-xl font-bold flex items-center">
            <Mail size={24} className="mr-2 text-blue-400" />
            🎓 Lecția 5: Solidaritate P2P
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Layout cu două coloane */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Coloana stângă - Context educațional */}
          <div className="lg:w-1/2 space-y-4">
            {/* Filosofia Susținerii Anonime */}            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-lg p-4">
              <h4 className="text-indigo-300 font-semibold mb-3 flex items-center">
                🎓 Cypherpunk Academy - Solidaritate P2P
              </h4>
              <p className="text-indigo-100 text-sm mb-3">
                Această lecție îți arată cum susținerea anonimă este fundamentul libertății în era digitală, 
                eliminând frica de represalii pentru susținerea cauzelor importante.
              </p>
              <div className="text-xs text-indigo-200 space-y-1">
                <div>• <strong>Finanțarea Fără Cenzură:</strong> Susții cauze fără teamă</div>
                <div>• <strong>Pseudonimitatea Donatorului:</strong> Identitatea protejată</div>
                <div>• <strong>Transparența Publică:</strong> Sumele vizibile, donatorii anonimi</div>
                <div>• <strong>Accesul la Informație:</strong> Plătești cunoașterea, nu controlul</div>
              </div>
            </div>

            {/* Evoluția Rețelelor Secrete */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="text-cyan-300 font-semibold mb-3">
                🕸️ Evoluția Rețelelor Secrete
              </h4>
              <div className="text-xs text-cyan-100 space-y-2">
                <div><strong>1960s:</strong> ARPANET - primul network descentralizat</div>
                <div><strong>1990s:</strong> Mailing lists criptate - PGP pentru mase</div>
                <div><strong>2000s:</strong> Tor network - anonimitatea completă</div>
                <div><strong>2009:</strong> Bitcoin - plăți anonime pentru servicii</div>
                <div><strong>2020+:</strong> Crypto subscriptions - conținut premium descentralizat</div>
              </div>
            </div>

            {/* Economia Informației Libere */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-500/30 rounded-lg p-4">
              <h4 className="text-emerald-300 font-semibold mb-3">
                🌐 Economia Informației Libere
              </h4>
              <p className="text-emerald-100 text-sm mb-2">
                Economia informației democratizează accesul la cunoaștere, permițând 
                finanțarea directă a conținutului valoros fără intermediari.
              </p>
              <div className="text-xs text-emerald-200 space-y-1">
                <div>• <strong>Cercetătorii:</strong> Studii independente fără presiuni</div>
                <div>• <strong>Jurnaliștii:</strong> Investigații fără cenzura editorilor</div>
                <div>• <strong>Educatorii:</strong> Conținut educativ fără restricții</div>
                <div>• <strong>Dezvoltatorii:</strong> Open-source prin abonamente voluntare</div>
              </div>
            </div>
          </div>

          {/* Coloana dreaptă - Funcționalitate tehnică */}
          <div className="lg:w-1/2 space-y-4">
            {/* Secțiune educațională */}
            <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-5">
              <div className="flex items-center space-x-2 mb-3">
                <Info className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-blue-300">Ce este un Mailing List Secret?</h3>
              </div>
              <div className="text-gray-300 space-y-3 text-sm">
                <p>
                  <strong className="text-blue-400">Un mailing list secret</strong> este un sistem de comunicare criptat unde doar membrii care au plătit o "taxă de intrare" prin blockchain pot accesa conținutul.
                </p>
                <p>
                  Prin trimiterea acestei tranzacții, te abonezi la un serviciu care îți va furniza lunar o <strong className="text-purple-300">cheie de decriptare</strong> pe adresa ta de wallet.
                </p>
                <p>
                  Această cheie îți permite să accesezi conținut exclusiv, documente criptate și informații confidențiale disponibile doar pentru membri.
                </p>
              </div>
            </div>

            {/* Detalii tehnice */}
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Detalii Tehnice</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Suma abonament:</span>
                  <span className="text-green-400 font-mono">0.0001 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>Adresa destinație:</span>
                  <span className="text-blue-400 font-mono">0x000...dEaD</span>
                </div>
                <div className="flex justify-between">
                  <span>Frecvența chei:</span>
                  <span className="text-purple-400">Lunar</span>
                </div>
                <div className="flex justify-between">
                  <span>Tip criptare:</span>
                  <span className="text-yellow-400">AES-256</span>
                </div>
              </div>
            </div>

            {/* Butoane de acțiune */}
            <div className="flex space-x-4 pt-2">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Anulează
              </button>
              <button
                onClick={onSubscribe}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Abonează-te la Lista Secretă</span>
                    <ArrowRight size={20} />
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

export default SymbolicDonationModal;