require("dotenv").config();
const { ethers } = require("ethers");
const abi = require("../abi/PriceFeed.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contractAddress = process.env.PRICE_FEED_ADDRESS;
const contract = new ethers.Contract(contractAddress, abi, provider);

const oracles = [
    new ethers.Wallet(process.env.ORACLE1_PRIVATE_KEY),
    new ethers.Wallet(process.env.ORACLE2_PRIVATE_KEY),
];

async function main() {
    const pair = "ETH/USD";
    const price = 3500 * 1e8;
    const timestamp = Math.floor(Date.now() / 1000);

    const message = ethers.solidityPackedKeccak256(
        ["string", "uint256", "uint256"],
        [pair, price, timestamp]
    );

    const ethSigned = ethers.hashMessage(ethers.getBytes(message));

    const signatures = await Promise.all(
        oracles.map((oracle) => oracle.signMessage(ethers.getBytes(message)))
    );

    const sender = oracles[0].connect(provider);
    const contractWithSender = contract.connect(sender);


    try {
        const tx = await contractWithSender.updatePrice(pair, price, timestamp, signatures);
        await tx.wait();
        console.log("Price updated (unexpected!)");
    } catch (err) {
        console.error("Expected failure due to not enough signatures:", err.reason || err.message);
    }
}

main().catch(console.error);
