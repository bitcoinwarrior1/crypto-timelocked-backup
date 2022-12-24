import { ethers } from "hardhat";
const privateKey = process.env.PRIVATE_KEY; // owner of funds
const recipient = process.env.RECIPIENT_ADDRESS; // recipient of the funds (if invoked), this could be your exchange account for example
const notValidBefore = process.env.NOT_VALID_BEFORE; // timestamp specifying when this transaction becomes valid
const notValidAfter = process.env.NOT_VALID_AFTER; // timestamp specifying when this transaction is no longer valid
const value = process.env.VALUE; // the ether amount to send
const numberOfTxs = process.env.TX_NUMBER ?? 1000; // the more we create the more we can broadcast for when the nonce changes

async function main() {
  const backups = [];
  const wallet = new ethers.Wallet(privateKey);
  const TimeLockedBackup = await ethers.getContractFactory("TimeLockedBackup");
  const count = await wallet.getTransactionCount();
  for(let i = count; i < count + numberOfTxs; i++) {
    const tx = TimeLockedBackup.getDeployTransaction(recipient, notValidBefore, notValidAfter, { value: value, nonce: i });
    const signedTx = wallet.signTransaction(tx);
    backups.push(signedTx);
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