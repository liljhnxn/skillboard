require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function main() {
  const rpcUrl = process.env.BOTCHAIN_MAINNET_RPC_URL || process.env.BOTCHAIN_RPC_URL || 'https://rpc.botchain.ai';
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const contractAddress = process.env.NEXT_PUBLIC_SKILLBOARD_CONTRACT_ADDRESS || '0x839Ea7614CD798f1Cf31e3397635CD7Ed0b3B4A1';
  const artifactPath = path.join(__dirname, '../artifacts/contracts/SkillBoard.sol/SkillBoard.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const pk1 = process.env.PRIVATE_KEY;
  const pk2 = process.env.PRIVATE_KEY_2;
  const pk3 = process.env.PRIVATE_KEY_3;

  if (!pk1 || !pk2 || !pk3) {
    throw new Error('Please configure PRIVATE_KEY, PRIVATE_KEY_2, and PRIVATE_KEY_3 in .env / .env.local');
  }

  const wallet1 = new ethers.Wallet(pk1, provider);
  const wallet2 = new ethers.Wallet(pk2, provider);
  const wallet3 = new ethers.Wallet(pk3, provider);

  const contract1 = new ethers.Contract(contractAddress, artifact.abi, wallet1);
  const contract2 = new ethers.Contract(contractAddress, artifact.abi, wallet2);
  const contract3 = new ethers.Contract(contractAddress, artifact.abi, wallet3);

  console.log('=== Checking Balances ===');
  const b1 = await provider.getBalance(wallet1.address);
  const b2 = await provider.getBalance(wallet2.address);
  const b3 = await provider.getBalance(wallet3.address);
  console.log(`Wallet 1 (${wallet1.address}): ${ethers.formatEther(b1)} BOT`);
  console.log(`Wallet 2 (${wallet2.address}): ${ethers.formatEther(b2)} BOT`);
  console.log(`Wallet 3 (${wallet3.address}): ${ethers.formatEther(b3)} BOT`);

  const initialProfiles = await contract1.getTotalProfiles();
  console.log(`Initial total profiles: ${initialProfiles.toString()}`);

  const results = [];
  const gasPrice = ethers.parseUnits('20', 'gwei');

  // Interaction 1: Wallet 3 creates profile
  console.log('\n--- Interaction 1 (Wallet 3): createProfile ---');
  const tx1 = await contract3.createProfile(
    'alice_dev',
    'Full-stack Web3 engineer specializing in smart contracts and decentralized protocols.',
    { gasPrice, gasLimit: 400000 }
  );
  console.log(`Tx1 sent: ${tx1.hash}`);
  const receipt1 = await tx1.wait();
  console.log(`Tx1 confirmed in block ${receipt1.blockNumber} (Gas used: ${receipt1.gasUsed.toString()})`);
  results.push({
    interaction: 1,
    action: 'createProfile',
    wallet: wallet3.address,
    txHash: tx1.hash,
    blockNumber: receipt1.blockNumber,
    gasUsed: receipt1.gasUsed.toString(),
    details: 'Created profile: alice_dev'
  });

  // Interaction 2: Wallet 3 adds skill
  console.log('\n--- Interaction 2 (Wallet 3): addSkill ---');
  const tx2 = await contract3.addSkill('Solidity', { gasPrice, gasLimit: 400000 });
  console.log(`Tx2 sent: ${tx2.hash}`);
  const receipt2 = await tx2.wait();
  console.log(`Tx2 confirmed in block ${receipt2.blockNumber} (Gas used: ${receipt2.gasUsed.toString()})`);
  results.push({
    interaction: 2,
    action: 'addSkill',
    wallet: wallet3.address,
    txHash: tx2.hash,
    blockNumber: receipt2.blockNumber,
    gasUsed: receipt2.gasUsed.toString(),
    details: 'Added skill: Solidity'
  });

  // Interaction 3: Wallet 1 endorses skill for Wallet 3
  console.log('\n--- Interaction 3 (Wallet 1): endorseSkill ---');
  const tx3 = await contract1.endorseSkill(wallet3.address, 'Solidity', { gasPrice, gasLimit: 400000 });
  console.log(`Tx3 sent: ${tx3.hash}`);
  const receipt3 = await tx3.wait();
  console.log(`Tx3 confirmed in block ${receipt3.blockNumber} (Gas used: ${receipt3.gasUsed.toString()})`);
  results.push({
    interaction: 3,
    action: 'endorseSkill',
    wallet: wallet1.address,
    txHash: tx3.hash,
    blockNumber: receipt3.blockNumber,
    gasUsed: receipt3.gasUsed.toString(),
    details: `Endorsed alice_dev for Solidity`
  });

  // Interaction 4: Wallet 2 endorses skill for Wallet 3
  console.log('\n--- Interaction 4 (Wallet 2): endorseSkill ---');
  const tx4 = await contract2.endorseSkill(wallet3.address, 'Solidity', { gasPrice, gasLimit: 400000 });
  console.log(`Tx4 sent: ${tx4.hash}`);
  const receipt4 = await tx4.wait();
  console.log(`Tx4 confirmed in block ${receipt4.blockNumber} (Gas used: ${receipt4.gasUsed.toString()})`);
  results.push({
    interaction: 4,
    action: 'endorseSkill',
    wallet: wallet2.address,
    txHash: tx4.hash,
    blockNumber: receipt4.blockNumber,
    gasUsed: receipt4.gasUsed.toString(),
    details: `Endorsed alice_dev for Solidity`
  });

  // Interaction 5: Wallet 2 creates profile
  console.log('\n--- Interaction 5 (Wallet 2): createProfile ---');
  const tx5 = await contract2.createProfile(
    'bob_builder',
    'DevOps & cloud infrastructure architect building on Botchain.',
    { gasPrice, gasLimit: 400000 }
  );
  console.log(`Tx5 sent: ${tx5.hash}`);
  const receipt5 = await tx5.wait();
  console.log(`Tx5 confirmed in block ${receipt5.blockNumber} (Gas used: ${receipt5.gasUsed.toString()})`);
  results.push({
    interaction: 5,
    action: 'createProfile',
    wallet: wallet2.address,
    txHash: tx5.hash,
    blockNumber: receipt5.blockNumber,
    gasUsed: receipt5.gasUsed.toString(),
    details: 'Created profile: bob_builder'
  });

  console.log('\n=== Summary of Interactions ===');
  console.log(JSON.stringify(results, null, 2));

  const totalProfiles = await contract1.getTotalProfiles();
  const endorsementsCount = await contract1.getSkillEndorsements(wallet3.address, 'Solidity');
  console.log('\n=== Final SkillBoard Stats ===');
  console.log(`Total Profiles: ${totalProfiles.toString()}`);
  console.log(`Alice's Solidity Endorsements: ${endorsementsCount.toString()}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
