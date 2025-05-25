import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const EthSwapComponent = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState('');
  const [ethAmount, setEthAmount] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState('');

  // Constante
  const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
  const SEPOLIA_CHAIN_ID = 11155111;

  // Token-uri predefinite pentru testare
  const TEST_TOKENS = {
    'TEST': '0x87385341ddc97a7610603299f42fc386e2c13e59',
    'Custom': 'custom'
  };

  // Conectare la wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      await provider.send("eth_requestAccounts", []);
      
      const network = await provider.getNetwork();
      if (network.chainId !== SEPOLIA_CHAIN_ID) {
        alert('Please switch to Sepolia testnet!');
        return;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setStatus(`Connected: ${address.slice(0,6)}...${address.slice(-4)}`);
    } catch (error: any) {
      setStatus(`Connection failed: ${error.message}`);
    }
  };

  // Obținere quote de la 0x API
  const getQuote = async () => {
    if (!ethAmount || !tokenAddress || !signer) {
      alert('Please fill all fields and connect wallet!');
      return;
    }

    setLoading(true);
    setStatus('Getting quote...');    try {
      const sellAmount = ethers.utils.parseEther(ethAmount).toString();
      const takerAddress = await signer.getAddress();

      const params = new URLSearchParams({
        sellToken: ETH_ADDRESS,
        buyToken: tokenAddress,
        sellAmount: sellAmount,
        takerAddress: takerAddress,
        slippagePercentage: '1'
      });

      const response = await fetch(`https://sepolia.api.0x.org/swap/v1/quote?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.reason || `API Error: ${response.status}`);
      }

      const quoteData = await response.json();
      setQuote(quoteData);
      setStatus('Quote ready! Review and execute swap.');
    } catch (error: any) {
      setStatus(`Quote failed: ${error.message}`);
      console.error('Quote error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Execuția swap-ului
  const executeSwap = async () => {
    if (!quote || !signer) {
      alert('Please get a quote first!');
      return;
    }

    setLoading(true);
    setStatus('Executing swap...');

    try {
      const tx = await signer.sendTransaction({
        to: quote.to,
        data: quote.data,
        value: quote.value,
        gasLimit: quote.gas
      });

      setTxHash(tx.hash);
      setStatus(`Transaction sent: ${tx.hash.slice(0,10)}...`);      // Așteaptă confirmarea
      await tx.wait();
      setStatus('Swap completed successfully!');
      
      // Reset form
      setQuote(null);
      setEthAmount('');
      
    } catch (error: any) {
      setStatus(`Swap failed: ${error.message}`);
      console.error('Swap error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verificare balanță ETH
  const [ethBalance, setEthBalance] = useState('0');
  
  useEffect(() => {
    const updateBalance = async () => {
      if (provider && account) {        try {
          const balance = await provider.getBalance(account);
          setEthBalance(ethers.utils.formatEther(balance));
        } catch (error) {
          console.error('Balance check failed:', error);
        }
      }
    };

    updateBalance();
    const interval = setInterval(updateBalance, 10000); // Update la 10 secunde
    
    return () => clearInterval(interval);
  }, [provider, account]);

  return (
    <div className="eth-swap-container">
      <div className="swap-card">
        <h2>🚀 ETH → Token Swap</h2>
        <div className="network-info">
          📍 Sepolia Testnet | Chain ID: {SEPOLIA_CHAIN_ID}
        </div>

        {/* Wallet Connection */}
        {!account ? (
          <button 
            onClick={connectWallet}
            className="connect-btn"
            disabled={loading}
          >
            🔗 Connect Wallet
          </button>
        ) : (
          <div className="wallet-info">
            <div>✅ Connected: {account.slice(0,6)}...{account.slice(-4)}</div>
            <div>💰 Balance: {parseFloat(ethBalance).toFixed(4)} ETH</div>
          </div>
        )}

        {/* Swap Form */}
        {account && (
          <div className="swap-form">
            <div className="input-group">
              <label>💰 ETH Amount</label>
              <input
                type="number"
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
                placeholder="0.1"
                step="0.01"
                min="0.001"
                disabled={loading}
              />
              <small>Available: {parseFloat(ethBalance).toFixed(4)} ETH</small>
            </div>

            <div className="input-group">
              <label>🎯 Target Token</label>
              <select 
                value={tokenAddress || ''} 
                onChange={(e) => setTokenAddress(e.target.value)}
                disabled={loading}
              >
                <option value="">Select token...</option>
                {Object.entries(TEST_TOKENS).map(([name, address]) => (
                  <option key={name} value={address}>{name} Token</option>
                ))}
              </select>
              
              {tokenAddress === 'custom' && (
                <input
                  type="text"
                  placeholder="0x... token address"
                  onChange={(e) => setTokenAddress(e.target.value)}
                  disabled={loading}
                  style={{marginTop: '10px'}}
                />
              )}
            </div>

            <div className="button-group">
              <button 
                onClick={getQuote}
                disabled={loading || !ethAmount || !tokenAddress}
                className="quote-btn"
              >
                {loading ? '⏳' : '📊'} Get Quote
              </button>

              {quote && (
                <button 
                  onClick={executeSwap}
                  disabled={loading}
                  className="swap-btn"
                >
                  {loading ? '⏳ Swapping...' : '⚡ Execute Swap'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quote Details */}
        {quote && (
          <div className="quote-details">
            <h3>📋 Quote Details</h3>            <div className="quote-item">
              <span>💰 ETH In:</span>
              <span>{ethers.utils.formatEther(quote.sellAmount)} ETH</span>
            </div>
            <div className="quote-item">
              <span>🪙 Tokens Out:</span>
              <span>{quote.buyAmount}</span>
            </div>
            <div className="quote-item">
              <span>⛽ Gas Estimate:</span>
              <span>{parseInt(quote.gas).toLocaleString()}</span>
            </div>
            <div className="quote-item">
              <span>💸 Gas Price:</span>
              <span>{ethers.utils.formatUnits(quote.gasPrice, 'gwei')} gwei</span>
            </div>
            {quote.estimatedPriceImpact && (
              <div className="quote-item">
                <span>🎯 Price Impact:</span>
                <span>{quote.estimatedPriceImpact}%</span>
              </div>
            )}
          </div>
        )}

        {/* Status */}
        <div className={`status ${status.includes('failed') || status.includes('Error') ? 'error' : ''}`}>
          {status}
        </div>

        {/* Transaction Link */}
        {txHash && (
          <div className="tx-link">
            🔗 <a 
              href={`https://sepolia.etherscan.io/tx/${txHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View on Etherscan
            </a>
          </div>
        )}
      </div>      <style>{`
        .eth-swap-container {
          max-width: 500px;
          margin: 20px auto;
          padding: 20px;
        }

        .swap-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 30px;
          color: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .network-info {
          background: rgba(255, 255, 255, 0.1);
          padding: 10px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .connect-btn, .quote-btn, .swap-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin: 10px 0;
          transition: all 0.3s ease;
        }

        .connect-btn {
          background: linear-gradient(45deg, #4ecdc4, #44a08d);
        }

        .quote-btn {
          background: linear-gradient(45deg, #f093fb, #f5576c);
        }

        .swap-btn {
          background: linear-gradient(45deg, #ff6b6b, #ee5a24);
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .wallet-info {
          background: rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .input-group {
          margin: 20px 0;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .input-group input, .input-group select {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 16px;
          box-sizing: border-box;
        }

        .input-group input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .input-group small {
          display: block;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
        }

        .quote-details {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        }

        .quote-item {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 5px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .status {
          background: rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 10px;
          margin: 20px 0;
          text-align: center;
          min-height: 20px;
        }

        .status.error {
          background: rgba(255, 0, 0, 0.2);
        }

        .tx-link {
          text-align: center;
          margin: 15px 0;
        }

        .tx-link a {
          color: #4ecdc4;
          text-decoration: none;
        }

        .tx-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default EthSwapComponent;
