
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ArrowRight, X, Loader2, ExternalLink } from 'lucide-react';

// Define contract addresses and ABIs (placeholders)
const WETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"; // Sepolia WETH
const TOKEN_ADDRESS = "0xYourCustomTokenAddress"; // Replace with your actual token address on Sepolia

const WETH_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function deposit() public payable",
    "function withdraw(uint wad) public",
    "function transfer(address dst, uint wad) public returns (bool)",
    "function balanceOf(address account) public view returns (uint256)"
];

const TOKEN_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function transfer(address dst, uint wad) public returns (bool)",
    "function balanceOf(address account) public view returns (uint256)"
];

// Placeholder for 0x API integration - in a real app, this would fetch quotes
const fetchZeroExQuote = async (sellToken: string, buyToken: string, sellAmount: string, takerAddress: string) => {
    console.log("Fetching 0x quote for", { sellToken, buyToken, sellAmount, takerAddress });
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // This is a mock response. A real implementation would call the 0x API.
    // For simplicity, we'll assume the swap is ETH to WETH (or a dummy token if WETH is not desired for direct swap)
    // and then WETH to the target token. Or directly ETH to Token if 0x supports it.
    // Here, we'll just return a placeholder that suggests a direct ETH to TOKEN swap.
    if (sellToken.toLowerCase() === "eth" && buyToken.toLowerCase() === TOKEN_ADDRESS.toLowerCase()) {
        return {
            to: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF", // 0x Exchange Proxy on Sepolia
            data: "0x0", // Placeholder: Real data would be complex
            value: sellAmount, // ETH value being sent
            gasPrice: ethers.utils.parseUnits("20", "gwei").toString(), // Example gas price
            // sellTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // ETH placeholder
            // buyTokenAddress: buyToken,
        };
    }
    throw new Error("Mock 0x API: Swap not supported for these tokens or quote failed");
};

interface HybridSwapComponentProps {
  userAddress: string;
  contracts?: { WETH_ADDRESS?: string; TOKEN_ADDRESS?: string }; // Optional for now
  onSwapSuccess: (txHash: string) => void;
  onSwapError: (error: any) => void;
  onClose: () => void;
  showTxLoadingModal: (txHash: string) => void;
  hideTxLoadingModal: () => void;
}

const HybridSwapComponent: React.FC<HybridSwapComponentProps> = ({
  userAddress,
  // contracts, // Not using this yet, but could be used to override default addresses
  onSwapSuccess,
  onSwapError,
  onClose,
  showTxLoadingModal,
  hideTxLoadingModal,
}) => {
  const [amount, setAmount] = useState("0.01"); // Default ETH amount to swap
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useZeroEx, setUseZeroEx] = useState(true); // Toggle for swap method

  const effectiveWethAddress = WETH_ADDRESS;
  const effectiveTokenAddress = TOKEN_ADDRESS;

  const handleSwap = async () => {
    if (!userAddress || !window.ethereum) {
      setError("Portofelul MetaMask nu este conectat.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const ethAmount = ethers.utils.parseEther(amount);

      if (useZeroEx) {
        // 0x Protocol Swap (ETH to Token)
        try {
            const quote = await fetchZeroExQuote("eth", effectiveTokenAddress, ethAmount.toString(), userAddress);
            
            const tx = await signer.sendTransaction({
                to: quote.to,
                data: quote.data,
                value: quote.value, // This is critical for ETH-based swaps
                gasLimit: 300000, // Adjust gas limit as needed for 0x swaps
                // gasPrice: quote.gasPrice, // Optional: use if provided by 0x
            });
            showTxLoadingModal(tx.hash);
            await tx.wait();
            onSwapSuccess(tx.hash);
        } catch (e: any) {
            console.error("0x swap error:", e);
            setError(`Eroare la swap prin 0x: ${e.message || "Necunoscută"}. Încercăm metoda directă...`);
            // Fallback to direct/simple swap if 0x fails
            setUseZeroEx(false); // Switch to simple for next attempt if user retries
            // Automatically try simple swap as a fallback
            await simpleSwap(signer, ethAmount);
        }
      } else {
        // Simple Swap (ETH -> WETH -> Token or direct if possible, here ETH -> WETH for demo)
        await simpleSwap(signer, ethAmount);
      }
    } catch (e: any) {
      console.error("Swap general error:", e);
      setError(`Eroare la swap: ${e.message || "Necunoscută"}`);
      onSwapError(e);
    } finally {
      hideTxLoadingModal();
      setIsLoading(false);
    }
  };

  // Simple swap: ETH -> WETH (as a basic example of contract interaction)
  // A more complete simple swap would be ETH -> WETH -> CustomToken via Uniswap router or similar
  const simpleSwap = async (signer: ethers.Signer, ethAmount: ethers.BigNumber) => {
    try {
        const wethContract = new ethers.Contract(effectiveWethAddress, WETH_ABI, signer);
        
        // Check ETH balance
        const balance = await signer.getBalance();
        if (balance.lt(ethAmount)) {
            throw new Error("Balanță ETH insuficientă pentru swap.");
        }

        // Deposit ETH to get WETH
        const depositTx = await wethContract.deposit({ value: ethAmount, gasLimit: 100000 });
        showTxLoadingModal(depositTx.hash);
        await depositTx.wait();
        hideTxLoadingModal(); // Hide after WETH deposit, show again for next step if any

        alert("ETH a fost convertit în WETH cu succes! (Pas intermediar pentru demo)");
        // For a full simple swap to TOKEN, you would now:
        // 1. Approve WETH spending by the TOKEN_ROUTER_CONTRACT
        // 2. Call swap on TOKEN_ROUTER_CONTRACT (e.g., UniswapV2Router02.swapExactTokensForTokens)
        // For this demo, we'll consider WETH deposit as the "swap success"
        // and pass the depositTx hash.
        // If this were a multi-step simple swap, you'd call show/hide modal for each transaction.
        onSwapSuccess(depositTx.hash); // Or the hash of the final token swap tx

    } catch (e:any) {
        hideTxLoadingModal();
        console.error("Simple swap error:", e);
        setError(`Eroare la swap simplu (ETH->WETH): ${e.message || "Necunoscută"}`);
        onSwapError(e); // Propagate error
        throw e; // Re-throw to be caught by main handler if called from there
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-lg relative">
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
        <X size={24} />
      </button>
      <h2 className="text-2xl font-bold mb-4 text-purple-300">Swap Hibrid</h2>
      <p className="text-sm text-gray-400 mb-1">
        Schimbă ETH pentru un token demonstrativ.
      </p>
      <p className="text-xs text-gray-500 mb-4">
        Adresa ta: {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : "N/A"}
      </p>

      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Cantitate ETH de schimbat:</label>
        <input 
          type="number" 
          id="amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-purple-500 focus:border-purple-500"
          placeholder="0.01"
          step="0.001"
        />
      </div>

      <div className="mb-6">
        <p className="block text-sm font-medium text-gray-300 mb-1">Metodă Swap:</p>
        <div className="flex items-center space-x-4">
            <button 
                onClick={() => setUseZeroEx(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                            ${useZeroEx ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
                0x Protocol (Recomandat)
            </button>
            <button 
                onClick={() => setUseZeroEx(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                            ${!useZeroEx ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
                Swap Simplu (ETH → WETH Demo)
            </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
            {useZeroEx 
                ? "Folosește 0x API pentru a găsi cel mai bun preț (simulat)."
                : "Convertește ETH în WETH (ca demo pentru o interacțiune directă cu contract)."}
        </p>
      </div>

      {error && (
        <div className="bg-red-800 border border-red-600 text-red-200 p-3 rounded-md mb-4 text-sm">
          <p><strong>Eroare:</strong> {error}</p>
        </div>
      )}

      <button 
        onClick={handleSwap} 
        disabled={isLoading || !userAddress || !amount || parseFloat(amount) <= 0}
        className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20}/> 
            <span>Se procesează Swap...</span>
          </>
        ) : (
          <>
            <span>Confirmă Swap</span>
            <ArrowRight size={20}/>
          </>
        )}
      </button>
      
      {TOKEN_ADDRESS === "0xYourCustomTokenAddress" && (
          <p className="text-xs text-yellow-400 mt-3 text-center">
              Notă: Adresa token-ului personalizat (`TOKEN_ADDRESS`) trebuie actualizată în cod pentru funcționalitate completă.
          </p>
      )}
      <p className="text-xs text-gray-500 mt-3 text-center">
        Asigură-te că ești pe rețeaua Sepolia și ai suficient ETH pentru tranzacție și gaz.
      </p>
      <div className="mt-3 text-center">
        <a href="https://sepolia.etherscan.io/address/0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:underline">
            WETH (Sepolia) <ExternalLink size={12} className="inline"/>
        </a>
        {TOKEN_ADDRESS !== "0xYourCustomTokenAddress" && 
            <a href={`https://sepolia.etherscan.io/address/${TOKEN_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:underline ml-2">
                Token Custom (Sepolia) <ExternalLink size={12} className="inline"/>
            </a>
        }
      </div>
    </div>
  );
};

export default HybridSwapComponent;
