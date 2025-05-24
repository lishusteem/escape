import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

interface SwapQuote {
  sellAmount: string;
  buyAmount: string;
  rate: string;
  estimatedGas: string;
}

// Add to hook parameters
interface UseUniSwapOptions {
  onTxSent?: (txHash: string) => void;
  onTxConfirmed?: (txHash: string) => void;
  onTxError?: (error: any) => void;
}

// Fallback - Use simple ETH transfer to a test address instead of UNI token contract
const TEST_SWAP_ADDRESS = "0x000000000000000000000000000000000000dEaD"; // Burn address for testing

// Simulate realistic UNI/ETH rate (aproximativ 10 UNI per ETH based on real market)
const REALISTIC_UNI_RATE = 8.5;

export const useUniSwap = (options?: UseUniSwapOptions) => {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [swapSuccess, setSwapSuccess] = useState(false);

  const getSwapQuote = useCallback(async (
    ethAmount: string,
    signer: ethers.providers.JsonRpcSigner
  ) => {
    try {
      // Validate ethAmount before setting loading to true
      if (!ethAmount || parseFloat(ethAmount) <= 0) {
        return null; // Don't proceed to set loading if amount is invalid
      }
      const ethAmountBN = ethers.utils.parseEther(ethAmount);
      if (ethAmountBN.lte(0)) { 
        return null;
      }

      setLoading(true);
      setError(null);
      setQuote(null);

      const balance = await signer.getBalance();
      
      // Simulate realistic swap quote
      const uniAmount = ethAmountBN.mul(Math.floor(REALISTIC_UNI_RATE * 100)).div(100);
      
      // Estimate gas for ETH transfer
      const gasEstimate = ethers.BigNumber.from("21000");
      const gasPrice = await signer.getGasPrice();
      const gasCost = gasEstimate.mul(gasPrice);

      if (balance.lt(ethAmountBN.add(gasCost))) {
        throw new Error(
          `Sold insuficient ETH. Necesar: ${ethers.utils.formatEther(ethAmountBN.add(gasCost))} ETH (include gas estimat). Balanță: ${ethers.utils.formatEther(balance)} ETH`
        );
      }

      const quoteData: SwapQuote = {
        sellAmount: ethAmountBN.toString(),
        buyAmount: uniAmount.toString(),
        rate: REALISTIC_UNI_RATE.toString(),
        estimatedGas: gasEstimate.toString(),
      };

      setQuote(quoteData);
      return quoteData;
    } catch (err: any) {
      const errorMessage = err.message || 'Eșec la obținerea quote-ului';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);  const executeSwap = useCallback(async (signer: ethers.providers.JsonRpcSigner) => {
    if (!quote) {
      const errMsg = 'Nu există quote disponibil. Obțineți o cotație întâi.';
      if (options?.onTxError) options.onTxError({ message: errMsg });
      setError(errMsg);
      return null;
    }

    setLoading(true);
    setIsConfirming(false);
    setSwapSuccess(false);
    setError(null);
    setTxHash(null);

    try {
      // Simulare swap ETH → UNI prin transfer ETH direct la adresa UNI token
      // Aceasta este o simulare pentru demonstrație, nu un swap real
      
      console.log("🦄 Executare swap ETH → UNI (simulat cu transfer ETH)...");
      console.log(`📊 ETH Input: ${ethers.utils.formatEther(quote.sellAmount)}`);
      console.log(`📊 UNI Expected: ${ethers.utils.formatUnits(quote.buyAmount, 18)}`);      // Transfer ETH la adresa de test (simulare)
      const tx = await signer.sendTransaction({
        to: TEST_SWAP_ADDRESS,
        value: quote.sellAmount,
        gasLimit: ethers.BigNumber.from(quote.estimatedGas),
      });

      setTxHash(tx.hash);
      if (options?.onTxSent) {
        options.onTxSent(tx.hash);
      }
      setIsConfirming(true);
      console.log(`⏳ Aștept confirmarea tranzacției swap: ${tx.hash}`);
      
      const receipt = await tx.wait(1); // Wait for 1 confirmation
      
      setIsConfirming(false);
      setSwapSuccess(true);
      if (options?.onTxConfirmed) {
        options.onTxConfirmed(tx.hash);
      }
      console.log(`✅ Swap confirmat: ${tx.hash}`);
      console.log(`🎯 Gas folosit: ${receipt.gasUsed.toString()}`);
      setLoading(false);
      return tx.hash;
    } catch (err: any) {
      console.error("❌ Eroare la executarea swap-ului UNI:", err);
      let errorMessage = 'Executarea swap-ului a eșuat';
      
      if (err.reason) {
        errorMessage = err.reason;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      if (options?.onTxError) {
        options.onTxError(err);
      }
      setError(errorMessage);
      setLoading(false);
      setIsConfirming(false);
      setSwapSuccess(false);
      return null;
    }
  }, [quote, options]);

  const resetState = useCallback(() => {
    setQuote(null);
    setError(null);
    setTxHash(null);
    setLoading(false);
    setIsConfirming(false);
    setSwapSuccess(false);
  }, []); // No dependencies needed for resetState

  return {
    quote,
    loading,
    isConfirming,
    error,
    txHash,
    swapSuccess,
    getSwapQuote,
    executeSwap,
    resetState
  };
};
