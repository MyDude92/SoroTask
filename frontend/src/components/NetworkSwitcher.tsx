"use client";

import React, { useState, useEffect } from "react";
import { NETWORKS, NetworkId, NetworkConfig, DEFAULT_NETWORK_ID, getNetworkConfig, partitionCacheKey } from "../lib/network/config";

export interface NetworkSwitcherProps {
  onNetworkChange?: (newNetwork: NetworkConfig) => void;
  className?: string;
}

export function NetworkSwitcher({ onNetworkChange, className = "" }: NetworkSwitcherProps) {
  const [currentNetworkId, setCurrentNetworkId] = useState<NetworkId>(DEFAULT_NETWORK_ID);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sorotask_active_network") as NetworkId;
    if (saved && NETWORKS[saved]) {
      setCurrentNetworkId(saved);
    }
  }, []);

  const handleSelect = (id: NetworkId) => {
    setCurrentNetworkId(id);
    localStorage.setItem("sorotask_active_network", id);
    setIsOpen(false);

    // Notify caller and partition storage
    const config = getNetworkConfig(id);
    if (onNetworkChange) {
      onNetworkChange(config);
    }
  };

  const currentNetwork = getNetworkConfig(currentNetworkId);

  return (
    <div className={`relative inline-block text-left ${className}`} data-testid="network-switcher">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-expanded={isOpen}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            currentNetwork.id === "mainnet"
              ? "bg-emerald-400"
              : currentNetwork.id === "testnet"
              ? "bg-amber-400"
              : "bg-purple-400"
          }`}
        />
        <span>{currentNetwork.name}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-slate-700 bg-slate-900 p-1 shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Select Network
          </div>
          {(Object.keys(NETWORKS) as NetworkId[]).map((id) => {
            const net = NETWORKS[id];
            const isSelected = net.id === currentNetworkId;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSelect(id)}
                className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs ${
                  isSelected
                    ? "bg-indigo-600/20 text-indigo-300 font-semibold"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      net.id === "mainnet"
                        ? "bg-emerald-400"
                        : net.id === "testnet"
                        ? "bg-amber-400"
                        : "bg-purple-400"
                    }`}
                  />
                  <span>{net.name}</span>
                </div>
                {isSelected && (
                  <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
