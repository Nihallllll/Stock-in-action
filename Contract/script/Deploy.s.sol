// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/mUSDC.sol";
import "../src/Oracle.sol";
import "../src/CollateralVault.sol";
import "../src/LendingPool.sol";
import "../src/TokenFactory.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy mUSDC (synthetic stable)
        mUSDC musdc = new mUSDC();

        // 2. Deploy Oracle (anyone can set prices now for demo)
        Oracle oracle = new Oracle();

        // 3. Deploy CollateralVault (tracks deposits, needs oracle)
        CollateralVault vault = new CollateralVault(address(oracle));

        // 4. Deploy LendingPool (borrowing, linked to mUSDC)
        LendingPool pool = new LendingPool(address(musdc));

        // 5. Deploy TokenFactory (for synthetic stocks)
        TokenFactory factory = new TokenFactory();

        // --- Wire things up ---
        pool.setCollateralVault(address(vault));
        vault.setLendingPool(address(pool));

        // Done, no ownership transfers since testnet is open access
        console.log("mUSDC deployed at:", address(musdc));
        console.log("Oracle deployed at:", address(oracle));
        console.log("CollateralVault deployed at:", address(vault));
        console.log("LendingPool deployed at:", address(pool));
        console.log("TokenFactory deployed at:", address(factory));

        vm.stopBroadcast();
    }
}
