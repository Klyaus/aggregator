# PriceFeed

## deploy PriceFeed

use variables

RPC_URL=<https://your-rpc-url>

OWNER_PRIVATE_KEY=your-private-key

CONTRACT_ADDRESS=address-from-deploy-result

Install Foundry

```sh
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

```sh
forge script script/DeployPriceFeed.s.sol --rpc-url $RPC_URL --private-key $OWNER_PRIVATE_KEY --broadcast
```

verify contract on blockscout

```sh
forge script script/DeployPriceFeed.s.sol --rpc-url $RPC_URL --private-key $OWNER_PRIVATE_KEY --resume --verify --verifier blockscout --verifier-url https://explorer-testnet.unit0.dev/api/
```

Unit Zero Testnet Address 0xb8136BFC3E7555FB8c407aC52283C84df7D783EE

## local test

Run anvil

```sh
 anvil --fork-url https://rpc.unit0.dev
```

Export test private key

```sh
export OWNER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export RPC_URL=http://127.0.0.1:8545
```

Deploy contract

```sh
forge script script/DeployPriceFeed.s.sol --rpc-url local --private-key $OWNER_PRIVATE_KEY --broadcast 
```

Export cotract address

```sh
export CONTRACT_ADDRESS=<address from deploy result>
```

Export oracles private keys

```sh
export ORACLE1_PRIVATE_KEY=0x...
export ORACLE2_PRIVATE_KEY=0x...
export ORACLE3_PRIVATE_KEY=0x...
export ORACLE4_PRIVATE_KEY=0x...
export ORACLE5_PRIVATE_KEY=0x...
```

### Scripts

- Install requirements

```sh
npm install
```

- Add oracles from privet keys

```sh
node helpers/addOracles.js
```

- Update price for pair

```sh
node helpers/updatePrice.js
```

- Get price from PriceFeed

```sh
node helpers/getPrice.js ETH/USD
```

- Remove oracle

```sh
node helpers/removeOracle.js 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

- Check if an address is an oracle

```sh
node helpers/isOracle.js 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

- Checking with invalid signatures

```sh
node helpers/badSignatures.js
```

- Checking with insufficient signatures

```sh
node helpers/notEnoughSignatures.js
```
