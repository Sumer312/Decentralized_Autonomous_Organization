import { Router, Route } from '@solidjs/router';
import Mint from "./pages/mint"
import BalanceOf from "./pages/balanceOf"
import DepartmentOf from "./pages/departmentOf"
import ListVotingProposals from "./pages/listVotingProposals"
import ListFundAllocationProposals from "./pages/listFundAllocationProposals"
import CreateFundAllocationProposal from "./pages/fundAllocationCreateProposal.jsx"
import CreateVotingProposal from "./pages/votingCreateProposal.jsx"

const App = () => {

  return (
    <Router>
      <Route path="/mint" component={Mint} />
      <Route path="/balance-of" component={BalanceOf} />
      <Route path="/department-of" component={DepartmentOf} />
      <Route path="/list-voting-proposals" component={ListVotingProposals} />
      <Route path="/list-fund-allocation-proposals" component={ListFundAllocationProposals} />
      <Route path="/create-proposal-fund" component={CreateFundAllocationProposal} />
      <Route path="/create-proposal-vote" component={CreateVotingProposal} />
    </Router>
  );
};

export default App;
