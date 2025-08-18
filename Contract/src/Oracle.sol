// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Oracle is Ownable {
    mapping(address => uint256) public prices;

    constructor() Ownable(msg.sender) {}

    function setPrice(address token, uint256 price) external onlyOwner {
        prices[token] = price;
    }

    function getPrice(address token) external view returns (uint256) {
        return prices[token];
    }
}





// pragma solidity ^0.8.13;

// contract Oracle {
//    mapping(address => uint) public tokenPrices;
//     function setPrice(address _token , uint  _price) public {
//         tokenPrices[_token] = _price;
//     }
//     function getPrice(address _token)public  view returns(uint){
//         return tokenPrices[_token];
//     }
// }