"use client";

import React, { useState } from "react";
import axios from "axios";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const chains = [
    "eth-mainnet",
    "bsc-mainnet",
    "polygon-mainnet",
    "arbitrum-mainnet",
    "optimism-mainnet",
    "avalanche-mainnet",
    "base-mainnet",
    "linea-mainnet",
  ];

  const toggleChain = (chain: string) => {
    setSelectedChains((prev) =>
      prev.includes(chain)
        ? prev.filter((c) => c !== chain)
        : [...prev, chain]
    );
  };

  const handleCheck = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post("http://161.97.103.11:7272/gas", {
        wallet_address: walletAddress,
        chains: selectedChains,
      });
      setResult(res.data);
    } catch (err) {
      setError("Error connecting to backend. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full glass p-8 rounded-2xl shadow-lg border border-white/20">
        <h1 className="text-3xl font-bold mb-4 text-center">
          🔍 FHE Gas Analyzer
        </h1>

        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter Wallet Address"
          className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 placeholder-white"
        />

        <div className="flex flex-wrap gap-2 mb-4">
          {chains.map((chain) => (
            <button
              key={chain}
              onClick={() => toggleChain(chain)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedChains.includes(chain)
                  ? "bg-pink-500 text-white"
                  : "bg-white/10 text-white"
              }`}
            >
              {chain}
            </button>
          ))}
        </div>

        <button
          onClick={handleCheck}
          className="w-full py-3 bg-pink-600 hover:bg-pink-700 transition rounded-lg font-semibold"
          disabled={loading}
        >
          {loading ? "Checking..." : "Analyze Gas"}
        </button>

        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}

        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-pink-400">
              Total Gas Spent: {result.encrypted_total}
            </h2>
            <ul className="space-y-1 text-sm text-white/80">
              {Object.entries(result.breakdown).map(([chain, usd]) => (
                <li key={chain}>
                  <strong>{chain}</strong>: {String(usd)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
