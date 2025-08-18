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
    
    mapping(address => uint256) public lenderDeposits;
    mapping(address => uint256) public borrowerDebt;

    event LenderDeposited(address indexed lender, uint256 amount);
    event LenderWithdrawn(address indexed lender, uint256 amount);
    event Borrowed(address indexed borrower, uint256 amount);
    event Repaid(address indexed borrower, uint256 amount);
    event CollateralVaultSet(address indexed vault);
    event LTVUpdated(uint256 newLtvBps);

    constructor(address _mUSDC)Ownable(msg.sender) {
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

    function deposit(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "zero amount");
        require(token == address(musdc), "only mUSDC");
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        lenderDeposits[msg.sender] += amount;
        totalPoolBalance += amount;
        emit LenderDeposited(msg.sender, amount);
    }

    function withdraw(address token, uint256 amount) external nonReentrant {
        require(token == address(musdc), "only mUSDC");
        require(lenderDeposits[msg.sender] >= amount, "insufficient deposit");
        require(totalPoolBalance >= amount, "insufficient pool liquidity");
        lenderDeposits[msg.sender] -= amount;
        totalPoolBalance -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);
        emit LenderWithdrawn(msg.sender, amount);
    }

    function borrow(uint256 amount) external nonReentrant {
        require(amount > 0, "zero amount");
        require(collateralVault != address(0), "no collateral vault set");

        uint256 collateralValue = ICollateralVault(collateralVault).getCollateralValue(msg.sender);
        uint256 existingDebt = borrowerDebt[msg.sender];
        uint256 maxBorrow = (collateralValue * ltvBps) / 10000;

        require(existingDebt + amount <= maxBorrow, "insufficient collateral");
        require(totalPoolBalance >= amount, "insufficient liquidity in pool");

        borrowerDebt[msg.sender] = existingDebt + amount;
        totalBorrowed += amount;
        totalPoolBalance -= amount;
        IERC20(address(musdc)).safeTransfer(msg.sender, amount);

        emit Borrowed(msg.sender, amount);
    }

    function repay(uint256 amount) external nonReentrant {
        require(amount > 0, "zero amount");
        uint256 debt = borrowerDebt[msg.sender];
        require(debt >= amount, "repay > debt");

        IERC20(address(musdc)).safeTransferFrom(msg.sender, address(this), amount);
        borrowerDebt[msg.sender] = debt - amount;
        totalBorrowed -= amount;
        totalPoolBalance += amount;

        emit Repaid(msg.sender, amount);
    }

    function getUserDebt(address user) external view returns (uint256) {
        return borrowerDebt[user];
    }

    function getUserDeposit(address user) external view returns (uint256) {
        return lenderDeposits[user];
    }

    function availableLiquidity() external view returns (uint256) {
        return totalPoolBalance;
    }
}





// pragma solidity ^0.8.13;
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// contract LendingPool {
//     using SafeERC20 for IERC20;
//     //state variables
//     uint public totalPoolBalance;
//     IERC20 public immutable musdc;
//     address CollateralVault;
//     uint constant public BONUS = 8 ;
//     uint constant public INTEREST_RATE = 10 ;
//     struct LenderPosition {
//         uint _time ;
//         uint _depositAmount;
//     }

//     //constructor

//     constructor(address _musdc , address _collateralValut){
//         musdc = IERC20(_musdc);
//         CollateralVault = _collateralValut;
//     }
//     //mappings
//     mapping(address => LenderPosition )public  lendersBalances;
//     mapping (address => uint) borrowerBalances;
//     //Lenders functions

//     function deposite(address _token,uint _amount) external {
//         require(_amount > 0);
//         require(_token == address(musdc), "Invalid token");
//         musdc.safeTransferFrom(msg.sender, address(this), _amount);//require??
//         totalPoolBalance += _amount;
//         lendersBalances[msg.sender]._depositAmount += _amount;
//     }

//     function withdraw(address _token,uint _amount) external {
//        LenderPosition storage position = lendersBalances[msg.sender];
//         require(_amount > 0 && _amount <= position._depositAmount);
//         require(IERC20(_token) == musdc);
//         uint totalBenefit = getLenderWithdrawAmount(msg.sender);
//         musdc.transfer(msg.sender , totalBenefit);
//         position._depositAmount -= _amount;
//         position._time = block.timestamp;
//         totalPoolBalance -= totalBenefit ;
//     }
 
//     function getLenderWithdrawAmount(address _address) internal returns(uint){
//         LenderPosition storage position = lendersBalances[_address];
//         uint timeElapsed = block.timestamp - position._time ;
//         require(timeElapsed > 1 days);
//         uint totalBenefit = (position._depositAmount * BONUS )/100 ;
//         return totalBenefit;
//     }


//     //Borrower

//     function borrow(address _token , uint _amount) public{
//      //1st is collateral sufficient 
//      CollateralVault.getCollateralValue(_token ,_amount);
//      //2nd amount <= collateral 
//      musdc.transfer(msg.sender , _amount);
//      totalPoolBalance -= _amount ;
//      borrowerBalances[msg.sender] += _amount + (_amount / 10); //storing the total debt amount + intersest
//     }

//     function repay(address _token , uint _amount) external{
//      require(borrowerBalances[msg.sender]  >= _amount);
//      require(_amount != 0);
//      IERC20( _token).safeTransferFrom(msg.sender , address(this) , _amount);
//      borrowerBalances[msg.sender] -= _amount;
//      totalPoolBalance += _amount ;
//     }

//     function getUserDebt() external view  returns(uint){
//      return borrowerBalances[msg.sender];
//     }
// }