// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Smart contract for common AI NFT creation
contract AINFTToken is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => uint256[]) private userTokenIds;

    constructor() ERC721("AINFTTokens", "AIT") {}

    // Assign this token id to the current user
    function assignAINFTToUser(uint256 tokenId) public {
        userTokenIds[msg.sender].push(tokenId);
    }

    // Return all the tokens that assigned to this user
    function getMyAINFTs() public view returns (uint256[] memory) {
        return userTokenIds[msg.sender];
    }

    // Mint an AI NFT token and assign it to the user
    function mintAINFT(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        assignAINFTToUser(tokenId);
        return tokenId;
    }
}
