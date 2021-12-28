// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardsDistribution is Ownable {

    /**
     * @notice Authorised address able to call distributeReward
     */
    address public authority;

    /**
     * @notice Address of reward token
     */
    address public rewardAddress;

    constructor(
        address _authority,
        address _rewardAddress
    )  onlyOwner {
        authority = _authority;
        rewardAddress = _rewardAddress;
    }

    // ========== EXTERNAL SETTERS ==========

    function setRewardAddress(address _rewardAddress) public onlyOwner {
        rewardAddress = _rewardAddress;
    }

    /**
     * @notice Set the address of the contract authorised to call distributeReward()
     * @param _authority Address of the authorised calling contract.
     */
    function setAuthority(address _authority) public onlyOwner {
        authority = _authority;
    }

    function distributeReward(address destination, uint amount) public returns (bool) {
        require(amount > 0, "Nothing to distribute");
        require(destination != address(0), "destination address is not set");
        require(msg.sender == authority, "Caller is not authorised");
        require(rewardAddress != address(0), "reward address is not set");
        require(
            IERC20(rewardAddress).balanceOf(address(this)) >= amount,
            "RewardsDistribution contract does not have enough tokens to distribute"
        );

        // Transfer the reward token
        IERC20(rewardAddress).transfer(destination, amount);
        // If the contract implements RewardsDistributionRecipient.sol, inform it how many reward token its received.
        bytes memory payload = abi.encodeWithSignature("notifyRewardAmount(uint256)", amount);
        // solhint-disable avoid-low-level-calls
        (bool success, ) = destination.call(payload);
        if (!success) {
            // Note: we're ignoring the return value as it will fail for contracts that do not implement RewardsDistributionRecipient.sol
        }
        emit RewardsDistributed(amount);
        return true;
    }

    /* ========== Events ========== */
    event RewardsDistributed(uint amount);
}
