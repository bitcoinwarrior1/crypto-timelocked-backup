# crypto-timelocked-backup
A tool that allows user to create time bound backups for various cryptocurrencies by creating signed but not sent transactions that lock funds to a particular recipient, accessible at a particular time.

## Getting started
Install the dependencies `$ npm i` and fill in the .env variables `$ cp .env.example .env`. 

The test suite can be run with `$ npm run test`.

## Purpose
The purpose of this tool is to allow you to transfer out some or all of your crypto to a particular address in the event that you lose your keys. This works by creating a signed but not broadcasted transaction that sends out the funds if certain time criteria are met. 

The advantage of this approach is as follows:
- You can recover your funds in the event that you lose access to your keys
- The transactions can be invalidated at anytime by the signer
- You can create as many of these transactions as you like with different parameters 
- The transactions are free to create and you will only pay transaction fees if you use them
- The data is not particularly sensitive and can therefore be saved online

The owner of the funds has the ability to revoke these backups at anytime and in some cases even modify the criteria for the transactions. If the owner loses access to their keys, these backups can still be used to receive the funds when the criteria has been met.

Your recipient could be an individual, organisation or even your exchange address. Exchange deposit addresses are good candidates because they are always accessible via your login, can't get lost and can be obtained by your next of kin via the legal process should you become incapacitated.

## Making sense of the .env file
* `PRIVATE_KEY`: your private key, use this or MNEMONIC
* `MNEMONIC`: your mnemonic phrase, use this or PRIVATE_KEY
* `RECIPIENT_ADDRESS_ETH`: the recipient address for EVM based funds
* `RECIPIENT_ADDRESS_BTC`: the recipient address for bitcoin funds
* `NOT_VALID_BEFORE` :not valid before constraint (UNIX timestamp)
* `NOT_VALID_AFTER` :not valid before (UNIX timestamp)
* `VALID_FOR_ERAS` : number of eras that a mortal dotsama transaction will be valid for
* `VALUE_ETH`: msg.value
* `VALUE_BTC`: bitcoin value in satoshis
* `VALUE_DOT`: value of DOT in 1e12
* `VALUE_KSM`: value of KSM in 1e8
* `TX_NUMBER`: number of transactions to create
* `REGISTRY:` the public EVM based contract address that holds the constraint info for EVM based transaction backups 
* `TOKEN_CONTRACTS`: the erc20/721 tokens to use
* `AMOUNTS_TOKEN_ALLOWANCES`: the allowances to use in erc20/721 (NFT id if using erc721)

*After filling out the necessary `.env` variables, see `package.json` for the scripts you might wish to use, depending on the coin(s) you would like to backup. For example, you can run the bitcoin backup script with `$ npm run backup-bitcoin`.*

## Supported coins

### Bitcoin
We can leverage the `nlocktime` script in Bitcoin to sign over `UTXOs` to a particular address which only become valid once a certain time threshold has been met. You can read more about how this works [here](https://james-sangalli.medium.com/utxo-based-backups-an-idea-for-bitcoin-cold-storage-21f620c35981) and [here](https://github.com/James-Sangalli/crypto-timelocked-backup/blob/master/scripts/bitcoin/README.md).

Here is an example of a BTC backup file: 

``` json 
{
    "backupTx": "020000000115c607883a6759b2638312b6be593319ab32b854c0b9bfa1b21dc704019f5e64000000006a4730440220741a06615d339044d60c0e2dd2bae44cb1634fe848a3bb3f18e4a3df1df3b2f102206ec0626705053288abd49c85ea648a6b8b658f41cf6ac39b6c952ccf89d2a1b3012103dba877025c6fad047f020af73ba264ccb787ea58a8657dc15aa77160fe772dbdfeffffff0170170000000000001976a9144eb26eee4714eece0f257ea52266bac32c88136b88aca905a269",
    "revokeTx": "020000000115c607883a6759b2638312b6be593319ab32b854c0b9bfa1b21dc704019f5e64000000006b483045022100a2281a20fb34d65cf23983475606b05fa911aa54c436b2e691329e2812ab76fb0220274ec3f4dc51bc8f4e13d0818ea9b690250d117433c2d1ca481cfd2041a6d2ed012103dba877025c6fad047f020af73ba264ccb787ea58a8657dc15aa77160fe772dbdffffffff0170170000000000001976a914759c80e0c98a6544f2045a279f7874ae8ebaf82888ac00000000",
    "validFrom": "2026-02-27T20:59:21.000Z",
    "recipient": "18B7TjC4MJEAZ2W1VqnbAeHKhzTLFRLKzM",
    "valueInSats": 6000,
    "recipientPrivateKey": "L1GnNjQEqmvCwAQvSyyHxMQbXytNN8iy9VzFCEMSWduDpD2rzrfC",
    "instructions": "This backup allows you to recover your funds to the recipient address above at and beyond the validFrom date. To recover the funds or revoke this backup you can broadcast the transaction via https://www.blockchain.com/explorer/assets/btc/broadcast-transaction. Note that the revoke transaction can be broadcast at anytime and will invalidate this backup, as will spending any of the inputs included in the transaction."
} 
```

### Ethereum 
Ethereum allows for greater control of what these signed transaction backups should do. In our case, we allow the user to sign a `contract creation transaction` that checks if certain time criteria is met i.e. not valid before and not valid til. We can also retrieve this information from a smart contract which allows the user to change the parameters at anytime. If the criteria set by the parameters is invalid, the transaction execution will revert. You can see how this works by visiting the [contracts](https://github.com/James-Sangalli/crypto-timelocked-backup/tree/master/contracts) directory.

### Polkadot
Polkadot allows us to create what are called `mortal` transactions. This allows you to create transactions that are only valid if they are broadcast before the timestamp has been reached. This means that we can sign but not send a bunch of these transactions and broadcast them before the transaction becomes invalid.

## Contribute
If you would like to contribute to this project, please checkout the [issues](https://github.com/James-Sangalli/crypto-timelocked-backup/issues) section. 

## Discussions
* https://www.reddit.com/r/ethereum/comments/zu2vvy/idea_how_we_could_create_timelocked_transaction/
* https://www.reddit.com/r/ethdev/comments/zu2vci/idea_how_we_could_create_timelocked_transaction/
* https://www.reddit.com/r/ethdev/comments/10cbxsf/using_special_transactions_to_rescue_funds_from/
* https://www.reddit.com/r/ethereum/comments/10cbx5s/using_special_transactions_to_rescue_funds_from/
* https://www.reddit.com/r/Bitcoin/comments/wyt0yk/utxo_based_backups_do_you_think_this_could_be_a/
* https://www.reddit.com/r/cryptodevs/comments/114bbnm/how_to_backup_your_bitcoin_using_time_locked/
* https://www.reddit.com/r/BitcoinTechnology/comments/114bbbx/how_to_backup_your_bitcoin_using_time_locked/
* https://www.reddit.com/r/Bitcoin/comments/114b9ck/how_to_backup_your_bitcoin_using_time_locked/