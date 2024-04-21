import Navbar from './components/navbar.jsx';
import Routing from './routing.jsx';

const App = () => {

  return (
    <div class="drawer">
      <input id="my-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <Navbar />
        <Routing />
      </div>
      <div class="drawer-side z-40">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu p-4 w-72 h-full bg-base-100/50 text-base-content backdrop-blur-lg overflow-y-auto">
          <li><a href="/mint">Mint</a></li>
          <li><a href="/balance-of">Check Balance</a></li>
          <li><a href="/department-of">Check Department</a></li>
          <li><a href="/activate-proposal">Activate Proposal</a></li>
          <li><a href="/finalize-proposal">Finalize Proposal</a></li>
          <li class="collapse ">
            <input type="checkbox" />
            <div class="collapse-title">
              List Proposals
            </div>
            <ul class="collapse-content -mt-4 mb-4">
              <li><a href="/list-fund-allocation-proposal">Financial</a></li>
              <li><a href="/list-voting-proposals">Non Financial</a></li>
            </ul>
          </li>
          <li class="collapse -mt-6">
            <input type="checkbox" />
            <div class="collapse-title">
              Create Proposal
            </div>
            <ul class="collapse-content -mt-4 mb-4">
              <li><a href="/create-fund-proposal">Financial</a></li>
              <li><a href="/create-vote-proposal">Non Financial</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default App;
