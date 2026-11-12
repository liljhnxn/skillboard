import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const isMainnet = chainId === 677;

  console.log("----------------------------------------------------");
  console.log(`Deploying SkillBoard to ${isMainnet ? "Botchain Mainnet" : "Botchain Testnet"} (Chain ID: ${chainId})...`);

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), isMainnet ? "BOT" : "native tokens");

  // Fetch optimal gas price from network
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice ?? 20000000000n; // fallback to 20 gwei if null
  console.log("Current network gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");

  const SkillBoard = await ethers.getContractFactory("SkillBoard");

  // Estimate deployment gas
  const deployTx = await SkillBoard.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deployTx);
  const estimatedCost = estimatedGas * gasPrice;
  console.log("Estimated deployment gas:", estimatedGas.toString());
  console.log("Estimated deployment fee:", ethers.formatEther(estimatedCost), isMainnet ? "BOT" : "tokens");

  // Deploy with minimal optimal gas price (avoiding overpayment)
  const skillBoard = await SkillBoard.deploy({
    gasPrice: gasPrice,
  });
  await skillBoard.waitForDeployment();

  const contractAddress = await skillBoard.getAddress();
  const deployReceipt = await skillBoard.deploymentTransaction()?.wait();
  const actualGasUsed = deployReceipt?.gasUsed ?? 0n;
  const actualFee = actualGasUsed * (deployReceipt?.gasPrice ?? gasPrice);

  console.log("SkillBoard deployed successfully to:", contractAddress);
  console.log("Actual gas used:", actualGasUsed.toString());
  console.log("Actual fee spent:", ethers.formatEther(actualFee), isMainnet ? "BOT" : "tokens");
  console.log("----------------------------------------------------");

  // Output deployment info to a config file for frontend integration
  const deploymentDir = path.join(process.cwd(), "src", "config");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const explorerBase = isMainnet ? "https://scan.botchain.ai" : "https://scan.bohr.life";
  const deploymentInfo = {
    address: contractAddress,
    network: isMainnet ? "Botchain Mainnet" : "Botchain Testnet",
    chainId: chainId,
    deployedAt: new Date().toISOString(),
    explorer: `${explorerBase}/address/${contractAddress}`,
    gasUsed: actualGasUsed.toString(),
    feeSpent: ethers.formatEther(actualFee),
  };

  fs.writeFileSync(
    path.join(deploymentDir, "deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Saved deployment info to src/config/deployment.json");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
