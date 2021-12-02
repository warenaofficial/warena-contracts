// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


// File: contracts/IRewardDistributionRecipient.sol

pragma solidity ^0.8.2;


abstract contract IRewardDistributionRecipient is Ownable {
    address rewardDistribution;

    function notifyRewardAmount(uint256 reward) external virtual;

    modifier onlyRewardDistribution() {
        require(_msgSender() == rewardDistribution, "Caller is not reward distribution");
        _;
    }

    function setRewardDistribution(address _rewardDistribution)
        external
        onlyOwner
    {
        rewardDistribution = _rewardDistribution;
    }
}

// File: contracts/CurveRewards.sol

pragma solidity ^0.8.2;

abstract contract StakeTokenWrapper {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 public stakeToken;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;

    constructor(address _stakeTokenAddress)  {
         stakeToken = IERC20(_stakeTokenAddress);
    }

    function totalSupply() public virtual view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public virtual view returns (uint256) {
        return _balances[account];
    }

    function stake(uint256 amount) public virtual  {
        _totalSupply = _totalSupply.add(amount);
        _balances[msg.sender] = _balances[msg.sender].add(amount);
        stakeToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) public virtual {
        _totalSupply = _totalSupply.sub(amount);
        _balances[msg.sender] = _balances[msg.sender].sub(amount);
        stakeToken.safeTransfer(msg.sender, amount);
    }
}

contract RenaStakingRewards is StakeTokenWrapper, IRewardDistributionRecipient {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    IERC20 public rewardToken; 
    uint256 public constant DURATION = 5 minutes;
    uint256 public constant LOCK_PERIOD = 5 minutes; // LOCK_PERIOD <= DURATION

    uint256 public periodFinish = 0;
    uint256 public rewardRate = 0;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public withdrawTime;

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(address _rewardTokenAddress, address _stakeTokenAddress) StakeTokenWrapper(_stakeTokenAddress) {
        rewardToken = IERC20(_rewardTokenAddress);
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    function lockedUntil(address account) public view returns (uint256) {
        return withdrawTime[account];
    }

    function isUnlocked(address account) public view returns (bool) {
        if (block.timestamp >= withdrawTime[account]) {
            return true;
        }
        return false;
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return Math.min(block.timestamp, periodFinish);
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalSupply() == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored.add(
                lastTimeRewardApplicable()
                    .sub(lastUpdateTime)
                    .mul(rewardRate)
                    .mul(1e18)
                    .div(totalSupply())
            );
    }

    function totalSupply() public view override returns (uint256) {
        return super.totalSupply();
    } 

    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }

    function DailyReward() public view returns (uint256) {
        return rewardPerToken().mul(totalSupply());
    }

    function earned(address account) public view returns (uint256) {
        return
            balanceOf(account)
                .mul(rewardPerToken().sub(userRewardPerTokenPaid[account]))
                .div(1e18)
                .add(rewards[account]);
    }

    // stake visibility is public as overriding StakeTokenWrapper's stake() function
    function stake(uint256 amount) public updateReward(msg.sender) override  {
        require(amount > 0, "Cannot stake 0");
        super.stake(amount);
        uint256 canWithdrawTime  = block.timestamp.add(LOCK_PERIOD);
        if (canWithdrawTime > periodFinish) {
            canWithdrawTime = periodFinish;
        } 
        withdrawTime[msg.sender] = canWithdrawTime;
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public updateReward(msg.sender) override {
        require(amount > 0, "Cannot withdraw 0");
        require(block.timestamp >= withdrawTime[msg.sender], "Account still in lock");
        super.withdraw(amount);  // no need to update withdrawTime here
        emit Withdrawn(msg.sender, amount);
    }

    function exit() external {
        withdraw(balanceOf(msg.sender));
        getReward();
    }

    function getReward() public updateReward(msg.sender) {
        uint256 reward = earned(msg.sender);
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function notifyRewardAmount(uint256 reward)
        external
        updateReward(address(0))
        override 
    {
        if (block.timestamp >= periodFinish) {
            rewardRate = reward.div(DURATION);
        } else {
            uint256 remaining = periodFinish.sub(block.timestamp);
            uint256 leftover = remaining.mul(rewardRate);
            rewardRate = reward.add(leftover).div(DURATION);
        }
        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp.add(DURATION);
        emit RewardAdded(reward);
    }
}
