'use client';

import { useState } from 'react';

export default function Home() {
  const [wallet, setWallet] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedChains, setSelectedChains] = useState<string[]>([]);

  const chains = [
    'eth-mainnet',
    'bsc-mainnet',
    'polygon-mainnet',
    'arbitrum-mainnet',
    'optimism-mainnet',
    'avalanche-mainnet',
    'base-mainnet',
    'linea-mainnet',
  ];

  const toggleChain = (chain: string) => {
    setSelectedChains(prev =>
      prev.includes(chain)
        ? prev.filter(c => c !== chain)
        : [...prev, chain]
    );
  };

  const handleCheck = async () => {
    if (!wallet || selectedChains.length === 0) return alert("Enter wallet and select at least 1 chain.");
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://161.97.103.11:7272/gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: wallet, chains: selectedChains }),
      });

      if (!response.ok) throw new Error("Fetch failed");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: '❌ Error connecting to backend' });
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="glass p-6 max-w-xl w-full rounded-2xl shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">FHE Gas Spending Analyzer</h1>

        <input
          className="w-full px-4 py-2 rounded bg-white/10 backdrop-blur border border-white/20 text-white"
          placeholder="Enter Wallet Address"
          value={wallet}
          onChange={e => setWallet(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {chains.map(chain => (
            <button
              key={chain}
              onClick={() => toggleChain(chain)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedChains.includes(chain)
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/10 text-gray-300'
              }`}
            >
              {chain}
            </button>
          ))}
        </div>

        <button
          onClick={handleCheck}
          className="w-full bg-pink-600 hover:bg-pink-700 transition rounded px-4 py-2 font-semibold"
        >
          {loading ? 'Checking...' : 'Check Gas Spend'}
        </button>

        {result && (
          <div className="mt-4 text-sm space-y-2">
            {result.error && <p className="text-red-500">{result.error}</p>}

            {result.breakdown && (
              <>
                <h2 className="text-lg font-semibold">Per Chain Gas Spend:</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {Object.entries(result.breakdown).map(([chain, usd]) => (
                    <li key={chain}>
                      <strong>{chain}</strong>: {usd}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {result.encrypted_total_usd && (
              <p className="text-green-400">
                🔒 Encrypted Total Spend (USD): <br /> <code>{result.encrypted_total_usd}</code>
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
