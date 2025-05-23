const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();
const abi = require("../abi/PriceFeed.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(process.env.PRICE_FEED_ADDRESS, abi, provider);

async function getPrice(pair) {
    try {
        const [returnedPair, price, timestamp] = await contract.getPrice(pair);
        console.log(`Pair: ${returnedPair}`);
        console.log(`Price: ${price}`);
        console.log(`Timestamp: ${timestamp}`);
    } catch (error) {
        console.error("Error calling getPrice:", error);
    }
}

const pair = process.argv[2];
if (!pair) {
    console.error("Provide currency pair:: node helpers/getPrice.js ETH/USD");
    process.exit(1);
}

getPrice(pair);
