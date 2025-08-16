// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract Pool {
    address public Collateral;
    uint public totalPoolAmount ;
    uint constant public interestRate = 10;
    uint constant public lendingProfitPercent = 2;
    // uint constant public borrowingPercentAgainstCollateral = 75;

    //constructor
    constructor(address _Collateral) {
       Collateral = _Collateral;
    }
    //events
    event Deposit(address indexed lender, uint amount);
    event Withdraw(address indexed lender, uint amount);

    //Lenders and Borrowers Balances
    mapping(address => mapping(uint => uint)) public lendersBalances;
    mapping(address => uint) borrowersBalances;
    mapping(address => uint) public borrowersCollateral;
    //Lenders Logic

    function deposite(uint amount , IERC20 token) public {
        require(amount > 0);
        lendersBalances[msg.sender][block.timestamp] += amount;
        totalPoolAmount += amount;
        token.transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, amount);
    }
    function withdraw(uint amount , IERC20 token) public {
        require(amount > 0);
        uint timeElapsed = block.timestamp - lendersBalances[msg.sender][block.timestamp];
        require(timeElapsed > 0);
        uint totalGain = amount * lendingProfitPercent * timeElapsed / 2 minutes;
        lendersBalances[msg.sender][block.timestamp] -= totalGain;
        totalPoolAmount -= totalGain;
        token.transfer(msg.sender, totalGain);
        emit Withdraw(msg.sender, totalGain);
    }

    
    //Borrowers Logic
    function borrow(uint amount , IERC20 token) public {
        require(amount > 0);
        require(amount <= (borrowersCollateral[msg.sender] / 100)*borrowingPercentAgainstCollateral);
        borrowersBalances[msg.sender] += amount;
        totalPoolAmount += amount;
        token.transfer(msg.sender, amount);
    }
    function repay(uint amount , IERC20 token) public {
        require(amount > 0);
        borrowersBalances[msg.sender] -= amount;
        totalPoolAmount -= amount;
        token.transferFrom(msg.sender, address(this), amount);
    }
       
}