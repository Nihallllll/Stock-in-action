// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@IPriceOracle.sol";
contract CollateralVault {
  
  function getCollateralValue(address lender) public view returns(uint) {
    return 100;
  }
  
}