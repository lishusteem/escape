import React from 'react';
import { X, Mail, Key, Shield, Info, ArrowRight, Calendar } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-md">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500 shadow-2xl shadow-purple-500/50">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-800 to-blue-800 p-6 rounded-t-xl border-b border-purple-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Mail className="h-8 w-8 text-purple-300" />
              <h2 className="text-2xl font-bold text-white">Abonament Mailing List Secret</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Educational Section */}
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

          {/* Subscription Benefits */}
          <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-5">
            <div className="flex items-center space-x-2 mb-3">
              <Key className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-300">Beneficiile Abonamentului</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Cheie de decriptare lunară</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">Acces la conținut exclusiv</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">Newsletter criptat săptămânal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300">Documente tehnice avansate</span>
              </div>
            </div>
          </div>

          {/* Technical Details */}
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

          {/* Warning */}
          <div className="bg-orange-900/30 border border-orange-600 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-orange-400 mt-0.5" />
              <div className="text-orange-300 text-sm">
                <p className="font-semibold mb-1">Important:</p>
                <p>
                  Aceasta este o demonstrație educațională. În realitate, cheia de decriptare ar fi trimisă automat pe adresa ta de wallet în fiecare lună după plată.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
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

          {/* Process Flow */}
          <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
            <h3 className="text-green-300 font-semibold mb-2 text-sm">Procesul de Abonare:</h3>
            <div className="flex items-center space-x-2 text-xs text-green-200">
              <span className="bg-green-600 text-white px-2 py-1 rounded">1</span>
              <ArrowRight size={14} />
              <span className="bg-green-600 text-white px-2 py-1 rounded">2</span>
              <ArrowRight size={14} />
              <span className="bg-green-600 text-white px-2 py-1 rounded">3</span>
            </div>
            <div className="mt-2 text-xs text-gray-300 space-y-1">
              <p><strong>1.</strong> Trimite 0.0001 ETH pentru abonament</p>
              <p><strong>2.</strong> Tranzacția este confirmată pe blockchain</p>
              <p><strong>3.</strong> Primești cheia de decriptare lunar pe adresa ta</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolicDonationModal;