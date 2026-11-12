"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { botchainMainnet } from "@/config/chain";
import {
  Wallet,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  User,
  Compass,
} from "lucide-react";

interface NavbarProps {
  onOpenMyProfile?: () => void;
  onNavigateExplore?: () => void;
}

export function Navbar({ onOpenMyProfile, onNavigateExplore }: NavbarProps) {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isWrongNetwork = isConnected && chain?.id !== botchainMainnet.id;

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === "injected") || connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={onNavigateExplore}>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-neon/80 flex items-center justify-center shadow-neon-purple group-hover:scale-105 transition-transform duration-300">
              <Layers className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon rounded-full animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-text">Skill</span>
              <span className="font-extrabold text-xl tracking-tight text-neon glow-text-neon">Board</span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-subtle block -mt-0.5">
              BOT Chain Mainnet
            </span>
          </div>
        </div>

        {/* Navigation Links with BOT Chain Logo */}
        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={onNavigateExplore}
            className="flex items-center space-x-2 text-sm font-medium text-text-muted hover:text-neon transition-colors duration-200"
          >
            <Compass className="w-4 h-4" />
            <span>Explore</span>
          </button>
          <button
            onClick={onOpenMyProfile}
            className="flex items-center space-x-2 text-sm font-medium text-text-muted hover:text-purple transition-colors duration-200"
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>

          {/* BOT Chain Website Link with Logo in Front */}
          <a
            href="https://botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-card border border-border hover:border-neon/60 text-xs font-semibold text-text-muted hover:text-neon transition-all"
            title="Official BOT Chain Website"
          >
            <img
              src="/botchain-logo.jpg"
              alt="BOT Chain Logo"
              className="w-4 h-4 rounded-sm object-cover"
            />
            <span>BOT Chain</span>
            <ExternalLink className="w-3 h-3 text-text-subtle" />
          </a>

          {/* BOT Chain Explorer Link with Logo in Front */}
          <a
            href="https://scan.botchain.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-card border border-border hover:border-purple/60 text-xs font-semibold text-text-muted hover:text-purple transition-all"
            title="Official BOT Chain Explorer"
          >
            <img
              src="/botchain-logo.jpg"
              alt="BOT Chain Explorer Logo"
              className="w-4 h-4 rounded-sm object-cover"
            />
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3 text-text-subtle" />
          </a>
        </nav>

        {/* Network & Wallet Controls */}
        <div className="flex items-center space-x-3">
          {isConnected && isWrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: botchainMainnet.id })}
              disabled={isSwitching}
              className="flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Switch to BOT Chain</span>
            </button>
          )}

          {isConnected && !isWrongNetwork && (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-mono text-neon">
              <img
                src="/botchain-logo.jpg"
                alt="BOT Chain"
                className="w-3.5 h-3.5 rounded-sm object-cover"
              />
              <span>BOT Chain (677)</span>
            </div>
          )}

          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-neon via-[#90f249] to-purple transition-all duration-300 shadow-neon-green hover:shadow-neon-purple hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <span className="flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
              </span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-card border border-border hover:border-purple/50 transition-all duration-200 text-sm font-medium"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple to-neon/80 flex items-center justify-center text-xs font-bold text-black">
                  {address ? address.substring(2, 4).toUpperCase() : "0x"}
                </div>
                <span className="font-mono text-text text-xs sm:text-sm">
                  {address ? truncateAddress(address) : ""}
                </span>
                <ChevronDown className="w-4 h-4 text-text-subtle" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl glass-panel p-2 shadow-2xl border border-border z-50 animate-in fade-in-50 zoom-in-95"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-border/60 mb-1">
                    <p className="text-[11px] text-text-subtle font-mono uppercase tracking-wider">
                      Connected Wallet
                    </p>
                    <p className="text-xs font-mono text-neon truncate mt-0.5">
                      {address}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenMyProfile?.();
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text hover:bg-card transition-colors"
                  >
                    <User className="w-4 h-4 text-purple" />
                    <span>My Profile</span>
                  </button>

                  <a
                    href={`https://scan.botchain.ai/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text hover:bg-card transition-colors"
                  >
                    <span className="flex items-center space-x-2.5">
                      <img
                        src="/botchain-logo.jpg"
                        alt="BOT Chain"
                        className="w-3.5 h-3.5 rounded-sm object-cover"
                      />
                      <span>View in Explorer</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-text-subtle" />
                  </a>

                  <button
                    onClick={() => {
                      disconnect();
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-1 border-t border-border/40"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
