// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SoulBound} from "./SoulBound.sol";

contract Voting {
    SoulBound private token;
    struct Proposal {
        address proposer;
        string title;
        string description;
        uint deadline;
        uint yesCount;
        uint noCount;
        uint totalVoters;
        bool isActive;
        bool isCompleted;
        mapping(address => bool) voters;
    }
    Proposal[] public proposals;

    uint public n_proposals = 0;

    constructor(address member) {
        token = SoulBound(member);
    }

    modifier onlyMembers() {
        require(
            token.balanceOf(msg.sender) == 0,
            "Only members of the DAO can vote"
        );
        _;
    }

    modifier newVoter(uint proposalId, address voter) {
        require(
            proposals[proposalId].voters[voter] == false,
            "You have already cast your vote for this proposal"
        );
        _;
    }

    modifier activeProposal(uint proposalId) {
        require(proposals[proposalId].isActive == true, "Proposal not active");
        _;
    }

    modifier validProposal(uint proposalId) {
        require(proposalId < n_proposals, "Proposal Id not found");
        require(
            proposals[proposalId].deadline > block.timestamp,
            "The deadline of this proposal has already been passed"
        );
        _;
    }

    function createProposal(
        address _proposer,
        string calldata _title,
        string calldata _description
    ) external onlyMembers returns (uint) {
        Proposal storage proposal = proposals.push();
        proposal.proposer = _proposer;
        proposal.title = _title;
        proposal.description = _description;
        n_proposals++;
        return n_proposals - 1;
    }

    function voteProposalYes(
        uint proposalId,
        address voter
    )
        external
        onlyMembers
        newVoter(proposalId, voter)
        validProposal(proposalId)
        activeProposal(proposalId)
    {
        Proposal storage proposal = proposals[proposalId];
        proposal.yesCount++;
        proposal.voters[voter] = true;
        proposal.totalVoters++;
    }

    function voteProposalNo(
        uint proposalId,
        address voter
    )
        external
        onlyMembers
        newVoter(proposalId, voter)
        validProposal(proposalId)
        activeProposal(proposalId)
    {
        Proposal storage proposal = proposals[proposalId];
        proposal.noCount++;
        proposal.totalVoters++;
        proposal.voters[voter] = true;
    }

    function activateProposal(
        uint proposalId
    ) external validProposal(proposalId) onlyMembers {
        Proposal storage proposal = proposals[proposalId];
        require(
            proposal.proposer == msg.sender,
            "Only the proposer can activate the proposal"
        );
        uint threeDays = block.timestamp + 3 * 86400;
        uint twoDays = block.timestamp + 2 * 86400;
        require(
            proposal.deadline < threeDays && proposal.deadline > twoDays,
            "Proposal not in activation period"
        );
        proposals[proposalId].isActive = true;
    }

    function finalizeProposal(
        uint proposalId
    )
        external
        validProposal(proposalId)
        onlyMembers
        activeProposal(proposalId)
    {
        require(
            block.timestamp >= proposals[proposalId].deadline,
            "Deadline not reached yet"
        );
        require(
            msg.sender == proposals[proposalId].proposer,
            "Only proposer can filalize the proposal"
        );
        Proposal storage proposal = proposals[proposalId];
        proposal.isActive = false;
        proposal.isCompleted = true;
    }
}
