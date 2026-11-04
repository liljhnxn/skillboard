"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Loader2, AlertCircle } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  currentBio: string;
  onUpdate: (username: string, bio: string) => Promise<void>;
  isLoading: boolean;
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentUsername,
  currentBio,
  onUpdate,
  isLoading,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(currentUsername);
  const [bio, setBio] = useState(currentBio);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setUsername(currentUsername);
    setBio(currentBio);
    setFormError(null);
  }, [currentUsername, currentBio, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedUser = username.trim();
    const trimmedBio = bio.trim();

    if (!trimmedUser) {
      setFormError("Username cannot be empty.");
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
      await onUpdate(trimmedUser, trimmedBio);
      onClose();
    } catch (err: any) {
      // Handled by caller
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-border shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple/15 rounded-full blur-[60px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 p-2 rounded-xl text-text-subtle hover:text-text hover:bg-card transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-text mb-1 flex items-center space-x-2">
          <span>Edit Profile</span>
        </h3>
        <p className="text-xs text-text-muted mb-6">
          Update your public on-chain identity details.
        </p>

        {formError && (
          <div className="flex items-center space-x-2 p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="edit-username" className="text-xs font-semibold text-text uppercase tracking-wider">
                Username <span className="text-neon">*</span>
              </label>
              <span className="text-[11px] font-mono text-text-subtle">
                {username.length}/32
              </span>
            </div>
            <input
              id="edit-username"
              type="text"
              maxLength={32}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-text placeholder-text-subtle focus:outline-none focus:border-purple/80 focus:ring-1 focus:ring-purple/50 text-sm transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="edit-bio" className="text-xs font-semibold text-text uppercase tracking-wider">
                Short Bio
              </label>
              <span className="text-[11px] font-mono text-text-subtle">
                {bio.length}/280
              </span>
            </div>
            <textarea
              id="edit-bio"
              rows={3}
              maxLength={280}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-text placeholder-text-subtle focus:outline-none focus:border-purple/80 focus:ring-1 focus:ring-purple/50 text-sm transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-text-muted hover:text-text bg-card hover:bg-card-hover border border-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-neon to-purple hover:opacity-95 shadow-neon-green transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

