const chai = require("chai");
const expect = chai.expect;
const RENAERC20 = artifacts.require("WarenaToken");
const RenaStakingRewards = artifacts.require("RenaStakingRewards");
const RewardsDistribution = artifacts.require("RewardsDistribution");


let renawardsDistribution;
let RenaERC20;
let StakingLock;

contract("RenaToken", (accounts) => {
    describe("Deploy Rena Token", function () {
        it("Create Rena Token", async function () {
            creator = accounts[0];
            RenaERC20 = await RENAERC20.new();
            console.log("contract",RenaERC20.address);
        })
    })
})

contract("RewardsDistribution", (accounts) => {
    describe("Deploy Rewards Distribution", function () {
        it("Create Renawards", async function(){
            let authority = accounts[0];
            renawardsDistribution = await RewardsDistribution.new(authority, String(RenaERC20.address), {from: authority});
        })
    })
})

contract("RenaStakingRewards", (accounts) => {
    describe("Deploy Staking With Lock", function () {
        it("Create Staking with Lock", async function() {
            StakingLock = await RenaStakingRewards.new(RenaERC20.address, RenaERC20.address, {from : accounts[0]});
        })
    })
})

contract("ALL", (accounts) => {
    describe("Test all flow Admin", function () {
        it("1.1 Staking with Lock call setRewardDistribution to the distribute contract address", async function() {
            let setRewardDistribution = await StakingLock.setRewardDistribution(String(renawardsDistribution.address), {from: accounts[0]})
        })
        it("1.2 RewardsDistribution call setRewardAdress to the reward ERC20 address", async function() {
            let setRewardAdress = await renawardsDistribution.setRewardAddress(String(RenaERC20.address), {from: accounts[0]})
        })
        it("1.3 Transfer Amount Token To RewardsDistribution", async function() {
            let amount = String(500e18);
            let approve = await RenaERC20.approve(String(accounts[0]),amount, {from : accounts[0]});
            console.log(`approve :: gas used : ${approve.receipt.gasUsed}`);
            let transfer = await RenaERC20.transferFrom(String(accounts[0]),String(renawardsDistribution.address),amount, {from : accounts[0]});
        })
        it("1.4 RewardsDistribution call distributeReward", async function () {
            let amount = String(500e18);
            let distributedReward = renawardsDistribution.distributeReward(String(StakingLock.address), amount, {from: accounts[0]});
        })
    })
    describe("Test flow User", function () {
        it("1.5 approve and stake", async function() {
            let accOne = accounts[0];
            let amount = String(500e18);
            let approve = await RenaERC20.approve(String(StakingLock.address),amount, {from : accOne});
            console.log(`approve :: gas used : ${approve.receipt.gasUsed}`);
            let stake = await StakingLock.stake(amount, {from : accOne});
            expect(String(await RenaERC20.balanceOf(accOne)/10e18)).equal(String(9999900));
        })
        it("1.6 Daily Reward", async function() {
            let accOne = accounts[0];
            let daily = await StakingLock.DailyReward({from : accOne});
            console.log(`Daily Reward:: ${JSON.stringify(daily)}`);
          })
    
          it("1.7 ClaiMable Rewards", async function() {
            let accOne = accounts[0];
            let claiMable_rewards = await StakingLock.earned(String(accOne), {from: accOne});
            console.log(`ClaiMable Rewards:: ${JSON.stringify(claiMable_rewards)}`);
          })
    
          it("1.8 Get Reward", async function() {
            let accOne = accounts[0];
            let reward = await StakingLock.getReward({from : accOne});
            console.log(`reward token: ${JSON.stringify(reward)}`)
          })
    
          it("1.9 Rena Withdraw", async function() {
            let accOne = accounts[0];
            let amount = String(200e18);
            let withdraw = await StakingLock.withdraw(amount, {from : accOne});
            expect(String(await RenaERC20.balanceOf(accOne)/10e18)).equal(String(9999970));
          })
    })
})
