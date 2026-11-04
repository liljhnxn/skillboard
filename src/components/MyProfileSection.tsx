"use client";

import React, { useState } from "react";
import {
  User,
  Edit3,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Award,
  Sparkles,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { CreateProfileCard } from "./CreateProfileCard";
import { EditProfileModal } from "./EditProfileModal";

interface MyProfileSectionProps {
  walletAddress: `0x${string}` | undefined;
  isConnected: boolean;
  hasProfile: boolean;
  username: string;
  bio: string;
  skills: readonly string[];
  skillEndorsements: readonly bigint[];
  createdAt: bigint;
  onCreateProfile: (username: string, bio: string) => Promise<void>;
  onUpdateProfile: (username: string, bio: string) => Promise<void>;
  onAddSkill: (skill: string) => Promise<void>;
  onRemoveSkill: (skill: string) => Promise<void>;
  isActionLoading: boolean;
  actionType: string | null;
}

export function MyProfileSection({
  walletAddress,
  isConnected,
  hasProfile,
  username,
  bio,
  skills,
  skillEndorsements,
  createdAt,
  onCreateProfile,
  onUpdateProfile,
  onAddSkill,
  onRemoveSkill,
  isActionLoading,
  actionType,
}: MyProfileSectionProps) {
  const [newSkill, setNewSkill] = useState("");
  const [skillError, setSkillError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const copyAddress = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSkillError(null);

    const trimmed = newSkill.trim();
    if (!trimmed) {
      setSkillError("Skill name cannot be empty.");
      return;
    }
    if (trimmed.length > 32) {
      setSkillError("Skill name cannot exceed 32 characters.");
      return;
    }
    if (skills.length >= 10) {
      setSkillError("Maximum of 10 skills allowed per profile.");
      return;
    }
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkillError("This skill is already listed on your profile.");
      return;
    }

    try {
      await onAddSkill(trimmed);
      setNewSkill("");
    } catch (err: any) {
      // Handled by parent toast
    }
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
    <section id="my-profile" className="py-12 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-purple/20 flex items-center justify-center text-purple">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">My Profile</h2>
            <p className="text-xs text-text-muted">
              Manage your personal on-chain identity, skills, and endorsements
            </p>
          </div>
        </div>

        {!hasProfile ? (
          <CreateProfileCard
            onSubmit={onCreateProfile}
            isLoading={isActionLoading && actionType === "createProfile"}
          />
        ) : (
          <div className="space-y-8">
            {/* Profile Overview Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-border relative overflow-hidden shadow-glass-card">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-radial from-purple/20 to-transparent blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple via-indigo-600 to-neon/80 p-0.5 shadow-neon-purple flex-shrink-0">
                    <div className="w-full h-full bg-card rounded-2xl flex items-center justify-center">
                      <span className="text-xl sm:text-2xl font-black text-neon glow-text-neon font-mono">
                        {username ? username.substring(0, 2).toUpperCase() : "??"}
                      </span>
                    </div>
                  </div>

                  {/* Identity Info */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-extrabold text-text tracking-tight">
                        {username}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neon/15 text-neon border border-neon/30">
                        Verified Builder
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-text-muted max-w-xl leading-relaxed">
                      {bio || "No biography provided yet."}
                    </p>

                    {/* Wallet & Date info */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-text-subtle">
                      {walletAddress && (
                        <div className="flex items-center space-x-1.5 bg-card/80 px-2.5 py-1 rounded-lg border border-border">
                          <span>
                            {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                          </span>
                          <button
                            onClick={copyAddress}
                            title="Copy Address"
                            className="text-text-subtle hover:text-text transition-colors"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-neon" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <a
                            href={`https://scan.bohr.life/address/${walletAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-subtle hover:text-neon transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}

                      {formattedDate && (
                        <div className="flex items-center space-x-1 bg-card/80 px-2.5 py-1 rounded-lg border border-border">
                          <Calendar className="w-3.5 h-3.5 text-purple" />
                          <span>Joined {formattedDate}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-1 bg-card/80 px-2.5 py-1 rounded-lg border border-border">
                        <Award className="w-3.5 h-3.5 text-neon" />
                        <span className="text-neon font-semibold">{totalEndorsements} Endorsements</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  disabled={isActionLoading}
                  className="self-start px-4 py-2 rounded-xl text-xs font-semibold text-text bg-card hover:bg-card-hover border border-border hover:border-purple/50 transition-all flex items-center space-x-2"
                >
                  <Edit3 className="w-3.5 h-3.5 text-purple" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Skill Management Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-border relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-text flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-neon" />
                    <span>My Skills</span>
                  </h3>
                  <p className="text-xs text-text-muted">
                    Showcase what you specialize in (Max 10 skills)
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-card border border-border text-neon">
                  {skills.length} / 10
                </span>
              </div>

              {/* Add Skill Form */}
              {skills.length < 10 && (
                <form onSubmit={handleAddSkill} className="mb-6">
                  {skillError && (
                    <div className="flex items-center space-x-2 p-3 mb-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{skillError}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      maxLength={32}
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a new skill (e.g. Solidity, Next.js, Rust)..."
                      disabled={isActionLoading && actionType === "addSkill"}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-border text-text placeholder-text-subtle focus:outline-none focus:border-purple/80 text-sm transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isActionLoading || !newSkill.trim()}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs text-black bg-neon hover:bg-[#8ee84f] shadow-neon-green transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isActionLoading && actionType === "addSkill" ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add Skill</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Skills List */}
              {skills.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-2xl bg-card/40 border border-dashed border-border">
                  <p className="text-xs text-text-muted mb-2">
                    You have not added any skills yet.
                  </p>
                  <p className="text-[11px] text-text-subtle">
                    Add your programming languages, frameworks, or tools above to start collecting endorsements.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {skills.map((skillName, index) => {
                    const count = Number(skillEndorsements[index] || 0n);
                    const isDeletingThis =
                      isActionLoading && actionType === `removeSkill_${skillName}`;

                    return (
                      <div
                        key={skillName}
                        className="group flex items-center justify-between p-3 rounded-xl bg-card border border-border hover:border-purple/50 transition-all"
                      >
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          <span className="w-2 h-2 rounded-full bg-neon flex-shrink-0" />
                          <span className="text-xs font-semibold text-text truncate">
                            {skillName}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-purple/15 text-purple border border-purple/30 text-[11px] font-mono font-medium">
                            <Award className="w-3 h-3 text-neon" />
                            <span>{count}</span>
                          </span>

                          <button
                            onClick={() => onRemoveSkill(skillName)}
                            disabled={isActionLoading}
                            title={`Remove ${skillName}`}
                            className="p-1 rounded-lg text-text-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                          >
                            {isDeletingThis ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              currentUsername={username}
              currentBio={bio}
              onUpdate={onUpdateProfile}
              isLoading={isActionLoading && actionType === "updateProfile"}
            />
          </div>
        )}
      </div>
    </section>
  );
}

