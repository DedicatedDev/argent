//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@rsksmart/erc677/contracts/ERC677.sol";
contract ERC677Mock is ERC677  {
    constructor(
    address initialAccount,
    uint256 initialBalance,
    string memory tokenName,
    string memory tokenSymbol
    ) ERC677(initialAccount, initialBalance,tokenName,tokenSymbol) {
        _mint(initialAccount, initialBalance);
    }
    function mint(address receiver, uint256 amount) external {
        _mint(receiver, amount);
    }
}