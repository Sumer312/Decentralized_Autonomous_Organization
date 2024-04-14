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
    mapping(address => bool) private balances;

    event Attest(address to, uint tokenId);
    event Burn(address to, uint tokenId);

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
        /* require(to != msg.sender, "you can't mint an SBT for yourself"); */
        require(AllDepartments[department] == true, "No such department");
        require(
            balanceOf(to) == 0,
            "SBT can only be minted once for one address"
        );
        console.log(to);
        uint256 tokenId = nextTokenId++;
        balances[to] = true;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        TokenDepartment[to] = department;
    }

    function balanceOf(
        address caller
    ) public view override(ERC721, IERC721) returns (uint256) {
      console.log(block.number);
      console.log(caller , "=>",  balances[caller]);
        if (balances[caller] == false) {
            return 0;
        }
        return 1;
    }

    function nullDepartment(
        string calldata department
    ) external view returns (bool) {
        return AllDepartments[department];
    }

    function departmentOf(
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
            from == msg.sender && to == address(0),
            "You can't transfer this token"
        );
        require(ownerOf(tokenId) == msg.sender, "Only owner can burn token");
        emit Burn(to, tokenId);
        balances[msg.sender] = false;
        _burn(tokenId);
    }

    function burn(uint tokenId) external onlyOwner {
        require(ownerOf(tokenId) == msg.sender, "Only owner can burn token");
        balances[msg.sender] = false;
        emit Burn(msg.sender, tokenId);
        _burn(tokenId);
    }
}
