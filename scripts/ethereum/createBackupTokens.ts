import { ethers } from "hardhat";
const privateKey = process.env.PRIVATE_KEY;
const seed = process.env.MNEMONIC;
const recipient = process.env.RECIPIENT_ADDRESS; // recipient of the funds (if invoked), this could be your exchange account for example
const numberOfTxs = parseInt(process.env.TX_NUMBER) ?? 1000; // the more we create the more we can broadcast for when the nonce changes
const contracts = process.env.TOKEN_CONTRACTS.split(",");
const amounts = process.env.AMOUNTS_TOKEN_ALLOWANCES.split(","); // this will be a tokenID if 721 else an allowance amount

// https://goerli.etherscan.io/tx/0x1ec396328cc3d57bccd81709427e6dd4921742f204b589dadb42e0a6cde7be65
async function main() {
  const backups = [];
  let wallet;
  if (seed !== "") {
    wallet = new ethers.Wallet(privateKey, ethers.provider);
  } else {
    wallet = ethers.Wallet.fromMnemonic(seed);
  }
  const count = await wallet.getTransactionCount();
  const { chainId } = await ethers.provider.getNetwork();
  for (let i = 0; i < contracts.length; i++) {
    for (let j = count; j < count + numberOfTxs; j++) {
      const tx = {
        to: contracts[i],
        nonce: j,
        chainId: chainId,
        gasPrice: 0x174876e800,
        gasLimit: 0x30d40,
        data: `0x095ea7b3000000000000000000000000${recipient.replace(
          "0x",
          ""
        )}${amounts[i]}`,
      };
      const signedTx = await wallet.signTransaction(tx);
      backups.push({ nonce: j, signedTx: signedTx });
    }
  }

  return backups;
}

main()
  .then((backups) => {
    console.log("BACKUPS COMPLETE, PLEASE SAVE THE DATA BELOW:\n");
    console.log(backups);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
