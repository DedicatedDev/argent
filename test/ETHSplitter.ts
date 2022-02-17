import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { ETHSplitter, ETHSplitter__factory } from "../typechain"

describe("ETHSplitter", async()=>{
    let ETHSplitter:ETHSplitter__factory;
    let ethSplitter:ETHSplitter;
    let accounts:SignerWithAddress[];
    let myPayees:Set<SignerWithAddress> = new Set<SignerWithAddress>();
    before(async()=>{
        accounts = await ethers.getSigners();
        ETHSplitter = await ethers.getContractFactory("ETHSplitter");
        //Add initial payees when contract is deployed
        ethSplitter = await ETHSplitter.deploy();
        await ethSplitter.initialize([],accounts[0].address)
        await ethSplitter.deployed();
    })

    it("should be added new payees", async()=>{
        await ethSplitter.addPayee(accounts[2].address);
        myPayees.add(accounts[2])
        await ethSplitter.addPayee(accounts[3].address);
        myPayees.add(accounts[3])
        await ethSplitter.addPayee(accounts[4].address);
        myPayees.add(accounts[4])
        
        const myPayeesFromContract = await ethSplitter.getMyPayees();
        expect(myPayeesFromContract.length).to.equal(myPayees.size);
    })

    it("should not be increased about same address",async()=>{
        await ethSplitter.addPayee(accounts[2].address);
        const myPayeesFromContract = await ethSplitter.getMyPayees();
        expect(myPayeesFromContract.length).to.equal(myPayees.size);
    })

    it("should delete selected address",async()=>{
        await ethSplitter.removePayees(accounts[2].address);
        myPayees.delete(accounts[2]);
        const myPayeesFromContract = await ethSplitter.getMyPayees();
        expect(myPayeesFromContract.length).to.equal(myPayees.size);
    })

    it("should not decrease when delete none-existed address",async()=>{
        await ethSplitter.removePayees(accounts[10].address);
        const myPayeesFromContract = await ethSplitter.getMyPayees();
        expect(myPayeesFromContract.length).to.equal(myPayees.size);
    })

    it("should split  amount to payees", async()=>{
        const amount = ethers.utils.parseEther("2");
        const originalBalance:BigNumber[] = [];
        const addedAccounts:SignerWithAddress[] = [];
        myPayees.forEach(async(payee) => {
            addedAccounts.push(payee)
            originalBalance.push(await payee.getBalance())
        })
        await ethSplitter.connect(accounts[0]).split({value:amount})
        const share = amount.div(myPayees.size)
        for (let index = 0; index < addedAccounts.length; index++) {
            const currentValue = await addedAccounts[index].getBalance();
            expect(currentValue).to.equal(originalBalance[index].add(share));
        }
    })
})