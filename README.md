# SkillBoard 🌐⚡

> **Show Your Skills. Build Your Reputation.**  
> A simple, elegant, on-chain talent showcase and skill endorsement dApp running exclusively on **Botchain Testnet**.

SkillBoard is built as an ultra-lightweight Web3 application consisting of **exactly ONE Solidity smart contract** and **ONE single-page application** without any backend, database, tokens, or unnecessary bloat. All profile and endorsement data lives permanently and publicly on the blockchain.

---

## 🌟 Features

- **Permanent On-Chain Identity**: Register a developer profile (username and bio) bound to your wallet.
- **Skill Showcase**: Add up to 10 verified skills per profile with duplicate rejection.
- **Skill Management**: Effortlessly remove skills or edit your profile at any time.
- **Peer Endorsements**: Fellow builders can endorse individual skills with real-time on-chain tallying.
- **Zero Self-Endorsement**: Strict contract-level enforcement preventing self-endorsements and duplicate endorsements.
- **Discovery Grid**: Search, filter, and explore verified builders and talents across the ecosystem.
- **Single-Page Simplicity**: Complete dApp experience in one view with zero route clutter.
- **Cyberpunk / Web3 Aesthetic**: Glassmorphism cards, glowing purple/neon borders, responsive design, and smooth interactions.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Next.js](https://nextjs.org/) (App Router, Single Page) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) with custom neon/purple theme |
| **Smart Contract** | [Solidity](https://soliditylang.org/) `^0.8.20` (`SkillBoard.sol`) |
| **Development Toolchain** | [Hardhat](https://hardhat.org/) & TypeChain |
| **Web3 Client** | [wagmi v2](https://wagmi.sh/) & [viem](https://viem.sh/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🌐 Blockchain Configuration (Botchain Testnet)

- **Network Name**: Botchain Testnet
- **Chain ID**: `968`
- **Native Currency**: Bohr (`BOHR`, 18 decimals)
- **RPC Endpoint**: `https://rpc.bohr.life`
- **Block Explorer**: [https://scan.bohr.life](https://scan.bohr.life)

---

## 📄 Smart Contract: `SkillBoard.sol`

The entire protocol is powered by a single gas-optimized Solidity smart contract located in [`contracts/SkillBoard.sol`](contracts/SkillBoard.sol):

### Core Functions

- `createProfile(string username, string bio)`: Create a unique talent profile (1 per wallet).
- `updateProfile(string username, string bio)`: Update your username and bio.
- `addSkill(string skill)`: Add a skill (max 10, no empty or duplicate strings).
- `removeSkill(string skill)`: Remove a skill from your profile.
- `endorseSkill(address user, string skill)`: Endorse another builder's skill (cannot endorse self or endorse twice).
- `getProfile(address user)`: Fetch profile information, skills, and endorsement tallies.
- `getAllProfiles()`: Fetch all registered profiles with their skills and endorsements for the discovery feed.
- `getSkillEndorsements(address user, string skill)`: Get endorsement count for a specific skill.
- `hasEndorsed(address endorser, address user, string skill)`: Check if an address has endorsed a skill.

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v18+ (tested on Node v20 / v25)
- **npm** or **pnpm**
- **MetaMask** or any injected Web3 browser wallet

### 2. Installation

Clone this repository and install dependencies:

```bash
npm install --legacy-peer-deps
```

### 3. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set the following environment variables:

```env
# Botchain Testnet Configuration
BOTCHAIN_RPC_URL="https://rpc.bohr.life"
NEXT_PUBLIC_BOTCHAIN_RPC_URL="https://rpc.bohr.life"
NEXT_PUBLIC_BOTCHAIN_CHAIN_ID="968"
NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL="https://scan.bohr.life"

# Deployed Contract Address
NEXT_PUBLIC_SKILLBOARD_CONTRACT_ADDRESS="0x..."

# Deployer Private Key for Hardhat (NEVER share or commit!)
PRIVATE_KEY="your_private_key_here"
```

---

## 🧪 Testing the Smart Contract

Run the comprehensive unit test suite covering profile creation, duplicate prevention, skill constraints, limits, and endorsements:

```bash
npm run test
```

Expected output:
```
  SkillBoard Smart Contract
    Profile Creation & Management
      ✓ should allow a user to create a profile
      ✓ should reject empty username
      ✓ should reject username exceeding max length
      ✓ should prevent duplicate profile creation for same wallet
      ✓ should allow a profile owner to update their profile
      ✓ should reject updateProfile if profile does not exist
      ✓ should revert getProfile for non-existent profile
    Skill Management
      ✓ should allow profile owner to add skills
      ✓ should reject adding empty skill
      ✓ should reject duplicate skills for the same profile
      ✓ should enforce maximum of 10 skills per profile
      ✓ should reject skill management for unregistered user
      ✓ should allow profile owner to remove skills
      ✓ should reject removing a non-existent skill
    Endorsements
      ✓ should allow another user to endorse a skill
      ✓ should prevent self-endorsement
      ✓ should prevent endorsing the same skill twice by the same wallet
      ✓ should allow multiple different users to endorse the same skill
      ✓ should revert endorsement if target profile does not have the skill
    Profile Discovery & Views
      ✓ should retrieve all profiles with getAllProfiles

  20 passing
```

---

## 🚀 Deploying to Botchain Testnet

1. Ensure your deployer wallet has BOHR testnet funds.
2. Put the deployer's private key into `.env` as `PRIVATE_KEY`.
3. Run the deployment script:

```bash
npm run deploy:botchain
```

The script will deploy `SkillBoard.sol` and output the contract address.

Copy the outputted address and paste it into `.env.local`:
```env
NEXT_PUBLIC_SKILLBOARD_CONTRACT_ADDRESS="0xYourDeployedAddress"
```

---

## 💻 Running the Web Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 🔒 Security Best Practices

- **Zero Backend / Zero Database**: All state is derived directly from the Botchain blockchain.
- **Private Key Isolation**: The deployer's `PRIVATE_KEY` is strictly used by Hardhat during deployment and is NEVER exposed or referenced in frontend code.
- **Network Guard**: The dApp automatically detects if the connected wallet is on a network other than Botchain Testnet (Chain ID 968) and provides a single-click network switch.

---

## 📄 License

MIT

