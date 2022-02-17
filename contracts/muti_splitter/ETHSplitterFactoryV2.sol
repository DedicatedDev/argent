// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./ETHAndTokenSplitter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CloneFactory.sol";
contract ETHSplitterFactoryV2 is Ownable, CloneFactory {
    mapping(address => address) public splitterForUser;
    address public impl;
    constructor(address _impl) {
        impl = _impl;
    } 
    function createSplitter(address[] memory userPayees, address instanceOwner) external onlyOwner {
        require(splitterForUser[instanceOwner] == address(0), "ETHsplitterFactory: already created");
        address clone = createClone(impl);
        ETHAndTokenSplitter(clone).initialize(userPayees,instanceOwner); //new ETHAndTokenSplitter(userPayees);
        splitterForUser[instanceOwner] = clone;
    }
}