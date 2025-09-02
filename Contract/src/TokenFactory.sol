// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CustomToken.sol";

contract TokenFactory is Ownable {
    constructor() Ownable(msg.sender) {}
    mapping(string => address) public stockTokens;
    
    event StockTokenCreated(string indexed symbol, address tokenAddress);
    event StockTokenMinted(string indexed symbol, address indexed to, uint256 amount);

    // function createStockToken(string calldata symbol) external  returns (address) { //deprecated :)
    //     require(bytes(symbol).length > 0, "Empty symbol");
    //     require(stockTokens[symbol] == address(0), "Token exists");

    //     CustomToken token = new CustomToken(symbol, symbol);
    //     stockTokens[symbol] = address(token);

    //     emit StockTokenCreated(symbol, address(token));
    //     return address(token);
    // }
     /// batch version
    function createStockTokens1(string[] calldata symbols) external returns (address[] memory) {
        address[] memory created = new address[](symbols.length);

        for (uint i = 0; i < symbols.length; i++) {
            require(bytes(symbols[i]).length > 0, "Empty symbol");
            require(stockTokens[symbols[i]] == address(0), "Token exists");

            CustomToken token = new CustomToken(symbols[i], symbols[i]);
            stockTokens[symbols[i]] = address(token);

            created[i] = address(token);

            emit StockTokenCreated(symbols[i], address(token));
        }

        return created;
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



