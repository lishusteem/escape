# Configurare Infura pentru Crypto Escape Room

## De ce ai nevoie de Infura?

Deși aplicația funcționează cu RPC-uri publice gratuite, o cheie Infura poate îmbunătăți:
- Viteza de răspuns
- Fiabilitatea conexiunii
- Limita de request-uri

## Cum să configurezi Infura (opțional)

### Pasul 1: Creează cont Infura
1. Mergi la [infura.io](https://infura.io)
2. Creează un cont gratuit
3. Creează un nou proiect pentru Ethereum

### Pasul 2: Obține cheia API
1. În dashboard-ul Infura, selectează proiectul
2. Copiază **Project ID** (acesta este cheia ta API)

### Pasul 3: Actualizează configurația
1. Deschide fișierul `src/config/rpc.ts`
2. Înlocuiește `YOUR_INFURA_KEY` cu cheia ta reală:

```typescript
INFURA_URL: "https://sepolia.infura.io/v3/CHEIA_TA_AICI",
```

## Testare

După configurare, testează funcția de timestamping:
1. Intră în escape room
2. Încearcă provocarea "Timestamping Blockchain"
3. Verifică consolă pentru log-uri de succes

## Troubleshooting

### Timestamping nu funcționează?
- **Soluția 1**: Verifică că ai suficient ETH pentru gas (minim 0.005 ETH)
- **Soluția 2**: Aplicația folosește automat o metodă de fallback prin semnătură
- **Soluția 3**: Configurează Infura pentru performanțe mai bune

### Alte probleme?
- Verifică că MetaMask este pe Sepolia testnet
- Asigură-te că ai tokens LINK pentru provocarea de vot
- Toate contractele sunt pre-deployed pe Sepolia

## Contracte folosite

- **WETH**: `0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9`
- **LINK**: `0x779877A7B0D9E8603169DdbD7836e478b4624789`
- **UNI**: `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984`
- **Uniswap V3 Router**: `0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008`

Toate acestea sunt contracte oficiale deployed pe Sepolia testnet.
