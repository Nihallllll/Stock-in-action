// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ICollateralVault {
    function getCollateralValue(address user) external view returns (uint256);
}

contract LendingPool is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable musdc;
    address public collateralVault;
    uint256 public totalPoolBalance;
    uint256 public totalBorrowed;
    uint256 public ltvBps = 8000;
    uint public BONUS = 8;

    struct LenderPosition {
        uint _time;
        uint _depositAmount;
    }

    mapping(address => LenderPosition) public lenderDeposits;
    mapping(address => uint256) public borrowerDebt;

    event LenderDeposited(address indexed lender, uint256 amount);
    event LenderWithdrawn(address indexed lender, uint256 amount);
    event Borrowed(address indexed borrower, uint256 amount);
    event Repaid(address indexed borrower, uint256 amount);
    event CollateralVaultSet(address indexed vault);
    event LTVUpdated(uint256 newLtvBps);
    event BonusUpdated(uint256 newBonus);

    constructor(address _mUSDC) Ownable(msg.sender) {
        require(_mUSDC != address(0), "mUSDC required");
        musdc = IERC20(_mUSDC);
    }

    function setCollateralVault(address _vault) external onlyOwner {
        collateralVault = _vault;
        emit CollateralVaultSet(_vault);
    }

    function setLTV(uint256 _ltvBps) external onlyOwner {
        require(_ltvBps <= 10000, "ltv invalid");
        ltvBps = _ltvBps;
        emit LTVUpdated(_ltvBps);
    }

    function changeBonus(uint256 bonus) external onlyOwner {
        BONUS = bonus;
        emit BonusUpdated(bonus);
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "zero amount");
        musdc.safeTransferFrom(msg.sender, address(this), amount);

        LenderPosition storage position = lenderDeposits[msg.sender];

        // Reset interest timestamp only if first deposit
        if (position._depositAmount == 0) {
            position._time = block.timestamp;
        }

        position._depositAmount += amount;
        totalPoolBalance += amount;

        emit LenderDeposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        LenderPosition storage position = lenderDeposits[msg.sender];
        require(amount > 0 && amount <= position._depositAmount, "Invalid amount");

        uint totalBenefit = getLenderWithdrawAmount(msg.sender);

        // Update storage
        position._depositAmount -= amount;
        position._time = block.timestamp;
        totalPoolBalance -= (amount + totalBenefit);

        musdc.safeTransfer(msg.sender, amount + totalBenefit);
        emit LenderWithdrawn(msg.sender, amount + totalBenefit);
    }

    function getLenderWithdrawAmount(address user) public view returns (uint) {
        LenderPosition storage position = lenderDeposits[user];
        if (position._depositAmount == 0) return 0;

        uint timeElapsed = block.timestamp - position._time;
        if (timeElapsed < 2 minutes) return 0;

        uint periods = timeElapsed / 2 minutes;
        return (position._depositAmount * BONUS * periods) / 100 ;
    }

    function borrow(uint256 amount) external nonReentrant {
        require(amount > 0, "zero amount");
        require(collateralVault != address(0), "no collateral vault");

        uint256 collateralValue = ICollateralVault(collateralVault).getCollateralValue(msg.sender);
        uint256 maxBorrow = (collateralValue * ltvBps) / 10000;
        uint256 newDebt = borrowerDebt[msg.sender] + amount;

        require(newDebt <= maxBorrow, "insufficient collateral");
        require(totalPoolBalance >= amount, "insufficient liquidity");

        borrowerDebt[msg.sender] = newDebt;
        totalBorrowed += amount;
        totalPoolBalance -= amount;

        musdc.safeTransfer(msg.sender, amount);
        emit Borrowed(msg.sender, amount);
    }

    function repay(uint256 amount) external nonReentrant {
        require(amount > 0, "zero amount");
        uint256 debt = borrowerDebt[msg.sender];
        require(debt >= amount, "repay > debt");

        musdc.safeTransferFrom(msg.sender, address(this), amount);

        borrowerDebt[msg.sender] -= amount;
        totalBorrowed -= amount;
        totalPoolBalance += amount;

        emit Repaid(msg.sender, amount);
    }

    function getUserDebt(address user) external view returns (uint256) {
        return borrowerDebt[user];
    }

    function getLenderDeposit(address user) external view returns (uint256) {
        return lenderDeposits[user]._depositAmount;
    }

    function availableLiquidity() external view returns (uint256) {
        return totalPoolBalance;
    }

    function getHealthFactor(address user) external view returns (uint256) {
        uint collateralValue = ICollateralVault(collateralVault).getCollateralValue(user);
        uint debt = borrowerDebt[user];
        if (debt == 0) return type(uint256).max;
        return (collateralValue * ltvBps) / debt;
    }
}