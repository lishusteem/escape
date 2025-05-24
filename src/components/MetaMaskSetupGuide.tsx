import React, { useState } from 'react';
import { ExternalLink, Wallet, Droplets, Info, X, ChevronRight } from 'lucide-react';

interface MetaMaskSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const MetaMaskSetupGuide: React.FC<MetaMaskSetupGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      title: "Instalează MetaMask",
      icon: <Wallet className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            MetaMask este un portofel crypto care îți permite să interacționezi cu aplicații blockchain.
          </p>
          <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">Pasul 1: Descarcă MetaMask</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Mergi pe <span className="text-cyan-400">metamask.io</span></li>
              <li>Apasă "Download" și alege extensia pentru browser-ul tău</li>
              <li>Instalează extensia MetaMask</li>
              <li>Creează un cont nou sau importă unul existent</li>
              <li>⚠️ <span className="text-yellow-400">Salvează seed phrase-ul în siguranță!</span></li>
            </ol>
          </div>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Descarcă MetaMask
          </a>
        </div>
      )
    },
    {
      id: 2,
      title: "Conectează la Sepolia Testnet",
      icon: <Info className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Sepolia este un testnet Ethereum unde poți experimenta fără ETH real.
          </p>
          <div className="bg-purple-600/20 border border-purple-500 rounded-lg p-4">
            <h4 className="text-purple-400 font-semibold mb-2">Pasul 2: Adaugă Sepolia Network</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Deschide extensia MetaMask</li>
              <li>Apasă pe dropdown-ul de rețele (sus)</li>
              <li>Selectează "Show test networks" în setări</li>
              <li>Alege "Sepolia test network"</li>
            </ol>
            <div className="mt-3 p-3 bg-gray-700/50 rounded border-l-4 border-purple-400">
              <p className="text-xs text-gray-400">
                <strong>Alternativ:</strong> Aplicația va încerca să comute automat la Sepolia când te conectezi.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Obține Test ETH din Faucet",
      icon: <Droplets className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Ai nevoie de test ETH pentru a plăti taxele de gas în escape room.
          </p>
          <div className="bg-green-600/20 border border-green-500 rounded-lg p-4">
            <h4 className="text-green-400 font-semibold mb-2">Pasul 3: Cere Test ETH</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Copiază adresa ta din MetaMask (apasă pe nume pentru a copia)</li>
              <li>Mergi pe unul din faucet-urile de mai jos</li>
              <li>Lipește adresa ta și cere ETH</li>
              <li>Așteaptă 1-2 minute să primești test ETH</li>
              <li>Verifică balanța în MetaMask</li>
            </ol>
          </div>
          
          <div className="space-y-3">
            <h5 className="text-cyan-400 font-semibold">Faucet-uri Recomandate:</h5>
            <div className="grid gap-3">
              <a
                href="https://sepoliafaucet.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
              >
                <div>
                  <div className="font-medium text-white">Sepolia Faucet</div>
                  <div className="text-sm text-gray-400">sepoliafaucet.com</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              
              <a
                href="https://faucets.chain.link/sepolia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
              >
                <div>
                  <div className="font-medium text-white">Chainlink Faucet</div>
                  <div className="text-sm text-gray-400">faucets.chain.link/sepolia</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              
              <a
                href="https://sepolia-faucet.pk910.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
              >
                <div>
                  <div className="font-medium text-white">PoW Faucet</div>
                  <div className="text-sm text-gray-400">sepolia-faucet.pk910.de</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>

          <div className="bg-yellow-600/20 border border-yellow-500 rounded-lg p-4">
            <h4 className="text-yellow-400 font-semibold mb-2">💡 Sfaturi:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
              <li>Ai nevoie de doar ~0.1 ETH pentru toate challenge-urile</li>
              <li>Faucet-urile au limite de timp (24h între cereri)</li>
              <li>Unele faucet-uri necesită cont social media</li>
              <li>Dacă unul nu funcționează, încearcă altul</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <Wallet className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Setup MetaMask & Test ETH</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progres setup</span>
            <span className="text-sm text-cyan-400">{currentStep}/3</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {currentStepData && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white">
                  {currentStepData.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{currentStepData.title}</h3>
              </div>
              <div className="text-gray-300">
                {currentStepData.content}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-600">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            Înapoi
          </button>
          
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  step.id === currentStep 
                    ? 'bg-cyan-400' 
                    : step.id < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition-colors"
            >
              Următorul
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
            >
              Să începem! 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetaMaskSetupGuide;
