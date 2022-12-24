// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract TimeLockedBackup {
    /*
    * @dev allow the user to sign a transaction with many nonces that allows them to transfer their eth (with a timelock) in the event that they lose access to their keys
    * @dev creates and the destroys the contract
    * @param recipient - the recipient of msg.value (could be your exchange address or another wallet of yours)
    * @param notValidBefore - the time required for this transaction to be valid
    * @param notValidAfter - the time after which the transaction is no longer valid
    */
    constructor(address payable recipient, uint notValidBefore, uint notValidAfter) public payable {
        require(block.timestamp >= notValidBefore, "TimeLockedBackup: not valid yet");
        require(block.timestamp <= notValidAfter, "TimeLockedBackup: expired");
        selfdestruct(recipient);
    }
}
