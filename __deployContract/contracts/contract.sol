// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.9;

contract Register {

    address public manager;
    uint public minimumHalfContribution;
    uint public minimumAllContribution;
    mapping(string => bool) private firstBuyers;
    mapping(string => bool) private secondBuyers;
    

    modifier onlyOwner() {
        require(msg.sender == manager);
        _;
    }

    constructor (address creator, uint minimumHalf, uint minimumAll) {
        manager = creator;
        minimumHalfContribution = minimumHalf;
        minimumAllContribution = minimumAll;
    }

    function registerFirstBuyer(string memory studentNum) public payable {
        require(msg.value > minimumHalfContribution);
        require(!firstBuyers[studentNum] == true);
        firstBuyers[studentNum] = true;
    }

    function registerSecondBuyer(string memory studentNum) public payable {
        require(msg.value > minimumHalfContribution);
        require(!firstBuyers[studentNum] == true);
        require(!secondBuyers[studentNum] == true);
        secondBuyers[studentNum] = true;
    }

    function registerAllBuyer(string memory studentNum) public payable {
        require(msg.value > minimumAllContribution);
        require(!firstBuyers[studentNum] == true);
        require(!secondBuyers[studentNum] == true);
        firstBuyers[studentNum] = true;
        secondBuyers[studentNum] = true;
    }

    function isFirstbuyer(string memory studentNum) public view onlyOwner returns (bool) {
        return firstBuyers[studentNum] ;
    }
    function isSecondbuyer(string memory studentNum) public view onlyOwner returns (bool) {
        return secondBuyers[studentNum] ;
    }   
}