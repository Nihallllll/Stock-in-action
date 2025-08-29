// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ILendingPool {
    function getUserDebt(address user) external view returns (uint256);
    function ltvBps() external view returns (uint256);
}

interface IOracle {
    function getPrice(address token) external view returns (uint256);
}

contract CollateralVault is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    uint ltvBps = 8000;
    uint public  totalPoolCollateralBalance ;
    mapping(address => mapping(address => uint256)) public collateralBalance;
    mapping(address => address[]) internal userTokens;
    mapping(address => mapping(address => bool)) internal tokenExistsForUser;

    address public lendingPool;
    IOracle public oracle;

    event CollateralDeposited(address indexed user, address indexed token, uint256 amount);
    event CollateralWithdrawn(address indexed user, address indexed token, uint256 amount);
    event LendingPoolSet(address indexed pool);
    event OracleSet(address indexed oracle);

    constructor(address _oracle) Ownable(msg.sender){
        require(_oracle != address(0), "oracle required");
        oracle = IOracle(_oracle);
    }

    function setLendingPool(address _pool) external  {
        lendingPool = _pool;
        emit LendingPoolSet(_pool);
    }

    function setOracle(address _oracle) external {
        oracle = IOracle(_oracle);
        emit OracleSet(_oracle);
    }

    function depositCollateral(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "zero amount");
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        if (!tokenExistsForUser[msg.sender][token]) {
            tokenExistsForUser[msg.sender][token] = true;
            userTokens[msg.sender].push(token);
        }

        collateralBalance[msg.sender][token] += amount;
        totalPoolCollateralBalance += amount;
        emit CollateralDeposited(msg.sender, token, amount);
    }

    function withdrawCollateral(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "zero amount");
        require(collateralBalance[msg.sender][token] >= amount, "not enough collateral");
        require(lendingPool != address(0), "lendingPool not set");

        uint256 newCollateralValue = _collateralValueAfterWithdrawal(msg.sender, token, amount);
        uint256 debt = ILendingPool(lendingPool).getUserDebt(msg.sender);
        uint256 ltv = ILendingPool(lendingPool).ltvBps();
        uint256 maxBorrow = (newCollateralValue * ltv) / 10000;

        require(debt <= maxBorrow, "withdraw would make position unsafe");

        collateralBalance[msg.sender][token] -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);
        emit CollateralWithdrawn(msg.sender, token, amount);
    }

    function getCollateralValue(address user) public view returns (uint256) {
        uint256 total = 0;
        address[] memory toks = userTokens[user];

        for (uint256 i = 0; i < toks.length; i++) {
            address t = toks[i];
            uint256 bal = collateralBalance[user][t];
            if (bal == 0) continue;
            uint256 price = oracle.getPrice(t);
            total += (bal * price) / 1e18;
        }
        return total;
    }

    function _collateralValueAfterWithdrawal(address user, address token, uint256 amount) internal view returns (uint256) {
        uint256 total = 0;
        address[] memory toks = userTokens[user];

        for (uint256 i = 0; i < toks.length; i++) {
            address t = toks[i];
            uint256 bal = collateralBalance[user][t];
            if (t == token) {
                if (bal <= amount) {
                    bal = 0;
                } else {
                    bal = bal - amount;
                }
            }
            if (bal == 0) continue;
            uint256 price = oracle.getPrice(t);
            total += (bal * price) / 1e18;
        }
        return total;
    }

    function getUserTokens(address user) external view returns (address[] memory) {
        return userTokens[user];
    }

    function maxBorrowable(address user) external view returns (uint256) {
        uint total = getCollateralValue(user);
        return (total * ltvBps) / 10000;
    }

    
}





// pragma solidity ^0.8.13;


// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import "./LendingPool.sol";
// import "./Oracle.sol";
// contract CollateralVault {
//   using SafeERC20 for IERC20;
//   address LendingPool ;
//   address Oracle;
//   struct Tokens {
//     address _token;
//     uint _quantity;
//   }

//   constructor(address _lendingPool ,address _oracle){
//    LendingPool = _address;
//    Oracle = _oracle;
//   }

//   mapping(address => uint) public ;
//   mapping(address => Tokens) public collateralBalanceofBorrower;

//   function depositeCollateral(address _token , uint _amount) external {
//     require(amount > 0);
//     IERC20(_token).safeTransferFrom(msg.sender,address(this),_amount);
//     collateralBalanceofBorrower[msg.sender]._token = _token;
//     collateralBalanceofBorrower[msg.sender]._quatity = _amount;
//   }

//   function withDrawCollateral(address _token , uint _amount) external {
//     require(collateralBalanceofBorrower[msg.sender]._token);
//     require(collateralBalanceofBorrower[msg.sender]._quatity >= _amount);
//     require(LendingPool.getUserDebt() == 0);
//     IERC20(_token).safeTransfer(msg.sender , _amount)
//   }

//   function getCollateralValue(address _token , uint _amount) public returns(uint){
//     uint data = Oracle.getPrice(_token);
//     return data * _amount;
//   }

  

  
// }