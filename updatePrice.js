require("dotenv").config();
const { ethers } = require("ethers");

// Config
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // PriceFeed Contract address
const PAIR = "ETH/USD";
const PRICE = 3000;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contractAbi = [
        "function updatePrice(string pair, uint256 price, uint256 timestamp, bytes signature) public",
        "function getPrice(string pair) public view returns (string, uint256, uint256)"
    ];
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, wallet);

    // Generate signature
    const timestamp = BigInt(Math.floor(Date.now() / 1000));
    const priceBigInt = BigInt(PRICE);
    const messageHash = ethers.solidityPackedKeccak256(
        ["string", "uint256", "uint256"],
        [PAIR, priceBigInt, timestamp]
    );
    const signature = await wallet.signMessage(ethers.getBytes(messageHash));

    console.log(`Signed: ${signature}`);

    // Transact `updatePrice()`
    const tx = await contract.updatePrice(PAIR, priceBigInt, timestamp, signature);
    await tx.wait();
    console.log(`Price updated: ${tx.hash}`);

    // Call `getPrice()`
    const [pair, price, timestampFetched] = await contract.getPrice(PAIR);
    console.log(`Contract data: ${pair} - $${price}, updated at: ${new Date(Number(timestampFetched) * 1000).toLocaleString()}`);
}

main().catch(console.error);
