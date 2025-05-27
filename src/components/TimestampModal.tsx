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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">          <h3 className="text-xl font-bold flex items-center">
            <Clock size={24} className="mr-2 text-green-400" />
            🎓 Lecția 2: Adevăr Immutabil
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Layout cu două coloane */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Coloana stângă - Context educațional */}
          <div className="lg:w-1/2 space-y-4">
            {/* Filozofia Timpului Descentralizat */}            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-300 font-semibold mb-3 flex items-center">
                🎓 Cypherpunk Academy - Adevărul Immutabil
              </h4>
              <p className="text-green-100 text-sm mb-3">
                "În lumea digitală, controlul timpului înseamnă controlul adevărului." Această lecție 
                îți arată cum blockchain-ul elimină autoritățile care pot manipula înregistrările temporale.
              </p>
              <div className="text-xs text-green-200 space-y-1">
                <div>• <strong>Timp imutabil:</strong> Nimeni nu poate modifica istoria</div>
                <div>• <strong>Consens temporal:</strong> Rețeaua decide timpul, nu guvernele</div>
                <div>• <strong>Dovezi eterne:</strong> Timestamp-urile supraviețuiesc civilizațiilor</div>
              </div>
            </div>

            {/* Revoluția Temporală */}
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-lg p-4">
              <h4 className="text-amber-300 font-semibold mb-3">
                🔥 Revoluția Temporală
              </h4>
              <div className="text-xs text-amber-100 space-y-2">
                <div><strong>Înainte de blockchain:</strong> Băncile și guvernele controlau timpul</div>
                <div><strong>1991:</strong> Stuart Haber și Scott Stornetta inventează timestamp-ul criptografic</div>
                <div><strong>2008:</strong> Satoshi Nakamoto folosește timpul ca fundament pentru Bitcoin</div>
                <div><strong>Prezent:</strong> Fiecare bloc este o capsulă temporală imutabilă</div>
                <div><strong>Viitor:</strong> Istoria umană va fi înregistrată pe blockchain</div>
              </div>
            </div>

            {/* Puterea Socială */}
            <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-300 font-semibold mb-3">
                🌊 Puterea Socială
              </h4>
              <p className="text-blue-100 text-sm mb-2">
                Timestamp-urile blockchain democratizează conceptul de "când s-a întâmplat ceva", 
                eliminând necesitatea de a avea încredere în autorități.
              </p>
              <div className="text-xs text-blue-200 space-y-1">
                <div>• <strong>Jurnalism:</strong> Dovedește când s-au întâmplat evenimentele</div>
                <div>• <strong>Justiție:</strong> Elimină manipularea dovezilor temporale</div>
                <div>• <strong>Știință:</strong> Înregistrări de cercetare imutabile</div>
                <div>• <strong>Artă:</strong> Momente creative capturate pentru eternitate</div>
              </div>
            </div>
          </div>          {/* Coloana dreaptă - Conținutul tehnic existent */}
          <div className="lg:w-1/2">
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
      </div>
    </div>
  );
};

export default TimestampModal;