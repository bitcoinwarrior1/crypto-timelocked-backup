# crypto-timelocked-backup
A tool that allows user to create time bound backups for various cryptocurrencies

## Getting started
Install the dependencies `$ npm i` and fill in the .env variables `$ cp .env.example .env`. 

The test suite can be run with `$ npm run test`. 

## Purpose
The purpose of this tool is to allow you to transfer out some or all of your crypto to a particular address in the event that you lose your keys.

This works by creating a signed but not broadcasted transactions that send out the funds if certain time criteria are met. 

The advantage of this approach is that you can recover your funds in the event that you lose your keys and the signed transaction does not need to be guarded as the funds can only go to a particular recipient at a particular time. 

Furthermore, the signed transaction can also be invalidated by the signer at any point (by spending the funds or invalidating the criteria).

## More info
To learn more about UTXO based backups, click [here](https://james-sangalli.medium.com/utxo-based-backups-an-idea-for-bitcoin-cold-storage-21f620c35981). 
