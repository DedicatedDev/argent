// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "../ether_splitter/ETHSplitter.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@rsksmart/erc677/contracts/ERC677.sol";
contract ETHAndTokenSplitter is ETHSplitter {
    using  EnumerableSet  for EnumerableSet.AddressSet;
    constructor (address[] memory payees) ETHSplitter(payees) {
    }
    
    function init(address[] memory payees) public {
        for (uint256 i = 0; i < payees.length; i++) {
            _payees.add(payees[i]);
        }
    }

    function splitETHAndToken(address tokenAddress, uint256 amount) external payable {
        ERC677 token = ERC677(tokenAddress);
        if(msg.value > 0) {
            split();
        }
        if(amount > 0 && tokenAddress != address(0)) {
            token.transferFrom(msg.sender, address(this), amount);
            uint numOfPayee = _payees.values().length;
            uint share = amount / numOfPayee;
            require(share > 0, "ETHAndTokenSplitter: is not enough token amount");
            for (uint256 i = 0; i < numOfPayee; i++) {
                token.transfer(_payees.at(i),share);
            }
        }
    } 
    
}