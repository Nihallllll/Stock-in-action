// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract mUSDC is ERC20{
    constructor() ERC20("Mock USDC", "mUSDC") {
        // you can mint some supply here if needed
    }

    function mint(address to, uint256 amount) external  {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external  {
        _burn(from, amount);
    }
}





// pragma solidity ^0.8.13;
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// contract mUSDC is ERC20{

//     constructor() ERC20("mUSDC" , "mUSDC"){ }
    
//     function mint(address _account,uint  _value) public{
//         mint(_account, _value);
//     }

//     function burn(address _account,uint  _value) public{
//         burn(_account, _value);
//     }
    
// }