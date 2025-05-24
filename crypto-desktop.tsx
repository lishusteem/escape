import React, { useState, useRef } from 'react';
import { Monitor, Folder, Settings, FileText, Lock, Coins, Key, Terminal, Clock, Vote, Code, Send, Wallet } from 'lucide-react';

const CryptoDesktop = () => {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [currentView, setCurrentView] = useState('room'); // 'room', 'guide', 'drawer1', 'drawer2', etc., 'safe', 'wallet-input', 'wallet-unlocked', 'mission-complete'
  const [completedDrawers, setCompletedDrawers] = useState({});
  const [seedPhraseWords, setSeedPhraseWords] = useState(Array(12).fill(''));
  const [walletUnlocked, setWalletUnlocked] = useState(false);
  const [fundAddress, setFundAddress] = useState('');
  const [missionComplete, setMissionComplete] = useState(false);

  // Correct seed phrase order: talent witness glance midnight escape ocean response silent together volcano robot dream
  const correctSeedPhrase = [
    'talent', 'witness', 'glance', 'midnight', 'escape', 'ocean',
    'response', 'silent', 'together', 'volcano', 'robot', 'dream'
  ];

  // Drawer word mappings based on the document
  const drawerWords = {
    drawer1: { words: ['5: silent', '8: response'], numbers: [5, 8], challenge: 'signature' },
    drawer2: { words: ['3: volcano', '11: escape'], numbers: [3, 11], challenge: 'timestamp' },
    drawer3: { words: ['1: midnight', '6: dream'], numbers: [1, 6], challenge: 'vote' },
    drawer4: { words: ['7: talent', '10: together'], numbers: [7, 10], challenge: 'contract' },
    drawer5: { words: ['4: witness', '9: glance'], numbers: [4, 9], challenge: 'transfer' },
    drawer6: { words: ['2: ocean', '12: robot'], numbers: [2, 12], challenge: 'tokens' }
  };

  const completeDrawer = (drawerId) => {
    setCompletedDrawers(prev => ({
      ...prev,
      [drawerId]: true
    }));
    setCurrentView('room');
  };

  const openWallet = () => {
    setIsWalletOpen(true);
    setCurrentView('wallet-input');
  };

  const closeWallet = () => {
    setIsWalletOpen(false);
    setCurrentView('room');
  };

  const renderWalletContent = () => {
    if (missionComplete) {
      return (
        <div className="p-8 text-center space-y-6 bg-gradient-to-br from-green-50 to-blue-50 min-h-full">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-green-600">🎉 MISIUNE COMPLETĂ! 🎉</h2>
            <p className="text-xl">Ai descoperit secretul și ai îndeplinit adevărata voință a lui Satoshi Nakamoto!</p>
            
            <div className="bg-blue-50 p-6 rounded-lg text-left max-w-2xl mx-auto">
              <h3 className="font-semibold mb-3 text-lg">În această aventură, ai învățat despre:</h3>
              <ul className="text-sm space-y-2">
                <li>• Semnături digitale pentru identitate</li>
                <li>• Timestamping pentru dovada existenței</li>
                <li>• Votul blockchain pentru guvernanță descentralizată</li>
                <li>• Contracte inteligente pentru automatizare</li>
                <li>• Transferuri de valoare fără intermediari</li>
                <li>• Tokenuri pentru active digitale</li>
                <li>• NFT-uri pentru proprietate unică</li>
                <li>• Seed phrase-uri pentru securitatea portofelelor</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 text-lg font-semibold">
                📜 DESCARCĂ CERTIFICAT DE FINALIZARE
              </button>
              <button 
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 text-lg block mx-auto"
                onClick={() => {
                  setWalletUnlocked(false);
                  setMissionComplete(false);
                  setSeedPhraseWords(Array(12).fill(''));
                  setFundAddress('');
                  setCompletedDrawers({});
                  setCurrentView('room');
                }}
              >
                🔄 REÎNCEPE AVENTURA
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (walletUnlocked) {
      return (
        <div className="p-8 space-y-6 min-h-full bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-green-600">🎊 FELICITĂRI! 🎊</h2>
            <p className="text-xl">Ai descoperit portofelul pierdut al lui Satoshi Nakamoto!</p>
            
            {/* Bitcoin Wallet Image */}
            <div className="bg-gradient-to-br from-orange-400 to-yellow-500 p-8 rounded-lg text-white max-w-md mx-auto">
              <Wallet className="w-20 h-20 mx-auto mb-4" />
              <div className="text-3xl font-bold">1,000,000 BTC</div>
              <div className="text-lg opacity-90">Portofelul lui Satoshi</div>
            </div>
            
            {/* Satoshi's Message */}
            <div className="bg-gray-100 p-6 rounded-lg text-left max-w-2xl mx-auto">
              <h3 className="font-bold mb-3 text-lg">MESAJ DE LA SATOSHI:</h3>
              <div className="text-sm italic space-y-3">
                <p>"Dragă explorator,</p>
                <p>Felicitări pentru că ai dovedit înțelegerea principiilor blockchain.</p>
                <p>Aceste criptomonede nu au fost niciodată menite să fie deținute de o singură persoană.</p>
                <p>Adevăratul scop al Bitcoin a fost să creeze un sistem financiar liber, deschis tuturor.</p>
                <p>Pentru a finaliza această aventură și a ieși din cameră, te rog să trimiți aceste monede către 'Fondul Revoluției Cypherpunk' pentru a susține viitorul tehnologiilor descentralizate."</p>
              </div>
            </div>
            
            {/* Fund Address Input */}
            <div className="space-y-4 max-w-lg mx-auto">
              <label className="block text-lg font-medium">Adresa Fondului Revoluției Cypherpunk:</label>
              <input
                type="text"
                value={fundAddress}
                onChange={(e) => setFundAddress(e.target.value)}
                placeholder="Introdu adresa portofelului fundului..."
                className="w-full border-2 rounded-lg px-4 py-3 text-sm font-mono"
              />
              <button 
                className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 w-full font-semibold text-lg"
                onClick={() => {
                  if (fundAddress.toLowerCase() === '0x742d35cc6634c0532925a3b844bc454e4438f44e') {
                    setMissionComplete(true);
                  } else {
                    alert('Adresa incorectă! Verifică din nou adresa fondului din Ghidul Cypherpunk.');
                  }
                }}
              >
                💰 TRIMITE CĂTRE FONDUL REVOLUȚIEI CYPHERPUNK
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentView === 'wallet-input') {
      return (
        <div className="p-8 space-y-6 min-h-full bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-orange-600 mb-6">Portofelul lui Satoshi</h3>
            <p className="text-center text-gray-600 mb-6">Introdu seed phrase-ul în ordinea corectă pentru a debloca portofelul:</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-sm text-gray-500 font-semibold">{i + 1}.</label>
                  <input
                    type="text"
                    value={seedPhraseWords[i]}
                    onChange={(e) => {
                      const newWords = [...seedPhraseWords];
                      newWords[i] = e.target.value.toLowerCase().trim();
                      setSeedPhraseWords(newWords);
                    }}
                    className="border-2 rounded-lg px-3 py-3 w-full text-sm"
                    placeholder="cuvânt"
                  />
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <button 
                className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 w-full font-semibold text-lg"
                onClick={() => {
                  const isCorrect = seedPhraseWords.every((word, index) => 
                    word === correctSeedPhrase[index]
                  );
                  
                  if (isCorrect) {
                    setWalletUnlocked(true);
                  } else {
                    alert('Seed phrase incorect! Verifică ordinea cuvintelor din seif.');
                  }
                }}
              >
                🔓 RESTAUREAZĂ PORTOFEL
              </button>
              
              <button 
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 w-full"
                onClick={() => setCurrentView('room')}
              >
                ← Înapoi la cameră
              </button>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg text-sm">
              <p><strong>Indiciu:</strong> Deschide toate sertarele pentru a obține cuvintele, apoi verifică seiful pentru ordinea corectă!</p>
            </div>
          </div>
        </div>
      );
    }

    if (currentView === 'guide') {
      const totalDrawers = 6;
      const completedCount = Object.keys(completedDrawers).length;
      
      return (
        <div className="p-8 space-y-6 min-h-full bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">📖 Ghidul Cypherpunk</h2>
            <div className="space-y-4">
              <p>Bine ai venit în Revoluția Cypherpunk!</p>
              <p>Pentru a descoperi portofelul lui Satoshi, trebuie să deschizi toate cele 6 sertare și să obții NFT-ul pentru seif.</p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Progres actual: {completedCount}/{totalDrawers}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(drawerWords).map(([drawerId, drawerData]) => {
                    const isComplete = completedDrawers[drawerId];
                    const drawerNumber = drawerId.replace('drawer', '');
                    return (
                      <div key={drawerId} className="flex items-center gap-3 text-sm">
                        <div className={`w-4 h-4 rounded-full ${isComplete ? 'bg-green-500' : 'bg-red-400'}`}></div>
                        <span className={isComplete ? 'text-green-700 font-semibold' : 'text-gray-600'}>
                          Sertar {drawerNumber} {isComplete ? '✅' : '❌'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {completedCount === totalDrawers && (
                  <div className="mt-4 p-3 bg-green-100 rounded border-2 border-green-300">
                    <p className="text-green-700 font-bold text-sm">
                      🎉 Toate sertarele sunt completate! Acum poți deschide seiful și portofelul lui Satoshi!
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Pași pentru finalizare:</h4>
                <ol className="text-sm list-decimal list-inside space-y-1">
                  <li>Completează toate cele 6 provocări din sertare</li>
                  <li>Deschide seiful pentru a vedea ordinea cuvintelor</li>
                  <li>Introdu seed phrase-ul în portofelul lui Satoshi</li>
                  <li>Trimite fondurile către Revoluția Cypherpunk</li>
                </ol>
                
                <div className="mt-3 p-3 bg-orange-50 rounded border border-orange-200">
                  <h5 className="font-semibold text-orange-700 text-sm">Adresa Fondului Revoluției Cypherpunk:</h5>
                  <p className="font-mono text-xs text-orange-600 break-all mt-1">
                    0x742d35Cc6634C0532925a3b844Bc454e4438f44e
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    (Folosește această adresă pentru trimiterea finală)
                  </p>
                </div>
              </div>
              
              <button 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full"
                onClick={() => setCurrentView('room')}
              >
                ← Înapoi la cameră
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentView === 'safe') {
      return (
        <div className="p-8 space-y-6 min-h-full bg-gradient-to-br from-yellow-50 to-amber-50">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-2xl font-bold">🔒 Seif NFT</h3>
            
            <div className="bg-gray-800 text-yellow-400 p-6 rounded-lg">
              <Lock className="w-16 h-16 mx-auto mb-4" />
              <p>Scanează Cheia Cypherpunk NFT</p>
            </div>
            
            {/* Safe contents with word order */}
            <div className="bg-yellow-50 p-6 rounded-lg text-left border-2 border-yellow-200">
              <h4 className="font-bold text-center mb-4 text-lg">📋 Schema de Ordonare Satoshi</h4>
              <p className="text-sm text-center text-gray-600 mb-4">Ordinea corectă a cuvintelor seed phrase:</p>
              
              <div className="grid grid-cols-2 gap-3 text-sm bg-white p-4 rounded">
                <div className="space-y-1">
                  <div>Poziția 1 = Cuvântul 7 (talent)</div>
                  <div>Poziția 2 = Cuvântul 4 (witness)</div>
                  <div>Poziția 3 = Cuvântul 9 (glance)</div>
                  <div>Poziția 4 = Cuvântul 1 (midnight)</div>
                  <div>Poziția 5 = Cuvântul 11 (escape)</div>
                  <div>Poziția 6 = Cuvântul 2 (ocean)</div>
                </div>
                <div className="space-y-1">
                  <div>Poziția 7 = Cuvântul 8 (response)</div>
                  <div>Poziția 8 = Cuvântul 5 (silent)</div>
                  <div>Poziția 9 = Cuvântul 10 (together)</div>
                  <div>Poziția 10 = Cuvântul 3 (volcano)</div>
                  <div>Poziția 11 = Cuvântul 12 (robot)</div>
                  <div>Poziția 12 = Cuvântul 6 (dream)</div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded">
                <p><strong>Pentru a reconstitui seed phrase-ul:</strong></p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Găsește cuvântul cu numărul indicat pentru fiecare poziție</li>
                  <li>Aranjează cuvintele în ordinea pozițiilor (1-12)</li>
                  <li>Introdu seed phrase-ul complet în portofelul de pe computer</li>
                </ol>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 w-full">
                Creează Cheie NFT
              </button>
              <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 w-full">
                Verifică NFT
              </button>
              <button 
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 w-full font-semibold"
                onClick={() => setCurrentView('wallet-input')}
              >
                📱 Deschide Portofelul lui Satoshi
              </button>
              <button 
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 w-full"
                onClick={() => setCurrentView('room')}
              >
                ← Înapoi la cameră
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Drawer views
    if (currentView.startsWith('drawer')) {
      const drawerId = currentView;
      const drawerData = drawerWords[drawerId];
      const drawerNumber = drawerId.replace('drawer', '');
      const isCompleted = completedDrawers[drawerId];
      
      if (isCompleted) {
        return (
          <div className="p-8 text-center space-y-6 min-h-full bg-gradient-to-br from-green-50 to-emerald-50">
            <h3 className="text-2xl font-bold text-green-600">✅ Sertar {drawerNumber} - COMPLETAT!</h3>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="font-bold text-green-700 mb-4 text-lg">Cuvinte Seed Phrase Găsite:</h4>
              <div className="space-y-3">
                {drawerData.words.map((word, index) => (
                  <div key={index} className="bg-white p-4 rounded border-2 border-green-300">
                    <span className="font-mono text-xl">{word}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-green-600 mt-4 font-medium">
                Aceste numere vor fi importante pentru ordinea finală. Notează-le!
              </p>
            </div>
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              onClick={() => setCurrentView('room')}
            >
              ← Înapoi la cameră
            </button>
          </div>
        );
      }

      return (
        <div className="p-8 min-h-full bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-lg mx-auto text-center space-y-6">
            <h3 className="text-2xl font-bold">Sertar {drawerNumber}</h3>
            
            {drawerData.challenge === 'signature' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Semnătură Digitală</h4>
                <p className="text-sm text-gray-600">Semnează declarația cypherpunk:</p>
                <div className="bg-gray-100 p-4 rounded text-sm italic">
                  "Susțin revoluția cypherpunk și cred în dreptul la confidențialitate digitală."
                </div>
                <button 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
                  onClick={() => completeDrawer(drawerId)}
                >
                  📝 Semnează Mesaj
                </button>
              </div>
            )}
            
            {drawerData.challenge === 'timestamp' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Timestamping Blockchain</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono">
                  Timestamp Unix: {Math.floor(Date.now() / 1000)}
                </div>
                <button 
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg"
                  onClick={() => completeDrawer(drawerId)}
                >
                  ⏰ Creează Timestamp
                </button>
              </div>
            )}
            
            {drawerData.challenge === 'vote' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Vot Blockchain</h4>
                <p className="text-sm">Ar trebui confidențialitatea să fie un drept uman fundamental?</p>
                <div className="flex gap-4 justify-center">
                  <button 
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 text-lg"
                    onClick={() => completeDrawer(drawerId)}
                  >
                    ✅ DA
                  </button>
                  <button 
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 text-lg"
                    onClick={() => completeDrawer(drawerId)}
                  >
                    ❌ NU
                  </button>
                </div>
              </div>
            )}
            
            {drawerData.challenge === 'contract' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Contract Inteligent</h4>
                <p className="text-sm">Ghicitoare: "Sunt opusul controlului din centru, ce sunt?"</p>
                <input 
                  type="text" 
                  placeholder="Răspunsul tău..."
                  className="border-2 rounded-lg px-4 py-3 w-full max-w-xs"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.toLowerCase().includes('descentraliz')) {
                      completeDrawer(drawerId);
                    }
                  }}
                />
                <button 
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 text-lg"
                  onClick={(e) => {
                    const input = e.target.parentElement.querySelector('input');
                    if (input.value.toLowerCase().includes('descentraliz')) {
                      completeDrawer(drawerId);
                    } else {
                      alert('Răspuns incorect! Gândește-te la opusul centralizării...');
                    }
                  }}
                >
                  💡 Trimite Răspuns
                </button>
              </div>
            )}
            
            {drawerData.challenge === 'transfer' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Transfer ETH</h4>
                <p className="text-sm">Trimite exact 0.01 ETH la:</p>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono break-all">
                  0x742d35Cc6634C0532925a3b844Bc454e4438f44e
                </div>
                <button 
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 text-lg"
                  onClick={() => completeDrawer(drawerId)}
                >
                  💸 Trimite 0.01 ETH
                </button>
              </div>
            )}
            
            {drawerData.challenge === 'tokens' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Tokenuri ERC-20</h4>
                <p className="text-sm">Obține tokenuri Cypherpunk (CYPH)</p>
                <button 
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 text-lg"
                  onClick={() => completeDrawer(drawerId)}
                >
                  🪙 Obține Tokenuri CYPH
                </button>
              </div>
            )}
            
            <button 
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 w-full"
              onClick={() => setCurrentView('room')}
            >
              ← Înapoi la cameră
            </button>
          </div>
        </div>
      );
    }

    // Main room view
    return (
      <div className="p-8 min-h-full bg-gradient-to-br from-gray-100 to-blue-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">🔐 Camera Secretă Cypherpunk 🔐</h2>
          
          {/* Room Layout */}
          <div className="grid grid-cols-4 gap-6">
            
            {/* Guide Book */}
            <div 
              className="col-span-1 bg-blue-600 p-4 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-white text-center"
              onClick={() => setCurrentView('guide')}
            >
              <FileText className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-semibold">Ghidul Cypherpunk</p>
            </div>

            {/* Drawers Grid */}
            <div className="col-span-2 grid grid-cols-3 gap-4">
              {Object.entries(drawerWords).map(([drawerId, drawerData]) => {
                const drawerNumber = drawerId.replace('drawer', '');
                const isCompleted = completedDrawers[drawerId];
                const icons = [Terminal, Clock, Vote, Code, Send, Coins];
                const IconComponent = icons[parseInt(drawerNumber) - 1];
                
                return (
                  <div
                    key={drawerId}
                    className={`p-4 rounded-lg cursor-pointer transition-colors text-white text-center ${
                      isCompleted 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    onClick={() => setCurrentView(drawerId)}
                  >
                    <IconComponent className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs font-semibold">Sertar {drawerNumber}</p>
                    {isCompleted && <p className="text-xs">✅</p>}
                  </div>
                );
              })}
            </div>

            {/* Safe */}
            <div 
              className="col-span-1 bg-yellow-600 p-4 rounded-lg cursor-pointer hover:bg-yellow-700 transition-colors text-white text-center"
              onClick={() => setCurrentView('safe')}
            >
              <Lock className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-semibold">Seif NFT</p>
            </div>

          </div>
          
          {/* Computer/Wallet Access */}
          <div className="mt-8 text-center">
            <div 
              className="inline-block bg-orange-600 p-6 rounded-lg cursor-pointer hover:bg-orange-700 transition-colors text-white"
              onClick={() => setCurrentView('wallet-input')}
            >
              <Monitor className="w-16 h-16 mx-auto mb-2" />
              <p className="text-lg font-semibold">Portofelul lui Satoshi</p>
              <p className="text-sm opacity-90">Computer Principal</p>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-8 text-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">
                Progres: {Object.keys(completedDrawers).length}/6 sertare completate
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.keys(completedDrawers).length / 6) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Desktop - Only wallet icon */}
      {!isWalletOpen && (
        <div className="flex items-center justify-center h-full">
          <div
            className="flex flex-col items-center cursor-pointer group"
            onClick={openWallet}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-4 group-hover:bg-white/20 transition-colors border border-white/20">
              <Wallet className="w-20 h-20 text-white" />
            </div>
            <span className="text-white text-xl text-center font-medium">
              Portofelul lui Satoshi
            </span>
            <span className="text-white/70 text-sm text-center mt-1">
              Revoluția Cypherpunk
            </span>
          </div>
        </div>
      )}

      {/* Wallet Window */}
      {isWalletOpen && (
        <div className="fixed inset-4 bg-white rounded-lg shadow-2xl border border-gray-300 z-10 flex flex-col">
          {/* Title Bar */}
          <div className="bg-gray-100 rounded-t-lg px-6 py-3 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5" />
              <span className="font-medium">Portofelul lui Satoshi - Revoluția Cypherpunk</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={closeWallet}
                className="w-4 h-4 bg-red-500 rounded-full hover:bg-red-600"
              />
            </div>
          </div>
          
          {/* Window Content */}
          <div className="flex-1 overflow-auto">
            {renderWalletContent()}
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 rounded p-2">
            <Monitor className="w-5 h-5 text-white" />
          </div>
          {isWalletOpen && (
            <div className="bg-white/20 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-white/30">
              Portofelul lui Satoshi
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoDesktop;