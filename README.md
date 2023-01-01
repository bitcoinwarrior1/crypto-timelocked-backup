# crypto-timelocked-backup
A tool that allows user to create time bound backups for various cryptocurrencies

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

## Supported coins

### Bitcoin
We can leverage the `nlocktime` script in Bitcoin to sign over `UTXOs` to a particular address which only become valid once a certain time threshold has been met. You can read more about how this works [here](https://james-sangalli.medium.com/utxo-based-backups-an-idea-for-bitcoin-cold-storage-21f620c35981) and [here](https://github.com/James-Sangalli/crypto-timelocked-backup/blob/master/scripts/bitcoin/README.md).

### Ethereum 
Ethereum allows for greater control of what these signed transaction backups should do. In our case, we allow the user to sign a `contract creation transaction` that checks if certain time criteria is met i.e. not valid before and not valid til. We can also retrieve this information from a smart contract which allows the user to change the parameters at anytime. If the criteria set by the parameters is invalid, the transaction execution will revert. You can see how this works by visiting the [contracts](https://github.com/James-Sangalli/crypto-timelocked-backup/tree/master/contracts) directory. 

### Polkadot
Polkadot allows us to create what are called `mortal` transactions. This allows you to create transactions that are only valid if they are broadcast before the timestamp has been reached. This means that we can sign but not send a bunch of these transactions and broadcast them before the transaction becomes invalid. 

## Contribute
If you would like to contribute to this project, please checkout the [issues](https://github.com/James-Sangalli/crypto-timelocked-backup/issues) section. 