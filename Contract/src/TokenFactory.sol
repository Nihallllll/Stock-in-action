// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CustomToken.sol";

contract TokenFactory is Ownable {
    constructor() Ownable(msg.sender) {}
    mapping(string => address) public stockTokens;
    
    event StockTokenCreated(string indexed symbol, address tokenAddress);
    event StockTokenMinted(string indexed symbol, address indexed to, uint256 amount);

    function createStockToken(string calldata symbol) external  returns (address) {
        require(bytes(symbol).length > 0, "Empty symbol");
        require(stockTokens[symbol] == address(0), "Token exists");

        CustomToken token = new CustomToken(symbol, symbol);
        stockTokens[symbol] = address(token);

        emit StockTokenCreated(symbol, address(token));
        return address(token);
    }

    function mintStockToken(string calldata symbol, address to, uint256 amount) external  {
        address tokenAddr = stockTokens[symbol];
        require(tokenAddr != address(0), "Token not found");
        CustomToken(tokenAddr).mint(to, amount);
        emit StockTokenMinted(symbol, to, amount);
    }

    function getTokenAddress(string calldata symbol) external view returns (address) {
        return stockTokens[symbol];
    }
}





// pragma solidity ^0.8.13;

// import "@openzeppelin/contracts/access/Ownable.sol";

// contract TokenFactory is Ownable {
//     // symbol => token address
//     mapping(string => address) public stockTokens;

//     event StockTokenCreated(string symbol, address tokenAddress);
//     event StockTokenMinted(string symbol, address indexed to, uint256 amount);

//     // Deploy minimal ERC20 for symbol; name = symbol
//     function createStockToken(string calldata symbol) external onlyOwner returns (address) {
//         require(stockTokens[symbol] == address(0), "Token already exists");

//         CustomToken token = new CustomToken(symbol, symbol);
//         token.transferOwnership(msg.sender); // Set factory admin as owner
//         stockTokens[symbol] = address(token);

//         emit StockTokenCreated(symbol, address(token));
//         return address(token);
//     }

//     // Mint tokens to "to". Restricted to factory owner to simulate faucet/admin control.
//     function mintStockToken(string calldata symbol, address to, uint256 amount) external onlyOwner {
//         address tokenAddr = stockTokens[symbol];
//         require(tokenAddr != address(0), "Token not found");

//         CustomToken token = CustomToken(tokenAddr);
//         token.mint(to, amount);

//         emit StockTokenMinted(symbol, to, amount);
//     }
// }