"use client";

import React, { useState } from "react";
import {
  Award,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  ThumbsUp,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface ProfileCardProps {
  wallet: `0x${string}`;
  username: string;
  bio: string;
  skills: readonly string[];
  skillEndorsements: readonly bigint[];
  createdAt: bigint;
  currentUserAddress: `0x${string}` | undefined;
  isConnected: boolean;
  onEndorse: (user: `0x${string}`, skill: string) => Promise<void>;
  isActionLoading: boolean;
  actionTarget: string | null;
  hasUserEndorsedMap: Record<string, boolean>; // key: `${user}_${skill}`
}

export function ProfileCard({
  wallet,
  username,
  bio,
  skills,
  skillEndorsements,
  createdAt,
  currentUserAddress,
  isConnected,
  onEndorse,
  isActionLoading,
  actionTarget,
  hasUserEndorsedMap,
}: ProfileCardProps) {
  const [copied, setCopied] = useState(false);

  const isOwnProfile =
    isConnected &&
    currentUserAddress &&
    currentUserAddress.toLowerCase() === wallet.toLowerCase();

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = createdAt > 0n
    ? new Date(Number(createdAt) * 1000).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const totalEndorsements = skillEndorsements.reduce(
    (acc, curr) => acc + Number(curr),
    0
  );

  return (
    <div className="glass-panel rounded-3xl p-6 border border-border hover:border-purple/50 transition-all duration-300 flex flex-col justify-between group hover:shadow-neon-purple relative overflow-hidden">
      {/* Subtle background glow on card hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple/10 rounded-full blur-[50px] group-hover:bg-neon/10 transition-colors pointer-events-none" />

      <div>
        {/* Card Header: Avatar & Info */}
        <div className="flex items-start space-x-3.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple via-indigo-700 to-neon/80 p-0.5 shadow-md flex-shrink-0">
            <div className="w-full h-full bg-card rounded-xl flex items-center justify-center">
              <span className="text-sm font-black text-neon font-mono">
                {username ? username.substring(0, 2).toUpperCase() : "0x"}
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-base font-bold text-text truncate group-hover:text-neon transition-colors">
                {username}
              </h4>
              {isOwnProfile && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple/20 text-purple border border-purple/30 flex-shrink-0">
                  You
                </span>
              )}
            </div>

            {/* Wallet Address & Copy */}
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-xs font-mono text-text-subtle truncate">
                {wallet.substring(0, 6)}...{wallet.substring(wallet.length - 4)}
              </span>
              <button
                onClick={copyAddress}
                title="Copy Address"
                className="text-text-subtle hover:text-text transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-neon" /> : <Copy className="w-3 h-3" />}
              </button>
              <a
                href={`https://scan.bohr.life/address/${wallet}`}
                target="_blank"
                rel="noopener noreferrer"
                title="View on BohrScan"
                className="text-text-subtle hover:text-neon transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-text-muted mb-5 leading-relaxed line-clamp-3 min-h-[3rem]">
          {bio || "No biography provided."}
        </p>

        {/* Skills & Endorsements */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-[11px] font-medium text-text-subtle uppercase tracking-wider mb-2">
            <span>Verified Skills ({skills.length})</span>
            <span className="text-neon font-mono font-bold flex items-center space-x-1">
              <Award className="w-3 h-3" />
              <span>{totalEndorsements} Endorsed</span>
            </span>
          </div>

          {skills.length === 0 ? (
            <div className="py-4 text-center text-xs text-text-subtle bg-card/40 rounded-xl border border-dashed border-border">
              No skills added yet.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {skills.map((skillName, idx) => {
                const count = Number(skillEndorsements[idx] || 0n);
                const endorseKey = `${wallet.toLowerCase()}_${skillName.toLowerCase()}`;
                const alreadyEndorsed = !!hasUserEndorsedMap[endorseKey];
                const isThisLoading =
                  isActionLoading &&
                  actionTarget === `endorse_${wallet}_${skillName}`;

                return (
                  <div
                    key={skillName}
                    className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/80 hover:border-border transition-colors text-xs"
                  >
                    <div className="flex items-center space-x-2 min-w-0 pr-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon flex-shrink-0" />
                      <span className="font-medium text-text truncate">{skillName}</span>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {/* Count Badge */}
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-secondary-bg text-text-muted border border-border text-[11px] font-mono">
                        <Award className="w-3 h-3 text-neon" />
                        <span>{count}</span>
                      </span>

                      {/* Endorse Button */}
                      {isOwnProfile ? (
                        <span className="text-[10px] text-text-subtle italic px-2 py-0.5">
                          Self
                        </span>
                      ) : alreadyEndorsed ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-neon/15 text-neon border border-neon/30 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Endorsed</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onEndorse(wallet, skillName)}
                          disabled={!isConnected || isActionLoading}
                          title={
                            !isConnected
                              ? "Connect wallet to endorse"
                              : `Endorse ${username}'s ${skillName} skill`
                          }
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-black bg-neon hover:bg-[#8ee84f] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                        >
                          {isThisLoading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <ThumbsUp className="w-3 h-3" />
                          )}
                          <span>Endorse</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Timestamp */}
      {formattedDate && (
        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-text-subtle font-mono">
          <span className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-purple" />
            <span>Member since {formattedDate}</span>
          </span>
        </div>
      )}
    </div>
  );
}

