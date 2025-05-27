import React, { useState } from 'react';
import { Shield, Key, Zap, Copy, ExternalLink, Minimize2, X } from 'lucide-react';

const DONATION_ADDRESS = '0x742d35cc6634c0532925a3b844bc454e4438f44e';
const SATOSHI_MESSAGE = 'Cancelarul este pe punctul de a aproba al doilea bailout';

interface CypherpunkWelcomeMessageProps {
  onClose: () => void;
}

const CypherpunkWelcomeMessage: React.FC<CypherpunkWelcomeMessageProps> = ({ onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-yellow-300 hover:bg-yellow-400 border-8 border-purple-700 text-purple-900 p-7 rounded-full shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 transition-all duration-200 flex flex-col items-center animate-bounce"
          style={{ minWidth: 110, minHeight: 110 }}
          title="Deschide indiciile camerei Cypherpunk"
        >
          <span className="relative flex flex-col items-center">
            <Shield className="h-16 w-16 text-purple-800 drop-shadow-lg" />
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-5xl font-extrabold text-purple-700 drop-shadow-2xl">?</span>
          </span>
        </button>
        <div className="mt-4 text-2xl font-extrabold text-purple-900 text-center drop-shadow-sm select-none pointer-events-none tracking-wide uppercase">
          INDICII
        </div>
        <div className="mt-1 text-xs text-purple-700 font-semibold text-center select-none pointer-events-none">
          Mesajul Cypherpunk + Indicații
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="max-w-2xl w-full bg-gray-800 bg-opacity-95 rounded-2xl shadow-2xl border-2 border-purple-500 overflow-hidden relative max-h-[90vh] overflow-y-auto">
        {/* Butoane control */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => setIsMinimized(true)}
            className="bg-gray-900/80 hover:bg-gray-700 text-white p-2 rounded-full border border-gray-600 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            title="Minimizează mesajul Cypherpunk"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
          >
            <Minimize2 className="h-5 w-5" />
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full border border-red-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            title="Închide mesajul Cypherpunk"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
          <Shield className="h-14 w-14 text-white mx-auto mb-3 animate-pulse" />
          <h1 className="text-2xl font-bold text-white mb-1">
            Bun venit în Revoluția Cypherpunk!
          </h1>
          <p className="text-purple-100 text-base">
            Camera secretă a libertății financiare
          </p>
        </div>
        {/* Conținut principal */}
        <div className="p-6 text-white space-y-6">
          <section className="bg-gray-700 bg-opacity-50 rounded-xl p-4 border border-purple-400">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <h2 className="text-lg font-bold text-purple-300">Revoluția Cypherpunk</h2>
            </div>
            <p className="text-sm text-gray-200">
              Cypherpunk-ii luptă pentru libertatea digitală prin criptografie și descentralizare. Această cameră îți va testa cunoștințele despre blockchain și principiile descentralizării.
            </p>
          </section>
          <section className="bg-gradient-to-r from-orange-800 to-red-800 rounded-xl p-4 border-2 border-orange-400">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-5 w-5 text-orange-300" />
              <h2 className="text-lg font-bold text-orange-200">Mesaj cheie</h2>
            </div>
            <blockquote className="text-base font-semibold text-orange-100 italic border-l-4 border-orange-400 pl-3">
              "Cancelarul este pe punctul de a aproba al doilea <span className='text-yellow-300 font-bold'>bailout</span>"
            </blockquote>
            <p className="text-orange-200 mt-2 text-xs">
              Aceste cuvinte au inspirat crearea Bitcoin-ului ca protest împotriva sistemului financiar centralizat.
            </p>
          </section>
          <section className="bg-blue-800 bg-opacity-50 rounded-xl p-4 border border-blue-400">
            <h2 className="text-lg font-bold text-blue-300 mb-2">📝 Indicii pentru Camera Secretă</h2>
            <ul className="list-disc list-inside text-blue-100 text-xs space-y-1">
              <li>Conectează MetaMask la Sepolia</li>
              <li>Asigură-te că ai ETH pentru gas</li>
              <li>Fiecare provocare dă o cifră</li>
              <li>Citește cu atenție instrucțiunile</li>
              <li>Unele necesită tranzacții reale</li>
              <li>Obiectiv: fii vrednic să găsești portofelul lui Satoshi</li>
            </ul>
          </section>
          <section className="bg-gradient-to-r from-yellow-800 to-orange-800 rounded-xl p-4 border-2 border-yellow-400">
            <div className="text-center">
              <Key className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
              <h2 className="text-lg font-bold text-yellow-200 mb-1">🎯 Misiunea Ta</h2>
              <p className="text-base text-yellow-100 font-semibold">
                Fii vrednic să găsești portofelul lui Satoshi
              </p>
              <p className="text-yellow-200 mt-1 text-xs">
                Doar cei care înțeleg cu adevărat principiile cypherpunk vor putea accesa secretele finale.
              </p>
            </div>
          </section>
          <section className="bg-green-800 bg-opacity-50 rounded-xl p-4 border border-green-400">
            <h2 className="text-base font-bold text-green-300 mb-2">💰 Susține Revoluția</h2>
            <p className="text-green-200 mb-2 text-xs">
              Donează pentru mișcarea cypherpunk:
            </p>
            <div className="bg-gray-900 rounded-lg p-2 border border-green-500 flex items-center justify-between gap-2">
              <code className="text-green-300 font-mono text-xs break-all">
                {DONATION_ADDRESS}
              </code>
              <div className="flex gap-1">
                <button
                  onClick={() => copyToClipboard(DONATION_ADDRESS)}
                  className={`p-1 rounded-lg transition-all duration-200 ${copied ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                  title="Copiază adresa"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => window.open(`https://sepolia.etherscan.io/address/${DONATION_ADDRESS}`, '_blank')}
                  className="p-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300"
                  title="Vezi pe Etherscan"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
            {copied && (
              <p className="text-green-400 text-xs mt-1">✅ Adresa copiată!</p>
            )}
          </section>
          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 shadow-lg text-sm"
            >
              🚀 Începe Aventura Cypherpunk
            </button>
            <p className="text-gray-400 mt-1 text-xs">
              6 provocări blockchain te așteaptă
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CypherpunkWelcomeMessage;
