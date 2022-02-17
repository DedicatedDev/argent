import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { BigNumber } from "ethers"
import { ethers } from "hardhat"
import { ERC20Mock, ERC20Mock__factory, ERC677Mock, ERC677Mock__factory, ETHAndTokenSplitter, ETHAndTokenSplitter__factory } from "../typechain"

describe("ETHAndTokenSplitter",async()=>{
    let accounts:SignerWithAddress[]
    let myPayees:SignerWithAddress[]
    let ETHAndTokenSplitterFactory:ETHAndTokenSplitter__factory
    let ethAndTokenSplitter:ETHAndTokenSplitter
    let ERC20MockFactory:ERC20Mock__factory
    let erc20Mock:ERC20Mock
    let ERC677MockFactory:ERC677Mock__factory
    let erc677Mock:ERC677Mock


    beforeEach(async()=>{
        accounts = await ethers.getSigners()
        myPayees = [
            accounts[3],
            accounts[4],
            accounts[5],
            accounts[6]    
        ]

        //MockToken Deploy
        ERC20MockFactory = await ethers.getContractFactory("ERC20Mock");
        erc20Mock = await ERC20MockFactory.deploy("AR","AR");
        await erc20Mock.deployed()
        erc20Mock.mint(accounts[0].address,1e8)

        ERC677MockFactory = await ethers.getContractFactory("ERC677Mock");
        erc677Mock = await ERC677MockFactory.deploy(accounts[0].address,1e8,"ARG","ARG");
        await erc677Mock.deployed()
        erc677Mock.mint(accounts[0].address,1e8)

        //Main Contract Deploy
        ETHAndTokenSplitterFactory = await ethers.getContractFactory("ETHAndTokenSplitter")
        ethAndTokenSplitter = await ETHAndTokenSplitterFactory.deploy();
        ethAndTokenSplitter.initialize(myPayees.map(payee=>payee.address),accounts[0].address)
        await ethAndTokenSplitter.deployed();
    })

    it("should be work with ETH", async()=>{
        const amount = ethers.utils.parseEther("2");
        const share = amount.div(myPayees.length);
        const originalBalance = await myPayees[0].getBalance()
        await ethAndTokenSplitter.splitETHAndToken("0x0000000000000000000000000000000000000000", 0, {value:amount})
        for (let index = 0; index < myPayees.length; index++) {
            const currentBalance = await myPayees[index].getBalance();
            expect(currentBalance).to.equal(originalBalance.add(share))
        }
    })

    it("should be work with ERC20 Token", async()=>{
        const amount = BigNumber.from(1e4);
        const share = amount.div(myPayees.length);
        const originalBalance = await erc20Mock.balanceOf(myPayees[0].address);
        erc20Mock.approve(ethAndTokenSplitter.address, 1e10)
        await ethAndTokenSplitter.connect(accounts[0]).splitETHAndToken(erc20Mock.address, amount)
        for (let index = 0; index < myPayees.length; index++) {
            const currentBalance = await erc20Mock.balanceOf( myPayees[index].address);
            expect(currentBalance).to.equal(originalBalance.add(share))
        }
    })


    it("should be work with ERC677 Token", async()=>{
        const amount = BigNumber.from(1e4);
        const share = amount.div(myPayees.length);
        const originalBalance = await erc677Mock.balanceOf(myPayees[0].address);
        erc677Mock.approve(ethAndTokenSplitter.address, 1e10)
        await ethAndTokenSplitter.connect(accounts[0]).splitETHAndToken(erc677Mock.address, amount)
        for (let index = 0; index < myPayees.length; index++) {
            const currentBalance = await erc677Mock.balanceOf( myPayees[index].address);
            expect(currentBalance).to.equal(originalBalance.add(share))
        }
    })

    it("should be work with Custom Token And ETH", async()=>{
        const amount = BigNumber.from(1e4);
        const ethAmount = ethers.utils.parseEther("1");
        const share = amount.div(myPayees.length);
        const shareETH = ethAmount.div(myPayees.length);
        const originalBalance = await erc677Mock.balanceOf(myPayees[0].address);
        const originalETHBalance = await myPayees[0].getBalance();
        erc677Mock.approve(ethAndTokenSplitter.address, 1e10)
        await ethAndTokenSplitter.connect(accounts[0]).splitETHAndToken(erc677Mock.address, amount,{value:ethAmount})
        for (let index = 0; index < myPayees.length; index++) {
            const currentBalance = await erc677Mock.balanceOf( myPayees[index].address);
            const currentETHBalance = await myPayees[index].getBalance();
            expect(currentBalance).to.equal(originalBalance.add(share))
            expect(currentETHBalance).to.equal(originalETHBalance.add(shareETH))
        }
    })
    

})