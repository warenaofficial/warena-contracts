const chai = require("chai");
const expect = chai.expect;
const RENAERC20 = artifacts.require("WarenaToken");
const DAIERC20 = artifacts.require("DaiToken");
const RenaStakingRewards = artifacts.require("RenaStakingRewards");


let RenaERC20;
let DaiERC20;
let creator;
let StakingLock;

contract("RENAERC20", (accounts) => {
  describe("Deploy Rena", function () {
      it("Create Rena Smart Contract", async function() {
          creator = accounts[0];
          RenaERC20 = await RENAERC20.new();
          console.log("contract",RenaERC20.address);
      })
    })
})

contract("DAIERC20", (accounts) => {
  describe("Deploy Dai", function () {
    it("Create Dai Smart Contract", async function() {
      creator = accounts[0];
      DaiERC20 = await DAIERC20.new();
      console.log("contract",DaiERC20.address);
    })
  })
})

contract("RenaStakingRewards", (accounts) => {
  describe("Deploy Staking With Lock", function () {
      it("Create Rena Staking Rewards and stake smart contract", async function() {
          let accOne = accounts[0];
          let amount = String(500e18);
          StakingLock = await RenaStakingRewards.new(DaiERC20.address, RenaERC20.address, {from : accOne});
          let approve = await RenaERC20.approve(String(StakingLock.address),amount, {from : accOne});
          console.log(`approve :: gas used : ${approve.receipt.gasUsed}`);
          let stake = await StakingLock.stake(amount, {from : accOne});
          expect(String(await RenaERC20.balanceOf(accOne)/10e18)).equal(String(9999950));
      })

      it("Rena get reward", async function() {
        let accOne = accounts[0];
        let amount = String(500e18);
        let approve = await DaiERC20.approve(String(accOne),amount, {from : accOne});
        console.log(`approve :: gas used : ${approve.receipt.gasUsed}`);
        expect(String(await DaiERC20.balanceOf(accOne)/10e18)).equal(String(10000000));
        let transfer = await DaiERC20.transferFrom(String(accOne),String(StakingLock.address),amount, {from : accOne});
        expect(String(await RenaERC20.balanceOf(accOne)/10e18)).equal(String(9999950));
        console.log(`transfer :: gas used : ${transfer.receipt.gasUsed}`);
        let reward = await StakingLock.getReward({from : accOne});
      })

      it("Rena Withdraw", async function() {
        let accOne = accounts[0];
        let amount = String(200e18);
        let withdraw = await StakingLock.withdraw(amount, {from : accOne});
        expect(String(await RenaERC20.balanceOf(accOne)/10e18)).equal(String(9999970));
      })

    
  });
})