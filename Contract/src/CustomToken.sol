// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract CustomToken is ERC20 {
    
    constructor(string memory _name , string memory _symbol) ERC20(_name , _symbol){}

     function mint(address _account,uint  _value) public{
        mint(_account, _value);
    }
}
