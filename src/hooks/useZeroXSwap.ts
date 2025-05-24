import { useState } from 'react';
import { ethers } from 'ethers';

interface ZeroXSwapQuote {
  sellAmount: string;
  buyAmount: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  gasPrice: string;
  estimatedPriceImpact?: string;
}

export const useZeroXSwap = () => {
  const [quote, setQuote] = useState<ZeroXSwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
  const API_KEY = "f7df352c-9f20-49c2-bd7b-26d857235430";

  const getSwapQuote = async (
    ethAmount: string,
    tokenAddress: string,
    signer: ethers.providers.JsonRpcSigner
  ) => {
    setLoading(true);
    setError(null);

    try {
      const sellAmount = ethers.utils.parseEther(ethAmount).toString();
      const takerAddress = await signer.getAddress();

      const params = new URLSearchParams({
        sellToken: ETH_ADDRESS,
        buyToken: tokenAddress,
        sellAmount: sellAmount,
        takerAddress: takerAddress,
        slippagePercentage: '1'
      });

      // Headers cu cheia API pentru 0x Protocol
      const headers = {
        'Content-Type': 'application/json',
        '0x-api-key': API_KEY
      };

      console.log(`🔄 Obțin cotație 0x pentru ${ethAmount} ETH → ${tokenAddress}`);

      const response = await fetch(`https://sepolia.api.0x.org/swap/v1/quote?${params}`, {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ reason: 'API Error' }));
        throw new Error(errorData.reason || `API Error: ${response.status} - ${response.statusText}`);
      }

      const quoteData = await response.json();
      setQuote(quoteData);
      console.log("✅ Cotație 0x obținută:", quoteData);
      return quoteData;
    } catch (err: any) {
      const errorMessage = err.message || 'Eșec la obținerea cotației 0x';
      console.error("❌ Eroare cotație 0x:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const executeSwap = async (signer: ethers.providers.JsonRpcSigner) => {
    if (!quote) {
      throw new Error('Nu există cotație disponibilă');
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🚀 Execut swap 0x Protocol...");
      
      const tx = await signer.sendTransaction({
        to: quote.to,
        data: quote.data,
        value: quote.value,
        gasLimit: quote.gas
      });

      setTxHash(tx.hash);
      console.log("✅ Tranzacție trimisă:", tx.hash);
      
      // Wait for confirmation
      await tx.wait();
      console.log("✅ Swap 0x confirmat!");
      
      return tx.hash;
    } catch (err: any) {
      const errorMessage = err.message || 'Executarea swap-ului 0x a eșuat';
      console.error("❌ Eroare execuție swap 0x:", errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setQuote(null);
    setError(null);
    setTxHash(null);
    setLoading(false);
  };

  return {
    quote,
    loading,
    error,
    txHash,
    getSwapQuote,
    executeSwap,
    resetState
  };
};
