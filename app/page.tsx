"use client";

import React, { useState } from "react";

const CHAINS = [
  "eth-mainnet",
  "bsc-mainnet",
  "polygon-mainnet",
  "avalanche-mainnet",
  "arbitrum-mainnet",
  "optimism-mainnet",
  "base-mainnet",
  "linea-mainnet",
  "scroll-mainnet"
];

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const toggleChain = (chain: string) => {
    setSelectedChains((prev) =>
      prev.includes(chain)
        ? prev.filter((c) => c !== chain)
        : [...prev, chain]
    );
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://161.97.103.11:7272/gas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: wallet,
          chains: selectedChains,
        }),
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Error connecting to backend. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-2xl mx-auto glassmorphic p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4">FHE Gas Spending Analyzer</h1>

        <input
          type="text"
          placeholder="Enter wallet address"
          className="w-full p-2 rounded bg-darkglass backdrop-blur-xs mb-4 border border-gray-700"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />

        <div className="flex flex-wrap gap-2 mb-4">
          {CHAINS.map((chain) => (
            <button
              key={chain}
              className={`px-3 py-1 rounded-full border ${
                selectedChains.includes(chain)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
              onClick={() => toggleChain(chain)}
            >
              {chain.replace("-mainnet", "")}
            </button>
          ))}
        </div>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={fetchData}
          disabled={loading || !wallet || selectedChains.length === 0}
        >
          {loading ? "Checking..." : "Analyze"}
        </button>

        {error && <p className="text-red-400 mt-4">{error}</p>}

        {result && (
          <div className="mt-6">
            <h2 className="text-xl mb-2 font-semibold">Gas Breakdown</h2>
            <ul className="text-sm mb-4">
              {Object.entries(result.breakdown).map(([chain, usd]) => (
                <li key={chain}>
                  <strong>{chain}</strong>: {usd}
                </li>
              ))}
            </ul>

            <div className="text-sm text-green-400 break-all">
              <span className="text-white font-semibold">Encrypted Total USD:</span><br />
              {result.encrypted_total_usd}
            </div>
          </div>
        )}
      </div>
    </main>
  );
          }
