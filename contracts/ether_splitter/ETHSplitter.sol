// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract ETHSplitter is OwnableUpgradeable {
    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet internal _payees;
    function initialize(address[] memory payees, address _owner) public initializer {
        __Ownable_init();
        transferOwnership(_owner);
        for (uint256 i = 0; i < payees.length; i++) {
            _payees.add(payees[i]);
        }
    }
    function addPayee(address newPayee) public onlyOwner {
        require(newPayee != address(0),"ETHSplitter: invalid address");
        _payees.add(newPayee);
    }

    function removePayees(address payee) external onlyOwner {
        require(payee != address(0),"ETHsplitter: invalid address");
        _payees.remove(payee);
    }

    function getMyPayees() external view returns(address[] memory myPayee){
        myPayee = _payees.values();
    }

    function split() public payable  {
        require(payable(msg.sender) != address(0),"ETHsplitter: invalid address");
        uint numOfPayee = _payees.values().length;
        uint share = msg.value / numOfPayee;
        require(share > 0, "ETHsplitter: invalid amount");
        for (uint256 i = 0; i < numOfPayee; i++) {
            (bool sent, ) = payable(_payees.at(i)).call{value:share}("");
            require(sent, "ETHsplitter: Failed to send Ether");
        }
    }    
}