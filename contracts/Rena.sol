// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract WarenaToken is ERC20, ERC20Burnable {
    constructor() ERC20("Warena Token", "RENA") {
        _mint(msg.sender, 100000000 * 10 ** decimals());
    }
}
