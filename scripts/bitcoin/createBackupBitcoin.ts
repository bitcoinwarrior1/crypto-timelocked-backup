import { Psbt } from "bitcoinjs-lib/src/psbt";
import * as bip39 from "bip39";
const privateKey = process.env.PRIVATE_KEY;
const seedPhrase = process.env.MNEMONIC;
const recipient = process.env.RECIPIENT_ADDRESS_BTC; // recipient of the funds (if invoked), this could be your exchange account for example
const notValidBefore = process.env.NOT_VALID_BEFORE; // timestamp specifying when this transaction becomes valid
const value = parseInt(process.env.VALUE_BTC as string); // owner of funds
const bip65 = require('bip65');
import BIP32Factory from 'bip32';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { p2sh, p2wpkh } from "bitcoinjs-lib/src/payments";
const ECPair = ECPairFactory(ecc);
const request = require("superagent");
const bip32 = BIP32Factory(ecc);

async function main() {
    let wallet;
    if(seedPhrase !== "") {
        const seed = await bip39.mnemonicToSeed(seedPhrase as string);
        wallet = bip32.fromSeed(seed);
    } else {
        wallet = ECPair.fromPrivateKey(Buffer.from(privateKey as string, "hex"));
    }
    const pubkey = wallet.publicKey;
    const address = p2sh({redeem: p2wpkh({ pubkey })}).address;
    const inputs = await getUnspentInputs(address as string);
    const lockTime = bip65.encode({ utc: parseInt(notValidBefore as string) });
    const tx = new Psbt()
        .addInputs(inputs)
        .addOutput({ address: recipient as string, value: value })
        .setLocktime(lockTime)
        .signAllInputs(wallet);

    return tx.finalizeAllInputs().extractTransaction().toHex();
}

async function getUnspentInputs(address: string) {
    const data = await request.get(`https://blockchain.info/unspent?active=${address}`);

    return data.body.unspent_outputs.map((tx) => {
        return {
            hash: tx.tx_hash,
            index: 1 //tx.tx_index, // TODO check this
        }
    });
}

main().then((tx) => {
    console.log("BACKUPS COMPLETE, PLEASE SAVE THE DATA BELOW:\n");
    console.log(tx);
    process.exit(0);
}).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});