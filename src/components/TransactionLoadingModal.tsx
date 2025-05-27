
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
  }  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-2xl text-white border border-purple-600/50 backdrop-blur-sm max-w-md w-full text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
          <h3 className="text-lg font-semibold">Tranzacție în procesare...</h3>
        </div>
        <p className="text-gray-300 text-sm mb-4 min-h-[40px]">
          {messages[currentMessageIndex]}
        </p>
        {transactionHash && (
          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs text-gray-400 mb-2">Hash Tranzacție:</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 text-xs break-all block"
              title="Vezi pe Etherscan"
            >
              {transactionHash.slice(0, 20)}...{transactionHash.slice(-20)}
            </a>
            <p className="text-xs text-gray-500 mt-1">(Click pentru a vedea pe Etherscan)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionLoadingModal;
