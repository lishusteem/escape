import React from 'react';
import { X, ArrowLeftRight } from 'lucide-react';
import SimpleSwapComponent from './SimpleSwapComponent';

interface SimpleSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwapSuccess: (txHash: string) => void;
  onError: (error: string) => void;
  onTxSent?: (txHash: string) => void; // Adaugă onTxSent ca prop opțional
}

const SimpleSwapModal: React.FC<SimpleSwapModalProps> = ({
  isOpen,
  onClose,
  onSwapSuccess,
  onError,
  onTxSent, // Preia onTxSent din props
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-md">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-purple-500 shadow-2xl shadow-purple-500/50">
        <div className="sticky top-0 bg-gradient-to-r from-purple-800 to-blue-800 p-6 rounded-t-xl border-b border-purple-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <ArrowLeftRight className="h-8 w-8 text-purple-300" />
              <h2 className="text-2xl font-bold text-white">Swap ETH pentru Token (Simplu)</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <SimpleSwapComponent
            onSwapSuccess={onSwapSuccess}
            onError={onError}
            onTxSent={onTxSent} // Pasează onTxSent către SimpleSwapComponent
          />
        </div>
      </div>
    </div>
  );
};

export default SimpleSwapModal;
