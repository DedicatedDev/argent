// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "../ether_splitter/ETHSplitter.sol";
import "@rsksmart/erc677/contracts/ERC677.sol";
import "hardhat/console.sol";

contract ETHAndTokenSplitter is ETHSplitter{
    using  EnumerableSet  for EnumerableSet.AddressSet;
    function splitETHAndToken(address tokenAddress, uint256 amount) external payable {
        
        ERC677 token = ERC677(tokenAddress);
        if(msg.value > 0) {
            split();
        }
        if(amount > 0 && tokenAddress != address(0)) {
            token.transferFrom(msg.sender, address(this), amount);
            uint numOfPayee = _payees.values().length;
            uint realAmount = amount * (fee -1) / fee;
            uint share = realAmount / numOfPayee;
            require(share > 0, "ETHAndTokenSplitter: is not enough token amount");
            for (uint256 i = 0; i < numOfPayee; i++) {
                token.transfer(_payees.at(i),share);
            }
        }
    }

    function withdraw(address _token, uint256 amount) external onlyOwner {
        //Ether withdraw
        require(address(this).balance >= amount, "Token Spilter: insufficient balance!");
        (bool sent, bytes memory data) = msg.sender.call{value: amount}("");

        //Custom Token Withdraw
        require(IERC20(_token).balanceOf(address(this)) >= amount, "Token Spilter: insufficient balance!");
            IERC20(_token).transfer(msg.sender, amount);
    }
}