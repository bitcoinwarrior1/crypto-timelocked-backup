import { ethers } from "hardhat";
const privateKey = process.env.PRIVATE_KEY;
const seed = process.env.SEED_PHRASE;
const recipient = process.env.RECIPIENT_ADDRESS; // recipient of the funds (if invoked), this could be your exchange account for example
const notValidBefore = process.env.NOT_VALID_BEFORE; // timestamp specifying when this transaction becomes valid
const notValidAfter = process.env.NOT_VALID_AFTER; // timestamp specifying when this transaction is no longer valid
const value = process.env.VALUE; // the ether amount to send
const numberOfTxs = parseInt(process.env.TX_NUMBER) ?? 1000; // the more we create the more we can broadcast for when the nonce changes
const registry = process.env.REGISTRY;

// https://goerli.etherscan.io/tx/0x31d3904d9fc76f6a932567e436d36a0ad452157d3fee66790fbc98aeed564bb5
async function main() {
  const backups = [];
  let wallet;
  if(seed !== "") {
    wallet = new ethers.Wallet(privateKey, ethers.provider);
  } else {
    wallet = new ethers.Wallet(seed, ethers.provider);
  }
  const TimeLockedBackup = await ethers.getContractFactory("TimeLockedBackup");
  const count = await wallet.getTransactionCount();
  const { chainId } = await ethers.provider.getNetwork();
  for(let i = count; i < count + numberOfTxs; i++) {
    const tx = TimeLockedBackup.getDeployTransaction(recipient, notValidBefore, notValidAfter, registry, { value: value, nonce: i, chainId: chainId, gasPrice: 0x174876E800, gasLimit: 0x30D40 });
    const signedTx = await wallet.signTransaction(tx);
    backups.push({ nonce: i, signedTx: signedTx });
  }

  return backups;
}

main().then((backups) => {
  console.log("BACKUPS COMPLETE, PLEASE SAVE THE DATA BELOW:\n");
  console.log(backups);
  process.exit(0);
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});