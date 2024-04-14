// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SoulBound} from "./SoulBound.sol";
import {console} from "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FundAllocation {
    error FundAllocation_TransactionFailed();
    error FundAllocation_NotAMember();
    error FundAllocation_InsufficientFunds();
    error FundAllocation_InvalidProposal();
    error FundAllocation_InactiveProposal();
    error FundAllocation_AlreadyVoted();
    error FundAllocation_NoSuchDepartment();
    string private constant NULL = "";
    enum Vote {
        yes,
        no
    }

    SoulBound private token;
    struct Proposal {
        address proposer;
        address payable recepient;
        uint amount;
        uint deadline;
        string title;
        string description;
        string concernedDepartment;
        bool isActive;
        bool isCompleted;
        uint yesCount;
        uint noCount;
        uint totalVoters;
        mapping(address => bool) voters;
    }

    struct ProposalExternalList {
        uint id;
        address proposer;
        address payable recepient;
        uint amount;
        uint deadline;
        string title;
        string description;
        string concernedDepartment;
        bool isActive;
        bool isCompleted;
        uint yesCount;
        uint noCount;
        uint totalVoters;
    }

    constructor(address member) payable {
        token = SoulBound(member);
    }

    receive() external payable {
        console.log(address(this).balance);
    }

    mapping(uint => Proposal) public proposals;

    uint public n_proposals = 0;

    modifier onlyMembers1() {
        if (token.balanceOf(msg.sender) <= 0) {
            revert FundAllocation_NotAMember();
        }
        _;
    }

    modifier onlyMembers2(address voter) {
        if (token.balanceOf(voter) <= 0) {
            revert FundAllocation_NotAMember();
        }
        _;
    }

    modifier validProposal(uint proposalId) {
        if (
            proposalId >= n_proposals ||
            proposals[proposalId].deadline < block.timestamp ||
            proposals[proposalId].isCompleted == true
        ) {
            revert FundAllocation_InvalidProposal();
        }
        _;
    }

    modifier newVoter(address voter, uint proposalId) {
        if (proposals[proposalId].voters[voter] == true) {
            revert FundAllocation_AlreadyVoted();
        }
        _;
    }

    modifier activeProposal(uint proposalId) {
        if (proposals[proposalId].isActive == false) {
            revert FundAllocation_InactiveProposal();
        }
        _;
    }

    modifier isSufficient(uint proposalId) {
        if (address(this).balance <= proposals[proposalId].amount) {
            revert FundAllocation_InsufficientFunds();
        }
        _;
    }

    function createProposal(
        address _proposer,
        uint _amount,
        string calldata _title,
        string calldata _description,
        string calldata _department,
        uint _deadline,
        address payable _recepient
    ) external returns (uint) {
        Proposal storage proposal = proposals[n_proposals];
        require(
            _deadline > block.timestamp,
            "The deadline should be in the future"
        );
        if (token.nullDepartment(_department) != true) {
            revert FundAllocation_NoSuchDepartment();
        }
        if (keccak256(bytes(_department)) == keccak256(bytes(NULL))) {
            proposal.concernedDepartment = NULL;
        } else {
            proposal.concernedDepartment = _department;
        }
        proposal.proposer = _proposer;
        proposal.amount = _amount;
        proposal.deadline = _deadline;
        proposal.title = _title;
        proposal.description = _description;
        proposal.recepient = _recepient;
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
        validProposal(proposalId)
        newVoter(voter, proposalId)
        activeProposal(proposalId)
    {
        Proposal storage proposal = proposals[proposalId];
        proposal.totalVoters++;
        Vote vote = flag == true ? Vote.yes : Vote.no;
        proposal.voters[voter] = true;
        if (vote == Vote.yes) {
            if (
                keccak256(bytes(token.departmentOf(voter))) ==
                keccak256(bytes(proposal.concernedDepartment))
            ) {
                proposal.yesCount += 12;
            } else {
                proposal.yesCount += 10;
            }
        } else if (vote == Vote.no) {
            if (
                keccak256(bytes(token.departmentOf(voter))) ==
                keccak256(bytes(proposal.concernedDepartment))
            ) {
                proposal.noCount += 12;
            } else {
                proposal.noCount += 10;
            }
        }
    }

    function numberOfVoters(uint proposalId) external view returns (uint) {
        return proposals[proposalId].totalVoters;
    }

    function activateProposal(
        uint proposalId
    ) external validProposal(proposalId) onlyMembers1 {
        Proposal storage proposal = proposals[proposalId];
        require(
            proposal.proposer == msg.sender,
            "Only the proposer can activate the proposal"
        );
        uint threeDays = block.timestamp + 3 * 86400;
        uint twoDays = block.timestamp + 2 * 86400;
        require(
            proposal.deadline < twoDays || proposal.deadline > threeDays,
            "Proposal not in activation period"
        );
        proposals[proposalId].isActive = true;
    }

    function finalizeProposal(
        uint proposalId
    )
        external
        validProposal(proposalId)
        onlyMembers1
        activeProposal(proposalId)
        isSufficient(proposalId)
    {
        console.log(address(this).balance);
        /* require( */
        /*     block.timestamp >= proposals[proposalId].deadline, */
        /*     "Deadline not reached yet" */
        /* ); */
        require(
            msg.sender == proposals[proposalId].proposer,
            "Only proposer can filalize the proposal"
        );
        Proposal storage proposal = proposals[proposalId];
        require(
            proposal.yesCount > proposal.noCount,
            "Not enough members accepted the proposal"
        );
        (bool success, ) = payable(proposal.recepient).call{
            value: proposal.amount
        }("no");
        if (!success) {
            revert FundAllocation_TransactionFailed();
        }
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
                temp.recepient,
                temp.amount,
                temp.deadline,
                temp.title,
                temp.description,
                temp.concernedDepartment,
                temp.isActive,
                temp.isCompleted,
                temp.yesCount,
                temp.noCount,
                temp.totalVoters
            );
        }
        return list;
    }
}
