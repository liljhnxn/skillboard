"use client";

import React, { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { UserPlus, Sparkles, AlertCircle, Loader2, Wallet } from "lucide-react";

interface CreateProfileCardProps {
  onSubmit: (username: string, bio: string) => Promise<void>;
  isLoading: boolean;
}

export function CreateProfileCard({ onSubmit, isLoading }: CreateProfileCardProps) {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedUser = username.trim();
    const trimmedBio = bio.trim();

    if (!trimmedUser) {
      setFormError("Username is required.");
      return;
    }
    if (trimmedUser.length > 32) {
      setFormError("Username cannot exceed 32 characters.");
      return;
    }
    if (trimmedBio.length > 280) {
      setFormError("Bio cannot exceed 280 characters.");
      return;
    }

    try {
      await onSubmit(trimmedUser, trimmedBio);
      setUsername("");
      setBio("");
    } catch (err: any) {
      // Error handled by parent toast
    }
  };

  const handleConnect = () => {
    const injected = connectors.find((c) => c.id === "injected") || connectors[0];
    if (injected) connect({ connector: injected });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-border relative overflow-hidden shadow-glass-card">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple/20 flex items-center justify-center text-purple">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-text">Create On-Chain Profile</h3>
          <p className="text-xs text-text-muted">
            Establish your identity and talent showcase on the Botchain ledger
          </p>
        </div>
      </div>

      {!isConnected ? (
        <div className="text-center py-10 px-4 bg-card/60 rounded-2xl border border-dashed border-border">
          <div className="w-12 h-12 rounded-full bg-purple/10 text-purple mx-auto flex items-center justify-center mb-3">
            <Wallet className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-text mb-1">Wallet Connection Required</h4>
          <p className="text-xs text-text-muted max-w-sm mx-auto mb-5">
            Connect your MetaMask or Web3 wallet to register your profile and add skills.
          </p>
          <button
            onClick={handleConnect}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-black bg-neon hover:bg-[#8ee84f] shadow-neon-green transition-all"
          >
            Connect Wallet to Continue
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="username" className="text-xs font-semibold text-text uppercase tracking-wider">
                Username <span className="text-neon">*</span>
              </label>
              <span className="text-[11px] font-mono text-text-subtle">
                {username.length}/32
              </span>
            </div>
            <input
              id="username"
              type="text"
              maxLength={32}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. satoshi_nakamoto"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-text placeholder-text-subtle focus:outline-none focus:border-purple/80 focus:ring-1 focus:ring-purple/50 text-sm transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="bio" className="text-xs font-semibold text-text uppercase tracking-wider">
                Short Bio
              </label>
              <span className="text-[11px] font-mono text-text-subtle">
                {bio.length}/280
              </span>
            </div>
            <textarea
              id="bio"
              rows={3}
              maxLength={280}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Briefly describe what you build, your specialties, or what you are looking for..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-text placeholder-text-subtle focus:outline-none focus:border-purple/80 focus:ring-1 focus:ring-purple/50 text-sm transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-neon via-[#90f249] to-purple hover:opacity-95 shadow-neon-green transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirming On-Chain Transaction...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Create Profile</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

