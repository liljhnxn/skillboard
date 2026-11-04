export const SKILLBOARD_ABI = [
  {
    "inputs": [],
    "name": "AlreadyEndorsed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "BioTooLong",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CannotEndorseSelf",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EmptySkill",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EmptyUsername",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "MaxSkillsReached",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProfileAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProfileDoesNotExist",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SkillAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SkillNotFound",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SkillTooLong",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "UsernameTooLong",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "username", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "bio", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "ProfileCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "username", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "bio", "type": "string" }
    ],
    "name": "ProfileUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "skill", "type": "string" }
    ],
    "name": "SkillAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "endorser", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "skill", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "newCount", "type": "uint256" }
    ],
    "name": "SkillEndorsed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "skill", "type": "string" }
    ],
    "name": "SkillRemoved",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "MAX_BIO_LENGTH",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_SKILLS",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_SKILL_LENGTH",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_USERNAME_LENGTH",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "skill", "type": "string" }],
    "name": "addSkill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "username", "type": "string" },
      { "internalType": "string", "name": "bio", "type": "string" }
    ],
    "name": "createProfile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "string", "name": "skill", "type": "string" }
    ],
    "name": "endorseSkill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllProfiles",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "wallet", "type": "address" },
          { "internalType": "string", "name": "username", "type": "string" },
          { "internalType": "string", "name": "bio", "type": "string" },
          { "internalType": "string[]", "name": "skills", "type": "string[]" },
          { "internalType": "uint256[]", "name": "skillEndorsements", "type": "uint256[]" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" }
        ],
        "internalType": "struct SkillBoard.ProfileView[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getProfile",
    "outputs": [
      { "internalType": "string", "name": "username", "type": "string" },
      { "internalType": "string", "name": "bio", "type": "string" },
      { "internalType": "address", "name": "wallet", "type": "address" },
      { "internalType": "string[]", "name": "skills", "type": "string[]" },
      { "internalType": "uint256[]", "name": "endorsementsCount", "type": "uint256[]" },
      { "internalType": "uint256", "name": "createdAt", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getProfileAddresses",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "string", "name": "skill", "type": "string" }
    ],
    "name": "getSkillEndorsements",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalProfiles",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "endorser", "type": "address" },
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "string", "name": "skill", "type": "string" }
    ],
    "name": "hasEndorsed",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "hasProfile",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "skill", "type": "string" }],
    "name": "removeSkill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "username", "type": "string" },
      { "internalType": "string", "name": "bio", "type": "string" }
    ],
    "name": "updateProfile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

