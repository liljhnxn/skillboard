import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("----------------------------------------------------");
  console.log("Deploying SkillBoard contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "native tokens");

  const SkillBoard = await ethers.getContractFactory("SkillBoard");
  const skillBoard = await SkillBoard.deploy();
  await skillBoard.waitForDeployment();

  const contractAddress = await skillBoard.getAddress();
  console.log("SkillBoard deployed successfully to:", contractAddress);
  console.log("----------------------------------------------------");

  // Output deployment info to a config file for frontend integration
  const deploymentDir = path.join(process.cwd(), "src", "config");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deploymentInfo = {
    address: contractAddress,
    network: "Botchain Testnet",
    chainId: 968,
    deployedAt: new Date().toISOString(),
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
