const hre = require('hardhat');

const RENA_ADDRESS = "0x7bC299AD2ABB57D2bDAc08f80A2909f3a2bBB20D"
async function main() {

    const accounts = await web3.eth.getAccounts();
    const admin = accounts[0];

    const RewardsDistribution = await hre.ethers.getContractFactory('RewardsDistribution');
    const rewardsDistribution = await RewardsDistribution.deploy(admin, RENA_ADDRESS);
    await rewardsDistribution.deployed();
    console.log('RewardsDistribution :', rewardsDistribution.address);
    //===========
    const RenaStakingRewards = await hre.ethers.getContractFactory('RenaStakingRewards');
    const renaStakingRewards = await RenaStakingRewards.deploy(RENA_ADDRESS, RENA_ADDRESS);
    await renaStakingRewards.deployed();
    console.log('RenaStakingRewards :', renaStakingRewards.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });