// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PriceFeed {
    struct PriceData {
        string pair;
        uint256 price;
        uint256 timestamp;
    }

    address public owner;
    mapping(string => PriceData) private prices;
    mapping(string => uint256) public lastUpdated;
    mapping(address => bool) public oracles;
    address[] public oracleList;

    event PriceUpdated(string indexed pair, uint256 price, uint256 timestamp);
    event OracleAdded(address indexed oracle);
    event OracleRemoved(address indexed oracle);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _owner) {
        require(_owner != address(0), "Invalid owner");
        owner = _owner;
    }

    function addOracle(address oracle) external onlyOwner {
        require(!oracles[oracle], "Already oracle");
        oracles[oracle] = true;

        bool exists = false;
        for (uint256 i = 0; i < oracleList.length; i++) {
            if (oracleList[i] == oracle) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            oracleList.push(oracle);
        }

        emit OracleAdded(oracle);
    }

    function removeOracle(address oracle) external onlyOwner {
        require(oracles[oracle], "Not an oracle");
        oracles[oracle] = false;
        emit OracleRemoved(oracle);
    }

    function updatePrice(
        string memory pair,
        uint256 price,
        uint256 timestamp,
        bytes[] memory signatures
    ) public {
        require(oracles[msg.sender], "Caller is not an oracle");
        require(timestamp > lastUpdated[pair], "Timestamp too old");

        bytes32 messageHash = keccak256(
            abi.encodePacked(pair, price, timestamp)
        );
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        uint256 valid = 0;
        uint256 total = 0;

        for (uint256 i = 0; i < signatures.length; i++) {
            bytes memory sig = signatures[i];
            if (sig.length == 65) {
                address signer = recoverSigner(ethSignedMessageHash, sig);
                if (oracles[signer]) {
                    valid++;
                }
                total++;
            }
        }

        require(valid * 2 > oracleList.length, "Not enough valid signatures");

        prices[pair] = PriceData(pair, price, timestamp);
        lastUpdated[pair] = timestamp;
        emit PriceUpdated(pair, price, timestamp);
    }

    function getPrice(
        string memory pair
    ) public view returns (string memory, uint256, uint256) {
        PriceData memory data = prices[pair];
        return (data.pair, data.price, data.timestamp);
    }

    function getEthSignedMessageHash(
        bytes32 hash
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }

    function recoverSigner(
        bytes32 ethSignedMessageHash,
        bytes memory signature
    ) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        require(
            uint256(s) <=
                0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff,
            "Invalid signature"
        );
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    function getOracleCount() external view returns (uint256 count) {
        for (uint256 i = 0; i < oracleList.length; i++) {
            if (oracles[oracleList[i]]) {
                count++;
            }
        }
    }

    function isOracle(address oracle) external view returns (bool) {
        return oracles[oracle];
    }
}
