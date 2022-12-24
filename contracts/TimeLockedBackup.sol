// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract TimeLockedBackup {
    /*
    * @dev allow the user to sign a transaction with many nonces that allows them to transfer their eth (with a timelock) in the event that they lose access to their keys
    * @dev creates and the destroys the contract
    * @param recipient - the recipient of msg.value (could be your exchange address or another wallet of yours)
    * @param waitTime - the time required for this transaction to be valid
    * @param expiry - the time after which the transaction is no longer valid
    */
    constructor(address payable recipient, uint waitTime, uint expiry) public payable {
        require(block.timestamp >= waitTime, "TimeLockedBackup: not valid yet");
        require(block.timestamp <= expiry, "TimeLockedBackup: expired");
        selfdestruct(recipient);
    }
}
