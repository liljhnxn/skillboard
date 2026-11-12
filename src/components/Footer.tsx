"use client";

import React from "react";
import { Layers, ExternalLink, ShieldCheck } from "lucide-react";
import { SKILLBOARD_ADDRESS } from "@/config/contract";

export function Footer() {
  const isAddressConfigured =
    SKILLBOARD_ADDRESS &&
    SKILLBOARD_ADDRESS !== "0x0000000000000000000000000000000000000000";

  return (
    <footer className="border-t border-border/80 bg-secondary-bg/60 mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-neon/80 flex items-center justify-center">
                <Layers className="w-4 h-4 text-black" />
              </div>
              <span className="font-extrabold text-lg text-text">Skill<span className="text-neon">Board</span></span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed max-w-sm">
              The premier on-chain talent showcase and skill endorsement protocol.
              Decentralized, immutable, and gas-conscious.
            </p>
          </div>

          {/* Network Specs Col */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-text uppercase tracking-wider text-[11px] text-purple">
              Network Details
            </h4>
            <div className="space-y-1 text-text-muted font-mono">
              <p>Chain: <span className="text-text">Botchain Mainnet</span></p>
              <p>Chain ID: <span className="text-neon">677</span></p>
              <p>Currency: <span className="text-text">Bot (BOT)</span></p>
              <p>RPC: <span className="text-text">https://rpc.botchain.ai</span></p>
            </div>
          </div>

          {/* Smart Contract Col */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-text uppercase tracking-wider text-[11px] text-neon">
              Smart Contract
            </h4>
            <p className="text-text-muted">
              100% on-chain without any backend or database.
            </p>
            <div className="pt-1">
              {isAddressConfigured ? (
                <a
                  href={`https://scan.botchain.ai/address/${SKILLBOARD_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 font-mono text-xs text-purple hover:text-neon transition-colors break-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{SKILLBOARD_ADDRESS}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              ) : (
                <span className="font-mono text-[11px] text-text-subtle">
                  Address configured via NEXT_PUBLIC_SKILLBOARD_CONTRACT_ADDRESS
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-subtle">
          <p>© {new Date().getFullYear()} SkillBoard. All talent proofs verified on-chain.</p>
          <div className="flex items-center space-x-4">
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neon transition-colors flex items-center space-x-1"
            >
              <span>Botchain Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
