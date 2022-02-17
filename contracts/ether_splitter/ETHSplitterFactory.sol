// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./ETHSplitter.sol";
contract ETHSplitterFactory is Ownable {
    mapping(address => address) public splitterForUser;
    function createSplitter(address[] memory userPayees, address instanceOwner) external onlyOwner {
        require(splitterForUser[instanceOwner] == address(0), "ETHsplitterFactory: already created");
        ETHSplitter newSplitter = new ETHSplitter();
        newSplitter.initialize(userPayees,instanceOwner);
        splitterForUser[instanceOwner] = address(newSplitter);
    }
}