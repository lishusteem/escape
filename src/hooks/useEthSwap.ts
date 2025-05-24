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

export const useUniSwap = (options?: UseUniSwapOptions) => {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [swapSuccess, setSwapSuccess] = useState(false);

  const SWAP_RATE = 100;
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
      // This check is redundant if parseFloat is used above, but good for BN comparison
      if (ethAmountBN.lte(0)) { 
        return null;
      }

      setLoading(true); // Set loading only when we are ready to perform async operations
      setError(null);   // Clear previous errors
      setQuote(null);   // Clear previous quote

      const balance = await signer.getBalance();
      // A more realistic gas estimation or a fixed higher value might be needed
      const estimatedGasForTx = ethers.utils.parseUnits("50000", "wei"); // Example gas limit
      const gasPrice = await signer.getGasPrice();
      const gasCost = estimatedGasForTx.mul(gasPrice);

      if (balance.lt(ethAmountBN.add(gasCost))) {
        throw new Error(
          `Sold insuficient ETH. Necesar: ${ethers.utils.formatEther(ethAmountBN.add(gasCost))} ETH (include gas estimat). Balanță: ${ethers.utils.formatEther(balance)} ETH`
        );
      }

      const uniAmount = ethAmountBN.mul(SWAP_RATE);
      const quoteData: SwapQuote = {
        sellAmount: ethAmountBN.toString(),
        buyAmount: uniAmount.toString(),
        rate: SWAP_RATE.toString(),
        estimatedGas: estimatedGasForTx.toString(), // Or a string representation of estimated cost
      };

      setQuote(quoteData);
      return quoteData;
    } catch (err: any) {
      const errorMessage = err.message || 'Eșec la obținerea quote-ului';
      setError(errorMessage);
      // Do not throw here, let the UI handle the error state
      return null;
    } finally {
      setLoading(false);
    }
  }, [SWAP_RATE]); // Dependencies for useCallback

  const executeSwap = useCallback(async (signer: ethers.providers.JsonRpcSigner) => {
    if (!quote) {
      const errMsg = 'Nu există quote disponibil. Obțineți o cotație întâi.';
      if (options?.onTxError) options.onTxError({ message: errMsg });
      setError(errMsg);
      // throw new Error(errMsg); // Avoid throwing, let UI handle
      return null;
    }

    setLoading(true);
    setIsConfirming(false);
    setSwapSuccess(false);
    setError(null);
    setTxHash(null);

    try {
      const mockSwapContract = "0x000000000000000000000000000000000000dEaD"; // Using a dead address for mock
      
      const txRequest = {
        to: mockSwapContract,
        value: quote.sellAmount,
      };

      // Estimate gas more accurately for the actual transaction if possible
      // For a simple ETH transfer, this is often 21000, but can vary.
      // Using a slightly higher limit for safety or the one from quote if it's reliable.
      const gasLimitForTx = ethers.BigNumber.from(quote.estimatedGas || "25000"); 

      console.log("🦄 Trimitere tranzacție UNI swap...");
      const tx = await signer.sendTransaction({
        ...txRequest,
        gasLimit: gasLimitForTx 
      });

      setTxHash(tx.hash);
      if (options?.onTxSent) {
        options.onTxSent(tx.hash);
      }
      // setLoading(false); // Keep loading true until confirmation or error
      setIsConfirming(true);
      console.log(`⏳ Aștept confirmarea tranzacției: ${tx.hash}`);
      
      await tx.wait(1); // Wait for 1 confirmation
      
      setIsConfirming(false);
      setSwapSuccess(true);
      if (options?.onTxConfirmed) {
        options.onTxConfirmed(tx.hash);
      }
      console.log(`✅ Tranzacție confirmată: ${tx.hash}`);
      setLoading(false); // Stop loading after confirmation
      return tx.hash;    } catch (err: any) {
      console.error("❌ Eroare la executarea swap-ului UNI:", err);
      const errorMessage = err.reason || err.message || 'Executarea swap-ului a eșuat';
      if (options?.onTxError) {
        options.onTxError(err);
      }
      setError(errorMessage);
      setLoading(false);
      setIsConfirming(false);
      setSwapSuccess(false);
      return null;
    }
  }, [quote, options]); // Dependencies for useCallback

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
