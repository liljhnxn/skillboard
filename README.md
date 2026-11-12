# SkillBoard 🌐⚡

> **Show Your Skills. Build Your Reputation.**  
> A simple, elegant, on-chain talent showcase and skill endorsement dApp running on **BOT Chain**.

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

## 🌐 Blockchain Configuration (BOT Chain)

- **Network Name**: BOT Chain
- **Chain ID**: `677`
- **Native Currency**: BOT (`BOT`, 18 decimals)
- **RPC Endpoint**: `https://rpc.botchain.ai`
- **BOT Chain Website**: [https://botchain.ai](https://botchain.ai)
- **BOT Chain Explorer**: [https://scan.botchain.ai](https://scan.botchain.ai)
- **Verified Contract**: [`0x839Ea7614CD798f1Cf31e3397635CD7Ed0b3B4A1`](https://scan.botchain.ai/address/0x839Ea7614CD798f1Cf31e3397635CD7Ed0b3B4A1#code)

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
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set the following environment variables:

```env
# BOT Chain Configuration
BOTCHAIN_RPC_URL="https://rpc.botchain.ai"
BOTCHAIN_MAINNET_RPC_URL="https://rpc.botchain.ai"
NEXT_PUBLIC_BOTCHAIN_RPC_URL="https://rpc.botchain.ai"
NEXT_PUBLIC_BOTCHAIN_CHAIN_ID="677"
NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL="https://scan.botchain.ai"

# Deployed Contract Address
NEXT_PUBLIC_SKILLBOARD_CONTRACT_ADDRESS="0x839Ea7614CD798f1Cf31e3397635CD7Ed0b3B4A1"

# Deployer Private Key for Hardhat (NEVER share or commit!)
PRIVATE_KEY="your_private_key_here"
```

---

## 🧪 Testing the Smart Contract

Run the comprehensive unit test suite covering profile creation, duplicate prevention, skill constraints, limits, and endorsements:

```bash
npm run test
```

---

## 🚀 Deploying to BOT Chain

```bash
npm run deploy:mainnet
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

- **Zero Backend / Zero Database**: All state is derived directly from the BOT Chain blockchain.
- **Private Key Isolation**: The deployer's `PRIVATE_KEY` is strictly used by Hardhat during deployment and is NEVER exposed or referenced in frontend code.
- **Network Guard**: The dApp automatically detects if the connected wallet is on a network other than BOT Chain (Chain ID 677) and provides a single-click network switch.

---

## 🔗 Official Links

- **BOT Chain Website**: [https://botchain.ai](https://botchain.ai)
- **BOT Chain Explorer**: [https://scan.botchain.ai](https://scan.botchain.ai)
- **SkillBoard Contract**: [`0x839Ea7614CD798f1Cf31e3397635CD7Ed0b3B4A1`](https://scan.botchain.ai/address/0x839Ea7614CD798f1Cf31e3397635CD7Ed0b3B4A1#code)

---

## 📄 License

MIT
