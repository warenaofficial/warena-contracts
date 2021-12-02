const chai = require("chai");
const rp = require('request-promise');
const axios = require('axios');
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

      it("Notification Reward", async function() {
            let accOne = accounts[0];
            let amount = String(500e18);
            let notificationReward = await StakingLock.notifyRewardAmount(amount, {from: accOne});
      })

      it("Total Stake", async function() {
        let accOne = accounts[0];
        let total = await StakingLock.totalSupply();
        console.log(`Total Stake:: ${JSON.stringify(total)}`);
      })

      it("Total Stake User", async function() {
        let accOne = accounts[0];
        let total = await StakingLock.balanceOf(String(accOne));
        console.log(`Total Stake User:: ${JSON.stringify(total)}`);
      })


      it("Get Price and Circulating supply", async function() {
          const t = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=RENA', {
            headers: {
                'Content-Type': 'application/json',
                "X-CMC_PRO_API_KEY": "c48434bd-d72e-4f5b-80cd-054aee406592"
            },      
        }).then(resp => {
            console.log(`Circulating Supply ::${JSON.stringify(resp.data.data.RENA.circulating_supply)}`);
            let renaCoin = JSON.stringify(resp.data.data.RENA.quote.USD.price);
            console.log('Rena Price:'+renaCoin)
          });
      })

      it("Rena get reward", async function() {
        let accOne = accounts[0];
        let amount = String(500e18);
        let approve = await DaiERC20.approve(String(accOne),amount, {from : accOne});
        console.log(`approve :: gas used : ${approve.receipt.gasUsed}`);
        expect(String(await DaiERC20.balanceOf(accOne)/10e18)).equal(String(10000000));
        let transfer = await DaiERC20.transferFrom(String(accOne),String(StakingLock.address),amount, {from : accOne});
        expect(String(await DaiERC20.balanceOf(accOne)/10e18)).equal(String(9999950));
        console.log(`transfer :: gas used : ${transfer.receipt.gasUsed}`);
      })

      it("Daily Reward", async function() {
        let accOne = accounts[0];
        let daily = await StakingLock.DailyReward({from : accOne});
        console.log(`Daily Reward:: ${JSON.stringify(daily)}`);
      })

      it("ClaiMable Rewards", async function() {
        let accOne = accounts[0];
        let claiMable_rewards = await StakingLock.earned(String(accOne), {from: accOne});
        console.log(`ClaiMable Rewards:: ${JSON.stringify(claiMable_rewards)}`);
      })

      it("Get Reward", async function() {
        let accOne = accounts[0];
        let reward = await StakingLock.getReward({from : accOne});
        console.log(`reward token: ${JSON.stringify(reward)}`)
      })

      it("Rena Withdraw", async function() {
        let accOne = accounts[0];
        let amount = String(200e18);
        let withdraw = await StakingLock.withdraw(amount, {from : accOne});
        expect(String(await RenaERC20.balanceOf(accOne)/10e18)).equal(String(9999970));
      })



  });
})