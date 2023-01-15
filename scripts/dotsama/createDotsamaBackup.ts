import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import "@polkadot/api-augment";
const privateKey = process.env.PRIVATE_KEY;
const seed = process.env.MNEMONIC;
const recipient = process.env.RECIPIENT_ADDRESS_DOT;
const validFor: number = parseInt(process.env.VALID_FOR_ERAS);
const value = process.env.VALUE_DOT
const provider = process.env.DOTSAMA_PROVIDER_URL;
const numberOfTxs = parseInt(process.env.TX_NUMBER) ?? 1000;

async function main() {
    const backups = [];
    const api = await ApiPromise.create({ provider: new WsProvider(provider) });
    let sender;
    if(seed !== "") {
        sender = new Keyring({}).addFromMnemonic(seed);
    } else {
        sender = new Keyring({}).addFromPair({ publicKey: new Uint8Array(privateKey.toBuffer()), secretKey: new Uint8Array(privateKey.toBuffer()) })
    }
    // retrieve sender's next index/nonce, taking txs in the pool into account
    const nonce: number = (await api.rpc.system.accountNextIndex(sender.address)).toNumber();
    for(let i = nonce; i < nonce + numberOfTxs; i++) {
        // send, just retrieving the hash, not waiting on status
        const tx = await api.tx.balances
            .transfer(recipient, value)
            .signAsync(sender, { era: validFor, nonce: i });
        backups.push({ nonce: i, signedTx: tx.toHex() });
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