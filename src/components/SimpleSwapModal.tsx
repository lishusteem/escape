import React from 'react';
import { X, ArrowLeftRight } from 'lucide-react';
import SimpleSwapComponent from './SimpleSwapComponent';

interface SimpleSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwapSuccess: (txHash: string) => void;
  onError: (error: string) => void;
  onTxSent?: (txHash: string) => void;
}

const SimpleSwapModal: React.FC<SimpleSwapModalProps> = ({
  isOpen,
  onClose,
  onSwapSuccess,
  onError,
  onTxSent,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">          <h3 className="text-xl font-bold flex items-center">
            <ArrowLeftRight size={24} className="mr-2 text-blue-400" />
            🎓 Lecția 6: Finanțe Autonome
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Layout cu două coloane */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Coloana stângă - Context educațional */}
          <div className="lg:w-1/2 space-y-4">
            {/* Filosofia Schimbului Descentralizat */}            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-lg p-4">
              <h4 className="text-indigo-300 font-semibold mb-3 flex items-center">
                🎓 Cypherpunk Academy - Finanțe Autonome
              </h4>
              <p className="text-indigo-100 text-sm mb-3">
                Această lecție finală îți arată cum schimburile descentralizate elimină intermediarii, 
                permițând schimburi directe între utilizatori fără autoritate centrală.
              </p>
              <div className="text-xs text-indigo-200 space-y-1">
                <div>• <strong>Eliminarea Intermediarilor:</strong> Tranzacții directe P2P</div>
                <div>• <strong>Transparența Totală:</strong> Prețuri și fee-uri publice</div>
                <div>• <strong>Custody Personal:</strong> Tu deții cheile, tu deții cripto-ul</div>
                <div>• <strong>Accesibilitatea Globală:</strong> Schimb 24/7, oriunde</div>
              </div>
            </div>

            {/* Evoluția Sistemelor de Schimb */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="text-cyan-300 font-semibold mb-3">
                🔄 Evoluția Sistemelor de Schimb
              </h4>
              <div className="text-xs text-cyan-100 space-y-2">
                <div><strong>Antichitate:</strong> Troc - schimb direct de bunuri</div>
                <div><strong>1600s:</strong> Borse centralizate - Amsterdam Stock Exchange</div>
                <div><strong>2009:</strong> Bitcoin - primul asset digital descentralizat</div>
                <div><strong>2018:</strong> Uniswap - primul DEX automated market maker</div>
                <div><strong>2020+:</strong> DeFi explosion - schimburile fără permisiune</div>
              </div>
            </div>

            {/* Democratizarea Finanțelor */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-emerald-500/30 rounded-lg p-4">
              <h4 className="text-emerald-300 font-semibold mb-3">
                🌍 Democratizarea Finanțelor
              </h4>
              <p className="text-emerald-100 text-sm mb-2">
                DeFi democratizează accesul la servicii financiare complexe, 
                oferind oricui instrumente de tranzacționare avansate.
              </p>
              <div className="text-xs text-emerald-200 space-y-1">
                <div>• <strong>Micii Investitori:</strong> Instrumente financiare complexe</div>
                <div>• <strong>Țările în Dezvoltare:</strong> Servicii fără infrastructură bancară</div>
                <div>• <strong>Dezvoltatorii:</strong> Instrumente financiare inovatoare</div>
                <div>• <strong>Utilizatorii Obișnuiți:</strong> Tranzacții fără aprobare bancară</div>
              </div>
            </div>
          </div>

          {/* Coloana dreaptă - Funcționalitate tehnică */}
          <div className="lg:w-1/2">
            <SimpleSwapComponent
              onSwapSuccess={onSwapSuccess}
              onError={onError}
              onTxSent={onTxSent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleSwapModal;
