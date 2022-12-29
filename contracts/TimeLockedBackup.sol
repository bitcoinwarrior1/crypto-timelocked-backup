// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Registry.sol";

contract TimeLockedBackup {
    /*
    * @dev allow the user to sign a transaction with many nonces that allows them to transfer their eth (with a timelock) in the event that they lose access to their keys
    * @dev creates and the destroys the contract
    * @param _registry - the registry contract that stores the user's requested info
    */
    constructor(Registry _registry) public payable {
        (uint notValidBefore, uint notValidAfter, address payable recipient) = _registry.userRequest(msg.sender);
        require(recipient != address(0), "TimeLockedBackup: recipient not set");
        require(block.timestamp >= notValidBefore, "TimeLockedBackup: not valid yet");
        require(block.timestamp <= notValidAfter, "TimeLockedBackup: expired");
        selfdestruct(recipient);
    }
}
