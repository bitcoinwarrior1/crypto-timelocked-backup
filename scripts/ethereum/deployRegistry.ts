import { ethers } from "hardhat";

async function main() {
    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy();
    await registry.deployed();
    console.log(`Registry deployed to ${registry.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});