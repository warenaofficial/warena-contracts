require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-etherscan");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-truffle5");

require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.4",
    networks: {
        bsct: {
            url: `https://speedy-nodes-nyc.moralis.io/7180c6b04212cccaf7fac2d1/bsc/testnet`,
            accounts: [`${process.env.PRIVATE_KEY}`],
            // gas: 8100000,
            gasPrice: 8000000000
        },
    },
    etherscan: {
        apiKey: `${process.env.ETHERSCAN_KEY}`
    },
};
