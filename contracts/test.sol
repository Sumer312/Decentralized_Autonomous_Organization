// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "hardhat/console.sol";

contract Test {
    function boolDate(uint date) public view returns (bool) {
        console.log(block.timestamp);
        console.log(date);
        return date > block.timestamp;
    }
}
