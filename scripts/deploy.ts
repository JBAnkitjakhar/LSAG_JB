// scripts/deploy.ts
import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Deploying VotingRegistration contract...");
  
  // 5 hours in seconds
  const registrationDuration = 240 * 60 * 60; 
  
  const VotingRegistration = await ethers.getContractFactory("VotingRegistration");
  const votingRegistration = await VotingRegistration.deploy(registrationDuration);
  await votingRegistration.waitForDeployment();

  const contractAddress = await votingRegistration.getAddress();
  console.log("VotingRegistration deployed to:", contractAddress);

  // Update constants file with new address and ABI
  const artifactPath = path.join(__dirname, "../src/artifacts/contracts/VotingRegistration.sol/VotingRegistration.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const constantsPath = path.join(__dirname, "../src/constants/index.ts");
  const constantsContent = fs.readFileSync(constantsPath, "utf8");

  let updatedConstants = constantsContent.replace(
    /export const VOTING_CONTRACT_ADDRESS = ".*";/,
    `export const VOTING_CONTRACT_ADDRESS = "${contractAddress}";`
  );

  const abiMatch = updatedConstants.match(/export const VOTING_CONTRACT_ABI = \[[\s\S]*?\];/);
  if (abiMatch) {
    updatedConstants = updatedConstants.replace(
      abiMatch[0],
      `export const VOTING_CONTRACT_ABI = ${JSON.stringify(artifact.abi, null, 2)};`
    );
  } else {
    updatedConstants = updatedConstants.replace(
      /export const VOTING_CONTRACT_ABI = \[\];/,
      `export const VOTING_CONTRACT_ABI = ${JSON.stringify(artifact.abi, null, 2)};`
    );
  }

  fs.writeFileSync(constantsPath, updatedConstants);
  console.log("Contract address and ABI updated in constants file");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });