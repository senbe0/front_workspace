// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.9;

contract Register {

    address payable public manager;
    uint public minimumPrice;
    mapping(string => bool) private Buyers;    

    modifier onlyOwner() {
        require(msg.sender == manager);
        _;
    }

    constructor (address creator, uint price) {
        manager = payable(creator);
        minimumPrice = price;
    }

    function registerBuyer(string memory studentHash) public payable {
        require(msg.value >= minimumPrice);
        require(!Buyers[studentHash] == true);
        Buyers[studentHash] = true;
    }

    function sendAllEtherToManager() public onlyOwner {
        manager.transfer(address(this).balance);
    }

    function isbuyer(string memory studentHash) public view onlyOwner returns (bool) {
        return Buyers[studentHash] ;
    }
}