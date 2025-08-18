// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendingPool {
    //state variables
    uint public totalPoolBalance;
    IERC20 public musdc;
    uint constant public BONUS_% = 8 ;
    uint constant public INTEREST_RATE = 10 ;
    struct LenderPosition {
        uint _time ;
        uint _depositAmount;
    }
    //constructor

    constructor(address _musdc){
        musdc = IERC20(_musdc);
    }
    //mappings
    mapping(address => LenderPosition ) lendersBalances;
    mapping (address => uint) borrowerBalances;
    //Lenders functions

    function deposite(address _token,uint _amount) external {
        require(_amount > 0);
        require(_token == address(musdc), "Invalid token");
        musdc.transferFrom(msg.sender, address(this), _amount);//require??
        totalPoolBalance += _amount;
        lendersBalances[msg.sender]._depositAmount += _amount;
    }

    function withdraw(address _token,uint _amount) external {
        LenderPosition storage position = LenderPosition[msg.sender];
        require(_amount > 0 && _amount <= position._depositAmount);
        require(_token == musdc);
        uint totalBenefit = getLenderWithdrawAmount(msg.sender);
        musdc.transfer(msg.sender , totalBenefit);
        position._depositAmount -= _amount;
        position._time = block.timestamp;
        totalPoolBalance -= totalBenefit ;
    }

    function getLenderWithdrawAmount(address _address) internal returns(uint){
        LenderPosition storage position = LenderPosition[_address];
        uint timeElapsed = block.timestamp - position._time ;
        require(timeElapsed > 1 days);
        uint totalBenefit = (position._depositAmount * BONUS_% )/100 ;
        return totalBenefit;
    }


    //Borrower

    function borrow(address _token , uint _amount) public{
     //1st is collateral sufficient 
     //2nd amount <= collateral 
     musdc.transfer(msg.sender , _amount);
     totalPoolBalance -= _amount ;
     borrowerBalances[msg.sender] += _amount + (_amount / 10); //storing the total debt amount + intersest
    }

    function repay(address _token , uint _amount) external{
     require(borrowerBalances[msg.sender]  >= _amount);
     require(_amount != 0);
    IERC20( _token).transferFrom(msg.sender , address(this) , _amount);
     borrowerBalances[msg.sender] -= _amount;
     totalPoolBalance += _amount ;
    }

    function getUserDebt() external view  returns(uint){
     return borrowerBalances[msg.sender];
    }
}