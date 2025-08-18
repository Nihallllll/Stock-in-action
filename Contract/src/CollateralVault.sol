// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./LendingPool.sol";
import "./Oracle.sol";
contract CollateralVault {
  using SafeERC20 for IERC20;
  address LendingPool ;
  address Oracle;
  struct Tokens {
    address _token;
    uint _quantity;
  }

  constructor(address _lendingPool ,address _oracle){
   LendingPool = _address;
   Oracle = _oracle;
  }

  mapping(address => uint) public ;
  mapping(address => Tokens) public collateralBalanceofBorrower;

  function depositeCollateral(address _token , uint _amount) external {
    require(amount > 0);
    IERC20(_token).safeTransferFrom(msg.sender,address(this),_amount);
    collateralBalanceofBorrower[msg.sender]._token = _token;
    collateralBalanceofBorrower[msg.sender]._quatity = _amount;
  }

  function withDrawCollateral(address _token , uint _amount) external {
    require(collateralBalanceofBorrower[msg.sender]._token);
    require(collateralBalanceofBorrower[msg.sender]._quatity >= _amount);
    require(LendingPool.getUserDebt() == 0);
    IERC20(_token).safeTransfer(msg.sender , _amount)
  }

  function getCollateralValue(address _token , uint _amount) public returns(uint){
    uint data = Oracle.getPrice(_token);
    return data * _amount;
  }

  

  
}