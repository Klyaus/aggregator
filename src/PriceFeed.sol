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
    mapping(string => uint256) public lastUpdated; // Store the last timestamp to protect against replay attacks

    event PriceUpdated(string indexed pair, uint256 price, uint256 timestamp);

    constructor(address _owner) {
        require(_owner != address(0), "Invalid owner");
        owner = _owner;
    }

    function updatePrice(
        string memory pair,
        uint256 price,
        uint256 timestamp,
        bytes memory signature
    ) public {
        require(_verifySignature(pair, price, timestamp, signature) == owner, "Invalid signature");
        require(timestamp > lastUpdated[pair], "Timestamp must be newer");

        prices[pair] = PriceData(pair, price, timestamp);
        lastUpdated[pair] = timestamp;
        emit PriceUpdated(pair, price, timestamp);
    }

    function getPrice(string memory pair) public view returns (string memory, uint256, uint256) {
        PriceData memory data = prices[pair];
        return (data.pair, data.price, data.timestamp);
    }

    function _verifySignature(
        string memory pair,
        uint256 price,
        uint256 timestamp,
        bytes memory signature
    ) private pure returns (address) {
        bytes32 messageHash = keccak256(abi.encodePacked(pair, price, timestamp));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));

        (bytes32 r, bytes32 s, uint8 v) = _splitSignature(signature);
        require(uint256(s) <= 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff, "Invalid signature");
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    function _splitSignature(bytes memory sig)
        private
        pure
        returns (bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "Invalid signature length");
        
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
