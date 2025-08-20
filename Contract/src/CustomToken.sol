// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CustomToken is ERC20, Ownable {
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) Ownable(msg.sender){}

    function mint(address to, uint256 amount) external  {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external  {
        _burn(from, amount);
    }
}






// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// // Minimal ERC20 token with public mint function restricted to factory (admin).
// contract CustomToken is ERC20, Ownable {
//     constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
//         // Ownable constructor auto-called
//     }

//     // Mint function callable only by owner (factory)
//     function mint(address to, uint256 amount) external onlyOwner {
//         _mint(to, amount);
//     }

//     function burn(address from, uint256 amount) external onlyOwner {
//         _burn(from, amount);
//     }
// }