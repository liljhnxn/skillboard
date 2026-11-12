"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Loader2, X, ExternalLink } from "lucide-react";

export interface NotificationState {
  type: "loading" | "success" | "error";
  title: string;
  message: string;
  txHash?: `0x${string}`;
}

interface NotificationBannerProps {
  notification: NotificationState | null;
  onClose: () => void;
}

export function NotificationBanner({
  notification,
  onClose,
}: NotificationBannerProps) {
  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`glass-panel p-4 rounded-2xl border shadow-2xl relative overflow-hidden backdrop-blur-xl ${
          notification.type === "success"
            ? "border-neon/50 bg-[#141421]/95 text-text"
            : notification.type === "error"
            ? "border-red-500/50 bg-[#141421]/95 text-text"
            : "border-purple/50 bg-[#141421]/95 text-text"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg text-text-subtle hover:text-text hover:bg-card transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-3 pr-6">
          <div className="flex-shrink-0 mt-0.5">
            {notification.type === "loading" && (
              <Loader2 className="w-5 h-5 text-purple animate-spin" />
            )}
            {notification.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-neon" />
            )}
            {notification.type === "error" && (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4
              className={`text-sm font-bold ${
                notification.type === "success"
                  ? "text-neon"
                  : notification.type === "error"
                  ? "text-red-400"
                  : "text-purple"
              }`}
            >
              {notification.title}
            </h4>
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed break-words">
              {notification.message}
            </p>

            {notification.txHash && (
              <a
                href={`https://scan.botchain.ai/tx/${notification.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-neon hover:underline font-mono mt-2"
              >
                <span>View on Botchain Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

