require("dotenv").config();
const { ethers } = require("ethers");
const abi = require("../abi/PriceFeed.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.PRICE_FEED_ADDRESS, abi, wallet);

const oracleToRemove = process.argv[2];

async function main() {
  if (!oracleToRemove) throw new Error("Provide an address: node helpers/removeOracle.js 0x123...");

  const tx = await contract.removeOracle(oracleToRemove);
  console.log(`Removed oracle: ${oracleToRemove}, tx: ${tx.hash}`);
  await tx.wait();
}

main().catch(console.error);
