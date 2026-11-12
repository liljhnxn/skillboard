"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { NetworkBanner } from "@/components/NetworkBanner";
import { MyProfileSection } from "@/components/MyProfileSection";
import { DiscoverSection } from "@/components/DiscoverSection";
import { Footer } from "@/components/Footer";
import { NotificationBanner, NotificationState } from "@/components/NotificationBanner";
import { SKILLBOARD_ADDRESS, SKILLBOARD_ABI } from "@/config/contract";
import { ProfileData } from "@/types";

export default function SkillBoardPage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  // Notification state
  const [notification, setNotification] = useState<NotificationState | null>(null);

  // Track active action for loading indicators
  const [actionLoading, setActionLoading] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);

  // Wagmi Write Hook
  const {
    data: txHash,
    writeContractAsync,
    isPending: isWritePending,
    reset: resetWrite,
  } = useWriteContract();

  // Wait for tx confirmation
  const {
    isLoading: isTxMining,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const isContractConfigured =
    Boolean(SKILLBOARD_ADDRESS) &&
    SKILLBOARD_ADDRESS !== "0x0000000000000000000000000000000000000000";

  // 1. Read all registered profiles
  const {
    data: rawAllProfiles,
    isLoading: isLoadingProfiles,
    refetch: refetchAllProfiles,
  } = useReadContract({
    address: SKILLBOARD_ADDRESS,
    abi: SKILLBOARD_ABI,
    functionName: "getAllProfiles",
    query: {
      enabled: isContractConfigured,
    },
  });

  // 2. Read caller profile
  const {
    data: rawMyProfile,
    isLoading: isLoadingMyProfile,
    refetch: refetchMyProfile,
  } = useReadContract({
    address: SKILLBOARD_ADDRESS,
    abi: SKILLBOARD_ABI,
    functionName: "getProfile",
    args: address ? [address] : undefined,
    query: {
      enabled: isContractConfigured && !!address,
    },
  });

  // 3. Read if caller has a profile
  const {
    data: hasProfileData,
    refetch: refetchHasProfile,
  } = useReadContract({
    address: SKILLBOARD_ADDRESS,
    abi: SKILLBOARD_ABI,
    functionName: "hasProfile",
    args: address ? [address] : undefined,
    query: {
      enabled: isContractConfigured && !!address,
    },
  });

  const hasProfile = Boolean(hasProfileData);

  // Formatted caller profile
  const myProfileData = {
    username: rawMyProfile ? (rawMyProfile as any)[0] || "" : "",
    bio: rawMyProfile ? (rawMyProfile as any)[1] || "" : "",
    wallet: address,
    skills: rawMyProfile ? ((rawMyProfile as any)[3] as readonly string[]) || [] : [],
    skillEndorsements: rawMyProfile ? ((rawMyProfile as any)[4] as readonly bigint[]) || [] : [],
    createdAt: rawMyProfile ? ((rawMyProfile as any)[5] as bigint) || 0n : 0n,
  };

  // Format all profiles list
  const formattedProfiles: ProfileData[] = React.useMemo(() => {
    if (!rawAllProfiles || !Array.isArray(rawAllProfiles)) return [];
    return rawAllProfiles.map((item: any) => ({
      wallet: item.wallet as `0x${string}`,
      username: item.username,
      bio: item.bio,
      skills: item.skills,
      skillEndorsements: item.skillEndorsements,
      createdAt: item.createdAt,
    }));
  }, [rawAllProfiles]);

  // Map to store if current user has endorsed specific skills: `${user}_${skill}` => boolean
  const [hasUserEndorsedMap, setHasUserEndorsedMap] = useState<Record<string, boolean>>({});

  // Check endorsements for all visible skills for connected user
  useEffect(() => {
    if (!address || !publicClient || !isContractConfigured || formattedProfiles.length === 0) {
      setHasUserEndorsedMap({});
      return;
    }

    let isMounted = true;

    async function checkAllEndorsements() {
      const results: Record<string, boolean> = {};

      const checks: Promise<void>[] = [];
      for (const p of formattedProfiles) {
        if (p.wallet.toLowerCase() === address?.toLowerCase()) continue;
        for (const skill of p.skills) {
          checks.push(
            (async () => {
              try {
                const endorsed = await publicClient!.readContract({
                  address: SKILLBOARD_ADDRESS,
                  abi: SKILLBOARD_ABI,
                  functionName: "hasEndorsed",
                  args: [address!, p.wallet, skill],
                });
                const key = `${p.wallet.toLowerCase()}_${skill.toLowerCase()}`;
                results[key] = Boolean(endorsed);
              } catch (e) {
                // ignore
              }
            })()
          );
        }
      }

      await Promise.all(checks);
      if (isMounted) {
        setHasUserEndorsedMap(results);
      }
    }

    checkAllEndorsements();

    return () => {
      isMounted = false;
    };
  }, [address, publicClient, isContractConfigured, formattedProfiles]);

  // Refetch all contract state
  const refreshAllState = useCallback(async () => {
    await Promise.all([
      refetchAllProfiles(),
      refetchMyProfile(),
      refetchHasProfile(),
    ]);
  }, [refetchAllProfiles, refetchMyProfile, refetchHasProfile]);

  // Handle transaction hash generation
  useEffect(() => {
    if (txHash && isTxMining) {
      setNotification({
        type: "loading",
        title: "Transaction Submitted",
        message: "Waiting for Botchain block confirmation...",
        txHash,
      });
    }
  }, [txHash, isTxMining]);

  // Handle transaction success
  useEffect(() => {
    if (isTxSuccess && txHash) {
      setNotification({
        type: "success",
        title: "Transaction Confirmed!",
        message: "Your on-chain action was successfully confirmed on Botchain Testnet.",
        txHash,
      });
      setActionLoading(false);
      setActionType(null);
      refreshAllState();
      resetWrite();
    }
  }, [isTxSuccess, txHash, refreshAllState, resetWrite]);

  // Handle transaction error
  useEffect(() => {
    if (isTxError) {
      setNotification({
        type: "error",
        title: "Transaction Failed",
        message: "The on-chain transaction failed or was reverted by the network.",
        txHash,
      });
      setActionLoading(false);
      setActionType(null);
      resetWrite();
    }
  }, [isTxError, txHash, resetWrite]);

  // Generic handler for contract transactions with error parsing
  const executeContractCall = async (
    actionName: string,
    functionName: any,
    args: any[],
    pendingMsg: string
  ) => {
    if (!isContractConfigured) {
      setNotification({
        type: "error",
        title: "Contract Not Deployed",
        message:
          "The SkillBoard contract address is not configured. Please deploy the contract to Botchain Testnet and set NEXT_PUBLIC_SKILLBOARD_CONTRACT_ADDRESS.",
      });
      return;
    }

    setActionLoading(true);
    setActionType(actionName);
    setNotification({
      type: "loading",
      title: "Confirm in Wallet",
      message: pendingMsg,
    });

    try {
      await writeContractAsync({
        address: SKILLBOARD_ADDRESS,
        abi: SKILLBOARD_ABI,
        functionName: functionName as any,
        args: args as any,
      });
    } catch (err: any) {
      setActionLoading(false);
      setActionType(null);

      // Parse user rejection or contract errors
      let errorMessage = "An error occurred while sending the transaction.";
      if (err.message) {
        if (err.message.includes("User rejected") || err.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected in your wallet.";
        } else if (err.message.includes("CannotEndorseSelf")) {
          errorMessage = "You cannot endorse your own skills.";
        } else if (err.message.includes("AlreadyEndorsed")) {
          errorMessage = "You have already endorsed this skill.";
        } else if (err.message.includes("SkillAlreadyExists")) {
          errorMessage = "This skill already exists on your profile.";
        } else if (err.message.includes("MaxSkillsReached")) {
          errorMessage = "Maximum of 10 skills per profile reached.";
        } else if (err.message.includes("ProfileAlreadyExists")) {
          errorMessage = "A profile is already registered for this wallet.";
        } else {
          errorMessage = err.shortMessage || err.message;
        }
      }

      setNotification({
        type: "error",
        title: "Action Cancelled",
        message: errorMessage,
      });
    }
  };

  // Actions
  const handleCreateProfile = async (username: string, bio: string) => {
    await executeContractCall(
      "createProfile",
      "createProfile",
      [username, bio],
      "Please confirm profile creation in your wallet..."
    );
  };

  const handleUpdateProfile = async (username: string, bio: string) => {
    await executeContractCall(
      "updateProfile",
      "updateProfile",
      [username, bio],
      "Please confirm profile update in your wallet..."
    );
  };

  const handleAddSkill = async (skill: string) => {
    await executeContractCall(
      "addSkill",
      "addSkill",
      [skill],
      `Please confirm adding skill "${skill}" in your wallet...`
    );
  };

  const handleRemoveSkill = async (skill: string) => {
    await executeContractCall(
      `removeSkill_${skill}`,
      "removeSkill",
      [skill],
      `Please confirm removing skill "${skill}" in your wallet...`
    );
  };

  const handleEndorseSkill = async (user: `0x${string}`, skill: string) => {
    await executeContractCall(
      `endorse_${user}_${skill}`,
      "endorseSkill",
      [user, skill],
      `Please confirm endorsement for skill "${skill}" in your wallet...`
    );
  };

  // Smooth scroll helpers
  const scrollToExplore = () => {
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMyProfile = () => {
    document.getElementById("my-profile")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background cyber-grid relative selection:bg-purple/30 selection:text-neon">
      {/* Network Warning Banner */}
      <NetworkBanner />

      {/* Navigation Bar */}
      <Navbar
        onOpenMyProfile={scrollToMyProfile}
        onNavigateExplore={scrollToExplore}
      />

      <main>
        {/* Notice if contract address is not configured yet */}
        {!isContractConfigured && (
          <div className="max-w-5xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-2xl bg-purple/10 border border-purple/30 text-purple-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="font-bold text-neon uppercase tracking-wider block sm:inline mr-2">
                  Ready to Deploy:
                </span>
                Contract address is currently unset. Run{" "}
                <code className="bg-black/40 px-2 py-0.5 rounded text-neon font-mono">
                  npm run deploy:mainnet
                </code>{" "}
                to deploy to Botchain Mainnet, then update{" "}
                <code className="bg-black/40 px-2 py-0.5 rounded text-neon font-mono">
                  NEXT_PUBLIC_SKILLBOARD_CONTRACT_ADDRESS
                </code>
                .
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <Hero
          onExploreClick={scrollToExplore}
          onCreateProfileClick={scrollToMyProfile}
          hasProfile={hasProfile}
          totalBuilders={formattedProfiles.length}
        />

        {/* My Profile Section / Create Profile Form */}
        <MyProfileSection
          walletAddress={address}
          isConnected={isConnected}
          hasProfile={hasProfile}
          username={myProfileData.username}
          bio={myProfileData.bio}
          skills={myProfileData.skills}
          skillEndorsements={myProfileData.skillEndorsements}
          createdAt={myProfileData.createdAt}
          onCreateProfile={handleCreateProfile}
          onUpdateProfile={handleUpdateProfile}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
          isActionLoading={actionLoading || isWritePending || isTxMining}
          actionType={actionType}
        />

        {/* Discover Profiles Grid */}
        <DiscoverSection
          profiles={formattedProfiles}
          currentUserAddress={address}
          isConnected={isConnected}
          isLoading={isLoadingProfiles}
          onEndorse={handleEndorseSkill}
          isActionLoading={actionLoading || isWritePending || isTxMining}
          actionTarget={actionType}
          hasUserEndorsedMap={hasUserEndorsedMap}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Transaction Status Toast / Notification */}
      <NotificationBanner
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}
