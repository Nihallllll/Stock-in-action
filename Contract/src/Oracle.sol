// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Oracle is Ownable {
    mapping(address => uint256) public prices;

    constructor() Ownable(msg.sender) {}

    function setPrices(address[] calldata tokens, uint256[] calldata pricesData) external onlyOwner {
    require(tokens.length == pricesData.length, "Mismatched arrays");
    for (uint i = 0; i < tokens.length; i++) {
        prices[tokens[i]] = pricesData[i];
    }
}


    function getPrice(address token) external view returns (uint256) {
        return prices[token];
    }
}


