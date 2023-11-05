// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulBound is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    event Attest(address to, uint tokenId);
    event Revoke(address to, uint tokenId);

    constructor(
        address initialOwner
    ) ERC721("SoulBound", "SBT") Ownable(initialOwner) {}

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function transferFrom(
        address from,
        address to,
        uint tokenId
    ) public override(ERC721, IERC721) {
        require(
            from == address(0) || to == address(0),
            "You can't transfer this token"
        );
        if (from == address(0)) {
            emit Attest(to, tokenId);
        } else if (to == address(0)) {
            emit Revoke(to, tokenId);
        }
    }

    function burn(uint tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only owner can burn token");
        _burn(tokenId);
    }

    function revoke(uint tokenId) external {
        _burn(tokenId);
    }
}
