import { Router, Route } from '@solidjs/router';
import SoulBoundContract from './SoulBound';
import FundAllocationContract from './FundAlloc';

const App = () => {

  return (
    <Router>
      <Route path="/soulbound" component={SoulBoundContract} />
      <Route path="/fundalloc" component={FundAllocationContract} />
    </Router>
  );
};

export default App;
