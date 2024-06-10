// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SoulBound} from "./SoulBound.sol";
import {console} from "hardhat/console.sol";

contract Voting {
    error Voting_TransactionFailed();
    error Voting_NotAMember();
    error Voting_InsufficientFunds();
    error Voting_InvalidProposal();
    error Voting_InactiveProposal();
    error Voting_AlreadyVoted();

    enum Vote {
        yes,
        no
    }

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
    }

    struct ProposalExternalList {
        uint id;
        address proposer;
        uint deadline;
        string title;
        string description;
        bool isActive;
        bool isCompleted;
        uint yesCount;
        uint noCount;
        uint totalVoters;
    }

    mapping(uint256 => mapping(address => bool))
        private vote_on_proposal_by_address;

    Proposal[] public proposals;

    uint256 public n_proposals = 0;

    constructor(address member) {
        token = SoulBound(member);
    }

    modifier onlyMembers1() {
        console.log("this is the sender", msg.sender);
        console.log("balance bbc", token.balanceOf(msg.sender));
        console.log("this is where it is failing ig");
        if (token.balanceOf(msg.sender) <= 0) {
            revert Voting_NotAMember();
        }
        _;
    }

    modifier onlyMembers2(address voter) {
        if (token.balanceOf(voter) <= 0) {
            revert Voting_NotAMember();
        }
        _;
    }

    modifier newVoter(uint proposalId, address voter) {
        if (vote_on_proposal_by_address[proposalId][voter] == true) {
            revert Voting_AlreadyVoted();
        }
        _;
    }

    modifier activeProposal(uint proposalId) {
        if (proposals[proposalId].isActive == false) {
            revert Voting_InactiveProposal();
        }
        _;
    }

    modifier validProposal(uint proposalId) {
        if (
            proposalId >= n_proposals ||
            proposals[proposalId].deadline < block.timestamp ||
            proposals[proposalId].isCompleted == true
        ) {
            revert Voting_InvalidProposal();
        }
        _;
    }

    function createProposal(
        string calldata _title,
        string calldata _description,
        uint _deadline
    ) external onlyMembers1 returns (uint256) {
        proposals.push(
            Proposal(
                msg.sender,
                _title,
                _description,
                _deadline,
                0,
                0,
                0,
                false,
                false
            )
        );
        n_proposals++;
        return n_proposals - 1;
    }

    function voteProposal(
        address voter,
        uint proposalId,
        bool flag
    )
        external
        onlyMembers1
        onlyMembers2(voter)
        newVoter(proposalId, voter)
        validProposal(proposalId)
        activeProposal(proposalId)
    {
        Proposal storage proposal = proposals[proposalId];
        vote_on_proposal_by_address[proposalId][voter] = true;
        proposal.totalVoters++;
        Vote vote = flag == true ? Vote.yes : Vote.no;
        if (vote == Vote.yes) {
            proposal.yesCount++;
        } else if (vote == Vote.no) {
            proposal.noCount++;
        }
    }

    function activateProposal(
        uint proposalId
    ) external validProposal(proposalId) onlyMembers1 {
        Proposal storage proposal = proposals[proposalId];
        require(
            proposal.proposer == msg.sender,
            "Only the proposer can activate the proposal"
        );
        /* uint threeDays = block.timestamp + 3 * 86400; */
        /* uint twoDays = block.timestamp + 2 * 86400; */
        /* require( */
        /*     proposal.deadline < twoDays || proposal.deadline > threeDays, */
        /*     "Proposal not in activation period" */
        /* ); */
        proposals[proposalId].isActive = true;
    }

    function finalizeProposal(
        uint proposalId
    )
        external
        validProposal(proposalId)
        onlyMembers1
        activeProposal(proposalId)
    {
        /* require( */
        /*     block.timestamp >= proposals[proposalId].deadline, */
        /*     "Deadline not reached yet" */
        /* ); */
        Proposal storage proposal = proposals[proposalId];
        require(
            msg.sender == proposals[proposalId].proposer,
            "Only proposer can filalize the proposal"
        );
        /* require( */
        /*     proposal.yesCount > proposal.noCount, */
        /*     "Not enough members accepted the proposal" */
        /* ); */
        proposal.isActive = false;
        proposal.isCompleted = true;
    }

    function listProposals()
        external
        view
        returns (ProposalExternalList[] memory)
    {
        ProposalExternalList[] memory list = new ProposalExternalList[](
            n_proposals
        );
        for (uint i = 0; i < n_proposals; i++) {
            Proposal storage temp = proposals[i];
            list[i] = ProposalExternalList(
                i,
                temp.proposer,
                temp.deadline,
                temp.title,
                temp.description,
                temp.isActive,
                temp.isCompleted,
                temp.yesCount,
                temp.noCount,
                temp.totalVoters
            );
        }
        return list;
    }

    function getProposalById(
        uint256 proposalId
    ) external view returns (ProposalExternalList memory) {
        Proposal storage temp = proposals[proposalId];
        return
            ProposalExternalList(
                proposalId,
                temp.proposer,
                temp.deadline,
                temp.title,
                temp.description,
                temp.isActive,
                temp.isCompleted,
                temp.yesCount,
                temp.noCount,
                temp.totalVoters
            );
    }
}
