// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


contract TokenFactory {
    address public  CustomToken;
    
    constructor(address _address){
        CustomToken =_address;
    }

    function createStockToken(string symbol ,string name) returns (address token){
        CustomToken token = new CustomToken(name ,symbol);
        return address(token);
    }

    function mintStockToken(string symbol, address to, uint256 amount)  {
        CustomToken.mint()
    }

}
