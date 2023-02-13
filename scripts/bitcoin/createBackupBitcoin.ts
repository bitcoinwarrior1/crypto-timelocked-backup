import { PrivateKey, Transaction } from "bitcore-lib";
const privateKey = process.env.PRIVATE_KEY_BTC; // TODO add mnemonic support
let recipient = process.env.RECIPIENT_ADDRESS_BTC;
const notValidBefore = process.env.NOT_VALID_BEFORE;
import * as bitcore from "bitcore-lib";
import * as request from "superagent";
import UnspentOutput = Transaction.UnspentOutput;

async function main() {
    let key = "The recipient's private key is stored elsewhere";
    const wallet = new bitcore.PrivateKey(privateKey);
    const address = wallet.toAddress().toString();
    const inputs = await getUnspentInputs(address);
    const value = getValue(inputs);
    if(recipient === "") {
        // if the user does not have a recipient, create a new key and add it to the backup
        const privateKey = new bitcore.PrivateKey();
        key = privateKey.toWIF();
        recipient = privateKey.toAddress().toString();
    }
    const tx = new bitcore.Transaction()
        .from(inputs)
        .to(recipient as string, value)
        .lockUntilDate(parseInt(notValidBefore as string))
        .sign(wallet as PrivateKey);
    const revokeTx = new bitcore.Transaction()
        .from(inputs)
        .to(address, value)
        .lockUntilDate(parseInt(notValidBefore as string))
        .sign(wallet as PrivateKey);

    return {
        backupTx: tx.toString(),
        revokeTx: revokeTx.toString(),
        validFrom: new Date(notValidBefore * 1000),
        recipient: recipient,
        recipientPrivateKey: key,
        instructions: "This backup allows you to recover your funds to the recipient address above at and beyond the validFrom date. " +
            "To recover the funds or revoke this backup you can broadcast the transaction via https://www.blockchain.com/explorer/assets/btc/broadcast-transaction. " +
            "Note that the revoke transaction can be broadcast at anytime and will invalidate this backup, as will spending any of the inputs included in the transaction."
    }
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

main().then((backup) => {
    console.log("BACKUP COMPLETE, PLEASE SAVE THE TX DATA BELOW:\n");
    console.log(backup);
    process.exit(0);
}).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});