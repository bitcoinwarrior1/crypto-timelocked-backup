import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import "@polkadot/api-augment";
import {ethers} from "hardhat";
const privateKey = process.env.PRIVATE_KEY;
const seed = process.env.SEED_PHRASE;
const recipient = process.env.RECIPIENT_ADDRESS; // recipient of the funds (if invoked), this could be your exchange account for example
const validFor = process.env.VALID_FOR_ERAS; // timestamp specifying when this transaction becomes valid
const value = process.env.VALUE; // the ether amount to send
const numberOfTxs = parseInt(process.env.TX_NUMBER) ?? 1000; // the more we create the more we can broadcast for when the nonce changes

async function main() {
    const backups = [];
    const api = await ApiPromise.create({ provider: new WsProvider("") });
    let sender;
    if(seed !== "") {
        sender = new Keyring({}).addFromMnemonic(seed);
    } else {
        sender = new Keyring({}).addFromPair({ publicKey: new Uint8Array(privateKey.toBuffer()), secretKey: new Uint8Array(privateKey.toBuffer()) })
    }
    // retrieve sender's next index/nonce, taking txs in the pool into account
    const nonce = await api.rpc.system.accountNextIndex(sender.address);
    for(let i = nonce; i < nonce + numberOfTxs; i++) {
        // send, just retrieving the hash, not waiting on status
        const tx = await api.tx.balances
            .transfer(recipient, value)
            .signAsync(sender, { era: validFor, nonce: i });
            // .sign(sender, {blockHash: undefined, genesisHash: undefined, nonce: i, runtimeVersion: undefined})
        backups.push(tx);
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