// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SoulBound} from "./Soulbound.sol";

contract FundAllocation {
    error FundAllocation_TransactionFailed();

    SoulBound token;
    struct Proposal {
        address proposer;
        uint amount;
        string title;
        string description;
        uint deadline;
        uint amountCollected;
        address payable recepient;
        bool isActive;
        bool isCompleted;
        uint yesCount;
        uint noCount;
        uint totalVoters;
        address[] voters;
    }

    constructor(address member) {
        token = SoulBound(member);
    }

    mapping(uint => Proposal) public proposals;

    uint public n_proposals = 0;

    modifier onlyMembers() {
        require(
            token.balanceOf(msg.sender) == 0,
            "Only members of the dao can vote"
        );
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

    modifier newVoter(address voter, uint proposalId) {
        bool flag = false;
        for (uint i = 0; i < proposals[proposalId].totalVoters; i++) {
            if (proposals[proposalId].voters[i] == voter) {
                flag = true;
                break;
            }
        }
        require(
            flag == false,
            "You have already cast your vote on this proposal"
        );
        _;
    }

    modifier activeProposal(uint proposalId) {
        require(
            proposals[proposalId].isActive == true,
            "This Proposal is not active"
        );
        _;
    }

    modifier isSufficient(uint proposalId) {
        require(
            address(this).balance < proposals[proposalId].amount,
            "This DAO does not have sufficient funds"
        );
        _;
    }

    function createProposal(
        address _proposer,
        uint _amount,
        string calldata _title,
        string calldata _description,
        uint _deadline,
        address payable _recepient
    ) external returns (uint) {
        Proposal storage proposal = proposals[n_proposals];
        require(
            _deadline < block.timestamp,
            "The deadline should be in the future"
        );
        proposal.proposer = _proposer;
        proposal.amount = _amount;
        proposal.deadline = _deadline;
        proposal.title = _title;
        proposal.description = _description;
        proposal.recepient = _recepient;
        proposal.isActive = false;
        proposal.isCompleted = false;
        proposal.yesCount = 0;
        proposal.noCount = 0;
        proposal.totalVoters = 0;
        n_proposals++;
        return n_proposals - 1;
    }

    function voteProposalYes(
        address voter,
        uint proposalId
    )
        external
        validProposal(proposalId)
        newVoter(voter, proposalId)
        activeProposal(proposalId)
        onlyMembers
    {
        Proposal storage proposal = proposals[proposalId];
        proposal.totalVoters++;
        proposal.yesCount++;
        proposal.voters.push(voter);
    }

    function voteProposalNo(
        address voter,
        uint proposalId
    )
        external
        validProposal(proposalId)
        newVoter(voter, proposalId)
        activeProposal(proposalId)
        onlyMembers
    {
        Proposal storage proposal = proposals[proposalId];
        proposal.totalVoters++;
        proposal.noCount++;
        proposal.voters.push(voter);
    }

    function activateProposal(
        uint proposalId
    ) external validProposal(proposalId) onlyMembers isSufficient(proposalId) {
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
        isSufficient(proposalId)
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
        (bool success, ) = payable(proposal.recepient).call{
            value: proposal.amount
        }("");
        if (!success) {
            revert FundAllocation_TransactionFailed();
        }
        proposal.isActive = false;
        proposal.isCompleted = true;
    }
}
