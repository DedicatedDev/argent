# 1
    Factory can set init user group and owner. 
    after create splitter, ownership assign to owner which is address from factory createSplitter method. 
    Of course it is possible to use Access control for more complex authentication access level. 
    but I've added only simple ownable here. 
# 2
    Firstly after deploying the contract, 
    it will be available for users to enter the lottery.
    Whenever users buy tickets, their addresses are saved on contract.
    If the expected count of users is entered, 
    then the owner can call the draw function to select a winner.
    It's the sequence of the events that must happen on-chain.
    Users only can enter while the lottery is active.
    No parameters need to put those two functions(buyTicket, and draw).
    In order to generate a real random number, we need to generate it on off-chain. 
    But we can't use any external API or oracle for it because of the requirement.
    So the remaining thing is to use the keccak256 function with abi.endcodedpack,
     then the problem is to select parameters to generate a random number.
    I think it's enough to use block difficulty, timestamp, players' address list.
    Miners can manipulate timestamps but others parameters are not.
    If we put salt for more randomness 
    but it should be put via the owner of the contract. 
    So this would make it possible owner can select proper input to make a 
    targeted index(player) to be winner, 
    then it's not a good solution.
    If we rely only on those 3 params and assume the owner would try to manipulate the winner, 
    he/she must let the wanted address participate at proper index and control later participants.
    In order words, the owner must control all addresses, it's impossible in general and if possible, 
    the owner doesn't get any profit.
    So this approach is possible to predicate but hard to manipulate, I think.

# 3
    all calculation is based on doc
    https://docs.aave.com/risk/asset-risk/risk-parameters

    ASSET   Position in tokens          Price       Max     Liquidation     APY
            (positive for collateral    per         LTV     threshold
            negative for debt)          token
    -----------------------------------------------------------------------------
    ETH     100                         2000$        0.8       0.825         2%
    DAI     100 000                     1$           0.75      0.8           10%
    USDC    -150 000                    1$           0.8       0.85          15%

    A. What is the Health Factor for this position?
    Hf = Sum(Collateral in ETH * Liquidation Threshold)/Total Borrow in ETH
    Hf = (100*2000*0.825 + 100,000*0.75*0.8)/(150,000) = 192,000/150,000 = 1.28

    B. At what ETH price will your position be at risk of liquidation?
    Start Point:
    Borrow Amount = possible Lender Amount
    150,000 - 100,000*0.75*0.8 = 90,000
    90,000 = 100 * x * MLTV*LT
    x = 90,000/100*0.8*0.825 = 1363.63$

    C.How many more USDC can you borrow while keeping a Health Factor > 1.2?
    Max 192,000
    Possible: 192,000 / HF = 160,000
    Already Borrowed Amount: 150,000
    thus: 160,000 - 150,000 = 10,000

    D.How many more USDC will the protocol allow you to borrow?
    This is means HF = 1
    so  192,000 - 150,000 = 32,000

    E. Assuming the prices and APY rates stay constant, in approximately how many years will your position be at risk of liquidation?
    Need to solve this expression:
    132,000 * 1.02^x + 6,000 * 1.1^x < 150,000 * 1.15^x
    x = 1   134.64 + 66  > 172.5
    x = 2   137.3328 + 72.6 > 198.375
    x = 3   140.0794 + 79.86 < 228.131
    so after 3 year, my position is in risk of liquidation. 


