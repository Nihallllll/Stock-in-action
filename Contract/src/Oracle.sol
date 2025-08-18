// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Oracle {
   mapping(address => uint) public tokenPrices;
    function setPrice(address _token , uint  _price) public {
        tokenPrices[_token] = _price;
    }
    function getPrice(address _token) public returns(uint){
        return tokenPrices[_token];
    }
}