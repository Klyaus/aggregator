// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/PriceFeed.sol";

contract DeployPriceFeed is Script {
    function run() external {
        vm.startBroadcast();

        PriceFeed priceFeed = new PriceFeed(msg.sender);

        vm.stopBroadcast();
    }
}
