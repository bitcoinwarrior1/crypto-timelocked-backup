// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Registry {

    struct Info {
        uint notValidBefore; // the time required for this transaction to be valid
        uint notValidAfter; // the time after which the transaction is no longer valid
        address payable recipient; // the recipient of msg.value (could be your exchange address or another wallet of yours)
    }

    // user address -> requested backup details
    mapping(address => Info) public userRequest;

    /*
    * @dev allows the user to get and modify what their signed transactions do
    * @dev this contract should be deployed on each network
    * @param userInfo - the user's requested details for their backup transactions
    */
    function set(Info calldata userInfo) public {
        userRequest[msg.sender] = userInfo;
    }
}
