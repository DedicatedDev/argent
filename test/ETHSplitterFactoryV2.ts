import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { ETHAndTokenSplitter, ETHAndTokenSplitter__factory, ETHSplitterFactory, ETHSplitterFactoryV2, ETHSplitterFactoryV2__factory, ETHSplitterFactory__factory } from "../typechain"

describe("ETHSplitterFactory", async()=>{
    let ETHAndTokenSplitterFactory:ETHAndTokenSplitter__factory
    let ethAndTokenSplitter:ETHAndTokenSplitter
    
    let SplitterFactory:ETHSplitterFactoryV2__factory
    let splitterFactory:ETHSplitterFactoryV2
    let accounts:SignerWithAddress[]
    let myPayees:SignerWithAddress[]

    before(async()=>{
        accounts = await ethers.getSigners()
        myPayees = [
            accounts[3],
            accounts[4],
            accounts[5],
            accounts[6]    
        ]

        //One instance is deployed
        ETHAndTokenSplitterFactory = await ethers.getContractFactory("ETHAndTokenSplitter")
        ethAndTokenSplitter = await ETHAndTokenSplitterFactory.deploy(myPayees.map(item=>item.address));
        await ethAndTokenSplitter.deployed();

        //clone contract from already exist instance
        SplitterFactory = await ethers.getContractFactory("ETHSplitterFactoryV2")
        splitterFactory = await SplitterFactory.deploy(ethAndTokenSplitter.address);
        await splitterFactory.deployed()

    })

    it("should create splitter", async()=>{
        const userPayees = [accounts[4].address, accounts[5].address]
        const tx = await splitterFactory.connect(accounts[1]).createSplitter(userPayees)
        console.log("Gas fee in Factory V2:",tx.gasPrice)
        let createdSplitterAddress = await splitterFactory.splitterForUser(accounts[1].address)
        expect(createdSplitterAddress).to.not.equal("")
    })

    it("should reject recreate Splitter", async()=>{
        let userPayees = [accounts[4].address, accounts[5].address]
        await expect(splitterFactory.connect(accounts[1]).createSplitter(userPayees)).to.revertedWith("ETHsplitterFactory: already created")
    })
})