import { ethers } from "hardhat";

async function main() {
  const ERC20Pool = await ethers.getContractFactory("TimeLockedBackup");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
