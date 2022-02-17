// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
contract Lottery is Ownable {

    address public winner;
    bool public active = true;
    uint public ethToParticipate = 1;
    uint public minimunCount = 5;
    mapping(address => bool) public isPlayerRegistered;
    address[] public players;

    event BuyTicket(address player);
    event WinnerSelected(address winner);
    function buyTicket() external payable {
        require(msg.value == ethToParticipate * 1 ether, "Lottory: invalid fund");
        require(isPlayerRegistered[msg.sender] == false, "Lottory: already bought the ticket");
        require(active, "Lottory: lottery ended");
        isPlayerRegistered[msg.sender] = true;
        players.push(msg.sender);
        emit BuyTicket(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function draw() public onlyOwner {
        require(active, "Lottory: lottery has ended already");
        require(players.length >= minimunCount, "Lottory: insuficiant players");
        uint index = random() % players.length;
        active = false;
        payable(players[index]).transfer(minimunCount * 1 ether);
        winner = players[index];
        emit WinnerSelected(players[index]);
    }
}