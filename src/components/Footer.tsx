"use client";

import React from "react";
import { Layers, ExternalLink, ShieldCheck, Cpu } from "lucide-react";
import { SKILLBOARD_ADDRESS } from "@/config/contract";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-secondary-bg/80 mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-neon/80 flex items-center justify-center shadow-neon-purple">
                <Layers className="w-4 h-4 text-black" />
              </div>
              <span className="font-extrabold text-lg text-text">Skill<span className="text-neon">Board</span></span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed max-w-sm">
              The premier on-chain talent showcase and skill endorsement protocol.
              Decentralized, immutable, and gas-conscious.
            </p>
          </div>

          {/* BOT Chain Ecosystem Links Col with Logo in Front */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-text uppercase tracking-wider text-[11px] text-neon flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>BOT Chain Ecosystem</span>
            </h4>
            <ul className="space-y-2.5 pt-1 font-medium">
              <li>
                <a
                  href="https://botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-text-muted hover:text-neon transition-colors group"
                >
                  <img
                    src="/botchain-logo.jpg"
                    alt="BOT Chain Logo"
                    className="w-4 h-4 rounded-sm object-cover group-hover:scale-110 transition-transform"
                  />
                  <span className="font-semibold text-text group-hover:text-neon">BOT Chain Website</span>
                  <ExternalLink className="w-3 h-3 text-text-subtle" />
                </a>
              </li>
              <li>
                <a
                  href="https://scan.botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-text-muted hover:text-neon transition-colors group"
                >
                  <img
                    src="/botchain-logo.jpg"
                    alt="BOT Chain Explorer Logo"
                    className="w-4 h-4 rounded-sm object-cover group-hover:scale-110 transition-transform"
                  />
                  <span className="font-semibold text-text group-hover:text-neon">BOT Chain Explorer</span>
                  <ExternalLink className="w-3 h-3 text-text-subtle" />
                </a>
              </li>
            </ul>
          </div>

          {/* Network Specs Col */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-text uppercase tracking-wider text-[11px] text-purple">
              Network Details
            </h4>
            <div className="space-y-1 text-text-muted font-mono">
              <p>Network: <span className="text-text font-semibold">BOT Chain</span></p>
              <p>Chain ID: <span className="text-neon">677</span></p>
              <p>Currency: <span className="text-text">BOT</span></p>
              <p>RPC: <span className="text-text">https://rpc.botchain.ai</span></p>
            </div>
          </div>

          {/* Smart Contract Col - Only Mainnet Address */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-text uppercase tracking-wider text-[11px] text-neon">
              Smart Contract
            </h4>
            <p className="text-text-muted">
              100% on-chain on BOT Chain Mainnet.
            </p>
            <div className="pt-1">
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
            </div>
          </div>
        </div>

        {/* Bottom Bar with Logos */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-subtle">
          <p>© {new Date().getFullYear()} SkillBoard on BOT Chain. All talent proofs verified on-chain.</p>
          <div className="flex items-center space-x-6">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neon transition-colors flex items-center space-x-1.5"
            >
              <img
                src="/botchain-logo.jpg"
                alt="BOT Chain"
                className="w-3.5 h-3.5 rounded-sm object-cover"
              />
              <span>botchain.ai</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neon transition-colors flex items-center space-x-1.5"
            >
              <img
                src="/botchain-logo.jpg"
                alt="BOT Chain Explorer"
                className="w-3.5 h-3.5 rounded-sm object-cover"
              />
              <span>scan.botchain.ai</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
