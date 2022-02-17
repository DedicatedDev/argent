import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { ETHSplitterFactory, ETHSplitterFactory__factory } from "../typechain"

describe("ETHSplitterFactory", async()=>{
    let SplitterFactory:ETHSplitterFactory__factory
    let splitterFactory:ETHSplitterFactory
    let accounts:SignerWithAddress[]

    before(async()=>{
        accounts = await ethers.getSigners()
        SplitterFactory = await ethers.getContractFactory("ETHSplitterFactory")
        splitterFactory = await SplitterFactory.deploy();
        await splitterFactory.deployed()
    })

    it("should create ETHSplitter", async()=>{
        const userPayees = [accounts[4].address, accounts[5].address]
        const tx = await splitterFactory.connect(accounts[1]).createSplitter(userPayees)
        console.log("Gas fee in Factory V1:",tx.gasPrice)
        const createdSplitterAddress = await splitterFactory.splitterForUser(accounts[1].address)
        expect(createdSplitterAddress).to.not.equal("")
    })

    it("should reject recreate ETHSplitter", async()=>{
        let userPayees = [accounts[4].address, accounts[5].address]
        await expect(splitterFactory.connect(accounts[1]).createSplitter(userPayees)).to.revertedWith("ETHsplitterFactory: already created")
    })
})