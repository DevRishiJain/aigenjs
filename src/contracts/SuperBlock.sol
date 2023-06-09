pragma solidity ^0.8.0;

// Types of users
// Requesters
// Providers
// Facilitators

contract SuperBlock{
    address owner;
    uint256 stakingAmount;
    address payable[] public providers;

    constructor() public{
        owner = msg.sender;
        stakingAmount = 100000;
    }

    function joinProvider() public payable{
        require(msg.value > 100000, "You need to stake at least 100,000 to be a provider");
        providers.push(payable(msg.sender));
    }
}