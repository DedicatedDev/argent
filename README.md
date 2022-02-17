# 1

# 2
Firstly after deploying the contract, it will be available for users to enter the lottery.
Whenever users buy tickets, their addresses are saved on contract.
If the expected count of users is entered, then the owner can call the draw function to select a winner.
It's the sequence of the events that must happen on-chain.
Users only can enter while the lottery is active.
No parameters need to put those two functions(buyTicket, and draw).
In order to generate a real random number, we need to generate it on off-chain. But we can't use any external API or oracle for it because of the requirement.
So the remaining thing is to use the keccak256 function with abi.endcodedpack, then the problem is to select parameters to generate a random number.
I think it's enough to use block difficulty, timestamp, players' address list. Miners can manipulate timestamps but others parameters are not.
If we put salt for more randomness but it should be put via the owner of the contract. So this would make it possible owner can select proper input to make a targeted index(player) to be winner, 
then it's not a good solution.
If we rely only on those 3 params and assume the owner would try to manipulate the winner, he/she must let the wanted address participate at proper index and control later participants.
In order words, the owner must control all addresses, it's impossible in general and if possible, the owner doesn't get any profit.
So this approach is possible to predicate but hard to manipulate, I think.
