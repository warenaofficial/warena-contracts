require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ganache");
// require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
// require('@nomiclabs/hardhat-ethers');


module.exports = {
  defaultNetwork:"ganache",
  solidity: {
    compilers: [
      {
        version: "0.5.16",
      },
      {
        version: "0.8.0",
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },

  networks: {
    ganache: {
      url: 'http://ganeche:8545',
      accounts: {
        mnemonic: 'tail actress very wool broom rule frequent ocean nice cricket extra snap',
        path: " m/44'/60'/0'/0/",
        initialIndex: 0,
        count: 20,
      },
    }
    // etherscan: {
    //   // Your API key for Etherscan
    //   // Obtain one at https://etherscan.io/
    //   apiKey: "ZWR4VR8GH45EE7H1QKGKTGNHCI75QYH27N"
    // }
   },
};