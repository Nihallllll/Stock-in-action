// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract mUSDC is ERC20{


    
    constructor() ERC20("mUSDC" , "mUSDC"){
     
    }
    
    function mint(address _account,uint  _value) public{
        mint(_account, _value);
    }

    function burn(address _account,uint  _value) public{
        burn(_account, _value);
    }
    
}