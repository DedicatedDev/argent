// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./ETHSplitter.sol";
contract ETHSplitterFactory {
    mapping(address => address) public splitterForUser; 
    function createSplitter(address[] memory userPayees) external {
        require(splitterForUser[msg.sender] == address(0), "ETHsplitterFactory: already created");
        ETHSplitter newSplitter = new ETHSplitter(userPayees);
        splitterForUser[msg.sender] = address(newSplitter);
    }
}