# eth-timelocked-backup
A tool that allows user to create time bound backups for their ether. 

## Getting started
Install the dependencies `$ npm i` and fill in the .env variables `$ cp .env.example .env`. 

To run the program and generate backups, simply run `$ npm run backup`.

The test suite can be run with `$ npm run test`. 

## Purpose
The purpose of this tool is to allow you to transfer out some or all of your ether to a particular address in the event that you lose your crypto.

This works by creating a signed but not broadcasted transaction that deploys a contract and sends out the funds if certain time criteria are met. 

The advantage of this approach is that you can recover your funds in the event that you lose your keys and the signed transaction does not need to be guarded as the funds can only go to a particular recipient at a particular time. 

Furthermore, the signed transaction can also be invalidated by the signer at any point (by spending the funds or reaching the expiry date set).

## How this could be done with UTXO based cryptos
Read up about the concept [here](https://james-sangalli.medium.com/utxo-based-backups-an-idea-for-bitcoin-cold-storage-21f620c35981) & [here](https://github.com/James-Sangalli/UTXO-backup-service).