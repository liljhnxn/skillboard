export interface ProfileData {
  wallet: `0x${string}`;
  username: string;
  bio: string;
  skills: readonly string[];
  skillEndorsements: readonly bigint[];
  createdAt: bigint;
}

export interface SkillItem {
  name: string;
  endorsements: number;
  hasUserEndorsed?: boolean;
}

