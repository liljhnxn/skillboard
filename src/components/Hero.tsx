"use client";

import React from "react";
import { Sparkles, ArrowRight, Compass, ShieldCheck, Users, Flame } from "lucide-react";

interface HeroProps {
  onExploreClick: () => void;
  onCreateProfileClick: () => void;
  hasProfile: boolean;
  totalBuilders: number;
}

export function Hero({
  onExploreClick,
  onCreateProfileClick,
  hasProfile,
  totalBuilders,
}: HeroProps) {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[200px] bg-neon/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Network Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-card border border-border/80 shadow-inner mb-8 animate-fade-in">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon" />
          </span>
          <span className="text-xs font-mono text-text-muted">
            Live on <span className="text-neon font-semibold">Botchain Testnet</span> (Chain ID: 968)
          </span>
          <span className="text-text-subtle text-xs">|</span>
          <span className="text-xs font-mono text-purple font-medium">100% On-Chain</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          <span className="text-text block">Show Your Skills.</span>
          <span className="bg-gradient-to-r from-purple via-[#c084fc] to-neon bg-clip-text text-transparent glow-text-purple">
            Build Your Reputation.
          </span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-muted mb-10 leading-relaxed">
          Discover talented people, showcase your abilities, and build your identity on-chain.
          Every profile, skill, and endorsement is verified directly on Botchain smart contracts.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-black bg-neon hover:bg-[#8ee84f] shadow-neon-green transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Skills</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onCreateProfileClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-text bg-card hover:bg-card-hover border border-border hover:border-purple/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-purple" />
            <span>{hasProfile ? "Manage My Profile" : "Create Profile"}</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 max-w-4xl mx-auto">
          <div className="glass-panel p-5 rounded-2xl text-left border border-border/80">
            <div className="w-9 h-9 rounded-xl bg-purple/20 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-purple" />
            </div>
            <h4 className="text-sm font-bold text-text mb-1">Permanent On-Chain Identity</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Your profile and talent proofs reside permanently on the Botchain ledger with no centralized DB.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl text-left border border-border/80">
            <div className="w-9 h-9 rounded-xl bg-neon/20 flex items-center justify-center mb-3">
              <Flame className="w-5 h-5 text-neon" />
            </div>
            <h4 className="text-sm font-bold text-text mb-1">Peer Endorsements</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Colleagues and communities endorse specific skills. Zero self-endorsement ensures true credibility.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl text-left border border-border/80">
            <div className="w-9 h-9 rounded-xl bg-purple/20 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-purple" />
            </div>
            <h4 className="text-sm font-bold text-text mb-1">
              {totalBuilders > 0 ? `${totalBuilders} On-Chain Builders` : "Decentralized Talent Network"}
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Browse profiles, discover top talent across the ecosystem, and connect with fellow developers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

