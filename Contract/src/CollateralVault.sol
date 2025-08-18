// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


contract CollateralVault {
  using SafeERC20 for IERC20;
  
  struct Tokens {
    address _token;
    uint _quantity;
  }
  mapping(address =>uint ) public 
  mapping(address => Tokens) public collateralBalanceofBorrower;

  function depositeCollateral(address _token , uint _amount) external {
    require(amount > 0);
    IERC20(_token).safeTransferFrom(msg.sender,address(this),_amount);
    collateralBalanceofBorrower[msg.sender]._token = _token;
    collateralBalanceofBorrower[msg.sender]._amount = _amount;
  }
  
}