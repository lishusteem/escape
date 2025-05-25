# 🔐 Camera Secretă Cypherpunk - Escape Room Unificat

## Descriere

Această aplicație combină o experiență interactivă de escape room cu provocări blockchain reale, creând o experiență educațională și distractivă pentru învățarea tehnologiilor crypto.

## Caracteristici Principale

### 🎮 Interfață Unificată de Escape Room
- **Background interactiv**: Imaginea `background.gif` cu zonele clickabile
- **6 sertare** mapate la provocări crypto specifice
- **Safe final** care se deblochează după completarea tuturor provocărilor
- **Efecte vizuale** pentru feedback-ul utilizatorului

### 🔗 Provocări Blockchain Integrate

#### 1. **Semnătura Cypherpunk** (Sertar 1)
- **Tehnologie**: Personal Sign (MetaMask)
- **Acțiune**: Semnează manifestul revoluției digitale
- **Cifră obținută**: `C`
- **Dificultate**: Ușor

#### 2. **Timestamp Blockchain** (Sertar 2) 
- **Tehnologie**: Transaction cu data în `data` field
- **Acțiune**: Înregistrează momentul pe blockchain
- **Cifră obținută**: `Y`
- **Dificultate**: Ușor

#### 3. **Vot Descentralizat** (Sertar 3)
- **Tehnologie**: ETH transaction cu logică de votare
- **Acțiune**: Votează "DA" pentru descentralizare (0.0001 ETH)
- **Cifră obținută**: `P`
- **Dificultate**: Mediu

#### 4. **Mesajul Secret** (Sertar 4)
- **Tehnologie**: Transaction cu mesaj în `data` field
- **Acțiune**: Trimite cuvântul "descentralizare" pe blockchain
- **Cifră obținută**: `H`
- **Dificultate**: Mediu

#### 5. **Abonament Lista Criptată** (Sertar 5)
- **Tehnologie**: ETH donation transfer
- **Acțiune**: Donație simbolică pentru lista de mailing (0.0001 ETH)
- **Cifră obținută**: `E`
- **Dificultate**: Ușor

#### 6. **Swap ETH → Token** (Sertar 6)
- **Tehnologie**: Simulare swap DeFi
- **Acțiune**: Realizează un swap simulat ETH pentru token ERC20
- **Cifră obținută**: `R`
- **Dificultate**: Mediu

### 🔒 Combinația Finală
Când toate provocările sunt completate, combinația seifului se dezvăluie: **`CYPHER`**

## Structura Tehnică

### Componente Principale

1. **`UnifiedEscapeRoom.tsx`** - Componenta principală unificată
   - Gestionează starea jocului și integrarea blockchain
   - Include interfața vizuală cu background și zone clickabile
   - Coordonează modalurile pentru fiecare provocare

2. **Modale de Provocări**:
   - `SignMessageModal.tsx` - Semnătura digitală
   - `TimestampModal.tsx` - Timestamping
   - `VoteModal.tsx` - Votare descentralizată
   - `SendSecretMessageModal.tsx` - Mesaje secrete
   - `SymbolicDonationModal.tsx` - Donații simbolice
   - `SimpleSwapModal.tsx` - Swap-uri token

3. **`CameraEntry.tsx`** - Ecranul de introducere
4. **`App.tsx`** - Aplicația principală cu routing

### Maparea Sertarelor la Provocări

```typescript
const DRAWER_CHALLENGES = {
  1: 'signature',    // Sign message challenge
  2: 'timestamp',    // Timestamp challenge  
  3: 'vote',         // Voting challenge
  4: 'transaction',  // Send secret message challenge
  5: 'donation',     // Symbolic donation challenge
  6: 'swap'          // Token swap challenge
} as const;
```

### Coordonatele Zonelor Clickabile

```typescript
const AREA_COORDINATES = {
  area1: { left: '17%', top: '25%', width: '22%', height: '15%' },
  area2: { left: '17%', top: '42%', width: '22%', height: '15%' },
  area3: { left: '17%', top: '60%', width: '22%', height: '15%' },
  area4: { left: '62%', top: '25%', width: '22%', height: '15%' },
  area5: { left: '62%', top: '42%', width: '22%', height: '15%' },
  area6: { left: '62%', top: '60%', width: '22%', height: '15%' },
  areaSeif: { left: '60%', top: '32%', width: '18%', height: '22%' }
};
```

## Configurare și Rulare

### Prerequisite
- Node.js 18+
- MetaMask instalat în browser
- ETH de test pe rețeaua Sepolia

### Instalare
```bash
npm install
```

### Dezvoltare
```bash
npm run dev
```

### Build pentru Producție
```bash
npm run build
```

## Rețeaua Blockchain

**Rețeaua Folosită**: Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: Configurat în `src/config/rpc.ts`
- **Faucet ETH**: https://sepoliafaucet.com/

## Caracteristici Técnice

### Persistența Stării
- Starea jocului se salvează în `localStorage`
- Recuperare automată la reîncărcarea paginii
- Validare și migrare automată a datelor vechi

### Interfața Utilizator
- **Responsive design** cu Tailwind CSS
- **Efecte vizuale** pentru feedback
- **Hover effects** pe zonele clickabile
- **Animații** pentru tranziții

### Integrarea Blockchain
- **MetaMask detection** și conectare automată
- **Error handling** robust pentru tranzacții
- **Loading states** cu progress indicators
- **Gas estimation** și verificarea balanței

### Securitate
- Validarea adreselor Ethereum
- Verificarea rețelei (Sepolia only)
- Gestionarea erorilor de tranzacție
- Rate limiting pentru preventing spam

## Fișiere Importante

```
src/
├── UnifiedEscapeRoom.tsx     # Componenta principală
├── App.tsx                   # Routing și structura app
├── CameraEntry.tsx           # Ecranul de intrare
├── components/               # Modale pentru provocări
├── config/rpc.ts            # Configurare rețea
└── types/ethereum.d.ts      # Type definitions

public/
├── background.gif           # Background principal
├── solved_1.png - solved_6.png  # Imagini pentru sertare rezolvate
├── solved_seif.png          # Imaginea pentru seif
└── sounds/                  # Audio feedback (opțional)
```

## Dezvoltare Viitoare

### Funcționalități Planificate
- [ ] Suport pentru multiple rețele (Polygon, Arbitrum)
- [ ] NFT rewards pentru completare
- [ ] Leaderboard cu timpi de completare
- [ ] Provocări avansate (DeFi protocols, DAOs)
- [ ] Multiplayer mode
- [ ] Achievement system

### Optimizări
- [ ] Lazy loading pentru componente
- [ ] Better error recovery
- [ ] Offline mode support
- [ ] Mobile optimization

## Contribuții

Contribuțiile sunt binevenite! Vă rugăm să urmați:
1. Fork repository-ul
2. Creați o branch nouă pentru feature
3. Implementați și testați
4. Creați un Pull Request

## Licență

MIT License - Vezi fișierul LICENSE pentru detalii.

---

**🎮 Mulțumesc că joci Camera Secretă Cypherpunk! Învață blockchain prin experiență interactivă! 🔐**
