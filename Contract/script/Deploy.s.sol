// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console2.sol"; // 👈 for logging
import "../src/mUSDC.sol";
import "../src/Oracle.sol";
import "../src/CollateralVault.sol";
import "../src/LendingPool.sol";
import "../src/TokenFactory.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy mUSDC
        mUSDC musdc = new mUSDC();
        console2.log("mUSDC deployed at:", address(musdc));

        // 2. Deploy Oracle
        Oracle oracle = new Oracle();
        console2.log("Oracle deployed at:", address(oracle));

        // 3. Deploy CollateralVault with Oracle
        CollateralVault vault = new CollateralVault(address(oracle));
        console2.log("CollateralVault deployed at:", address(vault));

        // 4. Deploy LendingPool with mUSDC
        LendingPool pool = new LendingPool(address(musdc));
        console2.log("LendingPool deployed at:", address(pool));

        // 5. Deploy TokenFactory
        TokenFactory factory = new TokenFactory();
        console2.log("TokenFactory deployed at:", address(factory));

        // --- Wire things up ---
        pool.setCollateralVault(address(vault));
        vault.setLendingPool(address(pool));

        // Transfer mUSDC ownership to pool so only pool can mint
        musdc.transferOwnership(address(pool));

        // Transfer factory ownership to deployer (you)
        factory.transferOwnership(msg.sender);

        console2.log("Deployment complete!");
        console2.log("Pool is now owner of mUSDC:", musdc.owner());
        console2.log("Deployer is owner of TokenFactory:", factory.owner());

        vm.stopBroadcast();
    }
}
