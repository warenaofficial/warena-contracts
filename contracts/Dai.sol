// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract DaiToken is ERC20Burnable {
    constructor() ERC20("Dai Token", "DAI") {
        _mint(msg.sender, 100000000 * 10 ** decimals());
    }
}