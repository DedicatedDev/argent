import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { Lottery, Lottery__factory } from "../typechain"

describe("Lottory", async()=>{
    let LotteryFactory:Lottery__factory
    let lottery:Lottery
    let accounts:SignerWithAddress[]
    let attenders:SignerWithAddress[]
    before(async()=>{
        accounts = await ethers.getSigners()
        attenders = [accounts[1],accounts[2],accounts[3],accounts[4],accounts[5]]
        LotteryFactory = await ethers.getContractFactory("Lottery")
        lottery = await LotteryFactory.deploy()
        await lottery.deployed()
    })

    it("should be selected winner", async()=>{
        for (let index = 0; index < attenders.length; index++) {
            await lottery.connect(attenders[index]).buyTicket({value:ethers.utils.parseEther("1")})
        }
        await lottery.draw()
        const newWinder = await lottery.winner();
        const isContained = attenders.filter(item=>item.address == newWinder)
        expect(isContained.length).to.equal(1)
    })
})