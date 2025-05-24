
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface TransactionLoadingModalProps {
  isOpen: boolean;
  transactionHash: string | null;
  // onClose?: () => void; // Optional: if you want a close button
}

const messages = [
  "Se inițiază tranzacția...",
  "Se trimite tranzacția către rețeaua Ethereum...",
  "Se așteaptă confirmarea validatorilor...",
  "Blocul este inclus in blockchain, se validează tranzacția...",
  "Se verifică numărul de confirmări...",
  "Tranzacția este aproape finalizată...",
  "Confirmările se adună, răbdare...",
  "Validare finală în curs...",
];

const TransactionLoadingModal: React.FC<TransactionLoadingModalProps> = ({ isOpen, transactionHash }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const intervalId = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }, 2500); // Change message every 2.5 seconds

      return () => clearInterval(intervalId);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-md text-center">
        <Loader2 className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-spin" />
        <h3 className="text-xl font-semibold mb-3">Tranzacție în Procesare</h3>
        <p className="text-gray-300 mb-2 text-sm min-h-[40px]">
          {messages[currentMessageIndex]}
        </p>
        {transactionHash && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-1">Hash Tranzacție:</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 text-xs break-all"
            >
              {transactionHash}
            </a>
            <p className="text-xs text-gray-500 mt-1">(Vezi pe Etherscan)</p>
          </div>
        )}
        {/* {onClose && (
          <button 
            onClick={onClose} 
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Închide (for dev)
          </button>
        )} */}
      </div>
    </div>
  );
};

export default TransactionLoadingModal;
