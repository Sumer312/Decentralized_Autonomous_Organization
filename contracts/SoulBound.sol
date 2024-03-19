// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {console} from "hardhat/console.sol";

contract SoulBound is ERC721, ERC721URIStorage, Ownable {
    uint256 private nextTokenId;
    mapping(address => string) private TokenDepartment;
    mapping(string => bool) private AllDepartments;

    event Attest(address to, uint tokenId);
    event Revoke(address to, uint tokenId);

    constructor(
        address initialOwner
    ) ERC721("SoulBound", "SBT") Ownable(initialOwner) {
        AllDepartments["IT"] = true;
        AllDepartments["CIVIL"] = true;
        AllDepartments["CSE"] = true;
        AllDepartments["MECH"] = true;
        AllDepartments["ECE"] = true;
        AllDepartments["AIML"] = true;
    }

    function safeMint(
        address to,
        string memory uri,
        string memory department
    ) public onlyOwner {
        require(AllDepartments[department] == true, "No such department");
        require(
            balanceOf(to) == 0,
            "SBT can only be minted once for one address"
        );
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        TokenDepartment[to] = department;
    }

    function nullDepartment(
        string calldata department
    ) external view returns (bool) {
        return AllDepartments[department];
    }

    function returnDepartment(
        address voter
    ) external view returns (string memory) {
        require(balanceOf(voter) == 1, "Should be a member first");
        return TokenDepartment[voter];
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
    ) public override(ERC721, IERC721) onlyOwner {
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

    function burn(uint tokenId) external onlyOwner {
        require(ownerOf(tokenId) == msg.sender, "Only owner can burn token");
        _burn(tokenId);
    }

    function revoke(uint tokenId) external {
        _burn(tokenId);
    }
}
