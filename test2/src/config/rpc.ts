// RPC Configuration pentru Sepolia testnet
import { ethers } from 'ethers';

export const RPC_CONFIG = {
  // Infura RPC - cheie API actualizată
  INFURA_URL: "https://sepolia.infura.io/v3/f7df352c-9f20-49c2-bd7b-26d857235430",
  
  // RPC-uri publice gratuite (mai lente, dar funcționale)
  PUBLIC_RPCS: [
    "https://rpc.sepolia.org",
    "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
    "https://sepolia.gateway.tenderly.co",
    "https://gateway.tenderly.co/public/sepolia"
  ]
};

// Funcție pentru a obține un provider RPC functional
export const getProvider = () => {
  // Încearcă MetaMask mai întâi
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum as any);
  }
  
  // Fallback la RPC public
  return new ethers.providers.JsonRpcProvider(RPC_CONFIG.PUBLIC_RPCS[0]);
};

// Funcție pentru a obține un signer (doar cu MetaMask)
export const getSigner = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask nu este disponibil pentru semnare");
  }
  
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  return provider.getSigner();
};
