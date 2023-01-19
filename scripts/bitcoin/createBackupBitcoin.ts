import { PrivateKey, Transaction } from "bitcore-lib";
const privateKey = process.env.PRIVATE_KEY_BTC; // TODO add mnemonic support
const recipient = process.env.RECIPIENT_ADDRESS_BTC;
const notValidBefore = process.env.NOT_VALID_BEFORE;
import * as bitcore from "bitcore-lib";
import * as request from "superagent";
import UnspentOutput = Transaction.UnspentOutput;

async function main() {
    const wallet = new bitcore.PrivateKey(privateKey);
    const address = wallet.toAddress().toString();
    const inputs = await getUnspentInputs(address);
    const value = getValue(inputs);
    const tx = new bitcore.Transaction()
        .from(inputs)
        .to(recipient as string, value)
        .lockUntilDate(parseInt(notValidBefore as string))
        .sign(wallet as PrivateKey);

    return tx.toString();
}

function getValue(inputs: UnspentOutput[]) {
    let value = 0;
    // if not set in .env, send max
    if(process.env.VALUE_BTC === "") {
        inputs.map((i) => {
            value += i.satoshis;
        });
    } else {
        value = parseInt(process.env.VALUE_BTC as string);
    }

    return value;
}

async function getUnspentInputs(address: string) {
    const data = await request.get(`https://blockchain.info/unspent?active=${address}`);

    return data.body.unspent_outputs.map((tx: { tx_hash: any; tx_output_n: any; script: any; value: any; }) => {
        return new UnspentOutput({
            "txid" : tx.tx_hash,
            "vout" : tx.tx_output_n,
            "address" : address,
            "scriptPubKey" : tx.script,
            "satoshis" : tx.value
        })
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