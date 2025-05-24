import { useState } from 'react';
import { ethers } from 'ethers';

interface SwapQuote {
  sellAmount: string;
  buyAmount: string;
  rate: string;
  estimatedGas: string;
}

export const useUniSwap = () => {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false); // Va indica încărcarea pentru getQuote și trimiterea inițială a tranzacției
  const [isConfirming, setIsConfirming] = useState(false); // Noua stare pentru așteptarea confirmării
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [swapSuccess, setSwapSuccess] = useState(false); // Noua stare pentru succesul final

  // Simple swap rate: 1 ETH = 100 UNI (mock rate for demonstration)
  const SWAP_RATE = 100;
  const getSwapQuote = async (
    ethAmount: string,
    signer: ethers.providers.JsonRpcSigner
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Validate ETH amount
      const ethAmountBN = ethers.utils.parseEther(ethAmount);
      
      if (ethAmountBN.lte(0)) {
        throw new Error('Cantitatea ETH trebuie să fie mai mare decât 0');
      }

      // Check balance
      const balance = await signer.getBalance();
      const gasEstimate = ethers.utils.parseEther('0.001'); // Estimate gas cost
      
      if (balance.lt(ethAmountBN.add(gasEstimate))) {
        throw new Error('Sold insuficient ETH pentru swap și gas');
      }

      // Calculate UNI amount (mock calculation)
      const uniAmount = ethAmountBN.mul(SWAP_RATE);
      
      const quoteData: SwapQuote = {
        sellAmount: ethAmountBN.toString(),
        buyAmount: uniAmount.toString(),
        rate: SWAP_RATE.toString(),
        estimatedGas: '21000'
      };

      setQuote(quoteData);
      return quoteData;
    } catch (err: any) {
      const errorMessage = err.message || 'Eșec la obținerea quote-ului';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const executeSwap = async (signer: ethers.providers.JsonRpcSigner) => {
    if (!quote) {
      throw new Error('Nu există quote disponibil');
    }

    setLoading(true);
    setIsConfirming(false); // Resetează starea de confirmare
    setSwapSuccess(false); // Resetează starea de succes
    setError(null);
    setTxHash(null); // Resetează hash-ul anterior

    try {
      const mockSwapContract = "0x0000000000000000000000000000000000000001";
      
      const txRequest = {
        to: mockSwapContract,
        value: quote.sellAmount,
      };

      const estimatedGas = await signer.estimateGas(txRequest);
      
      console.log("🦄 Trimitere tranzacție UNI swap...");
      const tx = await signer.sendTransaction({
        ...txRequest,
        gasLimit: estimatedGas
      });

      setTxHash(tx.hash); // Setează hash-ul imediat pentru link-ul Etherscan
      setLoading(false); // Oprește loading-ul inițial
      setIsConfirming(true); // Începe starea de confirmare
      console.log(`⏳ Aștept confirmarea tranzacției: ${tx.hash}`);
      
      await tx.wait(); // Așteaptă confirmarea tranzacției
      
      setIsConfirming(false); // Oprește starea de confirmare
      setSwapSuccess(true); // Setează succesul final
      console.log(`✅ Tranzacție confirmată: ${tx.hash}`);
      
      return tx.hash;
    } catch (err: any) {
      console.error("❌ Eroare la executarea swap-ului UNI:", err);
      const errorMessage = err.reason || err.message || 'Executarea swap-ului a eșuat';
      setError(errorMessage);
      setLoading(false);
      setIsConfirming(false);
      setSwapSuccess(false);
      // Nu arunca eroarea mai departe dacă vrem să o gestionăm în UI prin starea `error`
      // throw new Error(errorMessage); 
      return null; // Returnează null în caz de eroare
    }
  };

  const resetState = () => {
    setQuote(null);
    setError(null);
    setTxHash(null);
    setLoading(false);
    setIsConfirming(false);
    setSwapSuccess(false);
  };

  return {
    quote,
    loading,
    isConfirming, // Exportă noua stare
    error,
    txHash,
    swapSuccess, // Exportă noua stare
    getSwapQuote,
    executeSwap,
    resetState
  };
};
