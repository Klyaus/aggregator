require("dotenv").config();
const { ethers } = require("ethers");
const abi = require("../abi/PriceFeed.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.PRICE_FEED_ADDRESS, abi, wallet);

async function main() {
  const oracles = [
    new ethers.Wallet(process.env.ORACLE1_PRIVATE_KEY).address,
    new ethers.Wallet(process.env.ORACLE2_PRIVATE_KEY).address,
    new ethers.Wallet(process.env.ORACLE3_PRIVATE_KEY).address,
    new ethers.Wallet(process.env.ORACLE4_PRIVATE_KEY).address,
    new ethers.Wallet(process.env.ORACLE5_PRIVATE_KEY).address,
  ];

  for (const oracle of oracles) {
    const tx = await contract.addOracle(oracle);
    console.log(`Added oracle: ${oracle}, tx: ${tx.hash}`);
    await tx.wait();
  }
}

main().catch(console.error);
