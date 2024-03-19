// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {console} from "hardhat/console.sol";

contract SoulBound is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    mapping(address => string) private _tokenDepartments;
    mapping(string => bool) private _allDepartments;

    event Attest(address to, uint tokenId);
    event Revoke(address to, uint tokenId);

    constructor(
        address initialOwner
    ) ERC721("SoulBound", "SBT") Ownable(initialOwner) {
      _allDepartments["IT"] = true;
      _allDepartments["CIVIL"] = true;
      _allDepartments["CSE"] = true;
      _allDepartments["MECH"] = true;
      _allDepartments["ECE"] = true;
      _allDepartments["AIML"] = true;
    }

    function safeMint(
        address to,
        string memory uri,
        string memory department
    ) public onlyOwner {
        require(
          _allDepartments[department] == true,
            "No such department"
        );
        require(
            balanceOf(to) == 0,
            "SBT can only be minted once for one address"
        );
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _tokenDepartments[to] = department;
    }

    function returnDepartment(address voter) external view returns (string memory) {
        require(
            balanceOf(voter) == 1,
            "Should be a member first"
        );
        console.log("hello", _tokenDepartments[voter]);
        return _tokenDepartments[voter];
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
