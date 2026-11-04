"use client";

import React from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/config/chain";
import { AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

export function NetworkBanner() {
  const { isConnected, chain } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chain?.id === botchainTestnet.id) {
    return null;
  }

  return (
    <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-3 text-red-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-xs sm:text-sm">
            <span className="font-semibold text-red-400">Wrong Network:</span> You are connected to{" "}
            <span className="font-mono font-medium">{chain?.name || "an unsupported network"}</span>. SkillBoard runs exclusively on{" "}
            <span className="font-semibold text-neon font-mono">Botchain Testnet (Chain ID: 968)</span>.
          </p>
        </div>

        <button
          onClick={() => switchChain({ chainId: botchainTestnet.id })}
          disabled={isPending}
          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center space-x-1.5 flex-shrink-0"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Switching...</span>
            </>
          ) : (
            <>
              <span>Switch Network</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

