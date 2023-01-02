import { ethers } from "hardhat";
const privateKey = process.env.PRIVATE_KEY; // owner of funds
const recipient = process.env.RECIPIENT_ADDRESS; // recipient of the funds (if invoked), this could be your exchange account for example
const numberOfTxs = parseInt(process.env.TX_NUMBER) ?? 1000; // the more we create the more we can broadcast for when the nonce changes
const contracts = process.env.CONTRACTS.split(",");
const amounts = process.env.AMOUNTS.split(","); // this will be a tokenID if 721 else an allowance amount

// https://goerli.etherscan.io/tx/0x1ec396328cc3d57bccd81709427e6dd4921742f204b589dadb42e0a6cde7be65
async function main() {
    const backups = [];
    const wallet = new ethers.Wallet(privateKey, ethers.provider);
    const count = await wallet.getTransactionCount();
    const { chainId } = await ethers.provider.getNetwork();
    for(let i = 0; i < contracts.length; i++) {
        for(let j = count; j < count + numberOfTxs; j++) {
            const tx = {
                to: contracts[i],
                nonce: j,
                chainId: chainId,
                gasPrice: 0x174876E800,
                gasLimit: 0x30D40,
                data: `0x095ea7b3000000000000000000000000${recipient.replace("0x", "")}${amounts[i]}`
            }
            const signedTx = await wallet.signTransaction(tx);
            backups.push({ nonce: j, signedTx: signedTx });
        }
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