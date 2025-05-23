const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();
const abi = require("../abi/PriceFeed.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contractAddress = process.env.PRICE_FEED_ADDRESS;
const contract = new ethers.Contract(contractAddress, abi, provider);

const BAD_PRIVATE_KEYS = [
    // not oracles
    "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
];

async function run() {
    const pair = "ETH/USD";
    const price = 1000;
    const timestamp = Math.floor(Date.now() / 1000);

    const messageHash = ethers.keccak256(ethers.solidityPacked(
        ["string", "uint256", "uint256"],
        [pair, price, timestamp]
    ));

    const ethMessageHash = ethers.hashMessage(ethers.getBytes(messageHash));

    const signatures = await Promise.all(BAD_PRIVATE_KEYS.map(async (pk) => {
        const wallet = new ethers.Wallet(pk, provider);
        return await wallet.signMessage(ethers.getBytes(messageHash));
    }));

    try {
        const tx = await contract.updatePrice(pair, price, timestamp, signatures);
        await tx.wait();
        console.log("Price updated with bad signatures (unexpected!)");
    } catch (err) {
        console.error("Expected failure due to bad signatures:", err.reason || err.message);
    }
}

run();
