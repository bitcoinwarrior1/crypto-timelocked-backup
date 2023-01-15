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

### Ethereum 
Ethereum allows for greater control of what these signed transaction backups should do. In our case, we allow the user to sign a `contract creation transaction` that checks if certain time criteria is met i.e. not valid before and not valid til. We can also retrieve this information from a smart contract which allows the user to change the parameters at anytime. If the criteria set by the parameters is invalid, the transaction execution will revert. You can see how this works by visiting the [contracts](https://github.com/James-Sangalli/crypto-timelocked-backup/tree/master/contracts) directory.

### Polkadot
Polkadot allows us to create what are called `mortal` transactions. This allows you to create transactions that are only valid if they are broadcast before the timestamp has been reached. This means that we can sign but not send a bunch of these transactions and broadcast them before the transaction becomes invalid.

## Contribute
If you would like to contribute to this project, please checkout the [issues](https://github.com/James-Sangalli/crypto-timelocked-backup/issues) section. 

## Discussions
* https://www.reddit.com/r/ethereum/comments/zu2vvy/idea_how_we_could_create_timelocked_transaction/
* https://www.reddit.com/r/ethdev/comments/zu2vci/idea_how_we_could_create_timelocked_transaction/