# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

## Deploy

`npx hardhat run ./deploy.js --network bsct`

## Verify + public source code on bscscan

1. Create new constructor params file in arguments folder
2.
```bash
npx hardhat --network bsct verify --constructor-args ./args/deployArgs.js DEPLOYED_CONTRACT_ADDRESS
```

## Contract address on bsc test
```bash
Rena: 0x7bC299AD2ABB57D2bDAc08f80A2909f3a2bBB20D
RewardsDistribution : 0x4cf705F62B9540bC233accD32e45CbE41c03E342
RenaStakingRewards : 0x0534539F2334b116ca66897ED9cCE256fff6bEAE
```