import { Router, Route } from '@solidjs/router';
import Mint from "./pages/mint"
import BalanceOf from "./pages/balance_of.jsx"
import DepartmentOf from "./pages/department_of.jsx"
import ListVotingProposals from "./pages/list_voting_proposals.jsx"
import ListFundAllocationProposals from "./pages/list_fund_allocation_proposals.jsx"
import CreateFundAllocationProposal from "./pages/create_fund_allocation_proposal.jsx"
import CreateVotingProposal from "./pages/create_voting_proposal.jsx"
import DisplayVoteProposal from './pages/display_voting_proposals.jsx';
import DisplayFundAllocationProposal from './pages/display_fund_allocation_proposals.jsx';

const Routing = () => {
  return (
    <Router>
      <Route path="/" component={Mint} />
      <Route path="/mint" component={Mint} />
      <Route path="/balance-of" component={BalanceOf} />
      <Route path="/department-of" component={DepartmentOf} />
      <Route path="/list-voting-proposals" component={ListVotingProposals} />
      <Route path="/list-fund-allocation-proposals" component={ListFundAllocationProposals} />
      <Route path="/create-fund-proposal" component={CreateFundAllocationProposal} />
      <Route path="/create-vote-proposal" component={CreateVotingProposal} />
      <Route path="/vote-proposal/:proposalId" component={DisplayVoteProposal} />
      <Route path="/fund-proposal/:proposalId" component={DisplayFundAllocationProposal} />
    </Router>
  )
}
export default Routing
