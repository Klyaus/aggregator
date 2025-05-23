require("dotenv").config();
const { ethers } = require("ethers");
const abi = require("../abi/PriceFeed.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(process.env.PRICE_FEED_ADDRESS, abi, provider);

const addressToCheck = process.argv[2];

async function main() {
  if (!addressToCheck) {
    console.error("Provide an address for verification.: node helpers/isOracle.js 0x123...");
    process.exit(1);
  }

  const count = await contract.getOracleCount();
  const isOracle = await contract.isOracle(addressToCheck);

  console.log(`Total oracles: ${count}`);
  console.log(`Address ${addressToCheck} ${isOracle ? "is an" : "is NOT an"} oracle`);
}

main().catch(console.error);
