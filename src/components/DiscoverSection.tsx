"use client";

import React, { useState, useMemo } from "react";
import { Compass, Search, Filter, Users, Sparkles, Loader2 } from "lucide-react";
import { ProfileCard } from "./ProfileCard";
import { ProfileData } from "@/types";

interface DiscoverSectionProps {
  profiles: ProfileData[];
  currentUserAddress: `0x${string}` | undefined;
  isConnected: boolean;
  isLoading: boolean;
  onEndorse: (user: `0x${string}`, skill: string) => Promise<void>;
  isActionLoading: boolean;
  actionTarget: string | null;
  hasUserEndorsedMap: Record<string, boolean>;
}

export function DiscoverSection({
  profiles,
  currentUserAddress,
  isConnected,
  isLoading,
  onEndorse,
  isActionLoading,
  actionTarget,
  hasUserEndorsedMap,
}: DiscoverSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>("ALL");

  // Extract all unique skills across all profiles for quick filter tags
  const uniqueSkills = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => {
      p.skills.forEach((s) => set.add(s));
    });
    return Array.from(set).sort();
  }, [profiles]);

  // Filter profiles based on search query and selected skill
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.username.toLowerCase().includes(query) ||
        p.bio.toLowerCase().includes(query) ||
        p.wallet.toLowerCase().includes(query) ||
        p.skills.some((s) => s.toLowerCase().includes(query));

      const matchesSkill =
        selectedSkillFilter === "ALL" ||
        p.skills.some((s) => s.toLowerCase() === selectedSkillFilter.toLowerCase());

      return matchesSearch && matchesSkill;
    });
  }, [profiles, searchQuery, selectedSkillFilter]);

  return (
    <section id="explore" className="py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase text-neon tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Talent Explorer</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
              Discover On-Chain Builders
            </h2>
            <p className="text-sm text-text-muted mt-1 max-w-xl">
              Browse verified talent on BOT Chain. Endorse your peers and validate Web3 credentials.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono px-3.5 py-1.5 rounded-xl bg-card border border-border text-text-muted self-start md:self-auto">
            <Users className="w-4 h-4 text-purple" />
            <span>Total Builders:</span>
            <span className="text-neon font-bold">{profiles.length}</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="glass-panel p-4 rounded-2xl border border-border mb-8 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username, skill (e.g. Solidity, React), bio, or wallet address..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-text placeholder-text-subtle focus:outline-none focus:border-neon/70 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-text-subtle hover:text-text"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Skill Filter Badges */}
          {uniqueSkills.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
              <span className="text-text-subtle flex items-center space-x-1 pl-1 flex-shrink-0">
                <Filter className="w-3 h-3" />
                <span className="text-[11px] uppercase tracking-wider font-semibold">Skills:</span>
              </span>

              <button
                onClick={() => setSelectedSkillFilter("ALL")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                  selectedSkillFilter === "ALL"
                    ? "bg-purple text-black font-bold shadow-neon-purple"
                    : "bg-card text-text-muted hover:text-text border border-border"
                }`}
              >
                All ({profiles.length})
              </button>

              {uniqueSkills.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSkillFilter(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                    selectedSkillFilter === s
                      ? "bg-neon text-black font-bold shadow-neon-green"
                      : "bg-card text-text-muted hover:text-text border border-border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profiles Grid */}
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-neon mx-auto mb-3" />
            <p className="text-sm text-text-muted font-mono">
              Loading verified profiles from Botchain...
            </p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl border border-dashed border-border max-w-xl mx-auto p-8">
            <div className="w-12 h-12 rounded-2xl bg-purple/10 text-purple mx-auto flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-text mb-1">
              {profiles.length === 0 ? "No Profiles Registered Yet" : "No Matching Builders Found"}
            </h3>
            <p className="text-xs text-text-muted max-w-md mx-auto mb-4">
              {profiles.length === 0
                ? "Be the very first developer to claim your on-chain identity and showcase your skills on SkillBoard!"
                : "Try adjusting your search terms or filter tags to discover more builders."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((p) => (
              <ProfileCard
                key={p.wallet}
                wallet={p.wallet}
                username={p.username}
                bio={p.bio}
                skills={p.skills}
                skillEndorsements={p.skillEndorsements}
                createdAt={p.createdAt}
                currentUserAddress={currentUserAddress}
                isConnected={isConnected}
                onEndorse={onEndorse}
                isActionLoading={isActionLoading}
                actionTarget={actionTarget}
                hasUserEndorsedMap={hasUserEndorsedMap}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

