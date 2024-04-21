import { createSignal, createEffect } from 'solid-js';
import addresses from "../utils/contract_addresses"
import voting from "../../../web3/artifacts/contracts/Voting.sol/Voting.json"
import Web3 from 'web3';
import Card from "../components/card"
import { useNavigate } from '@solidjs/router';

const ListVotingProposals = () => {
  const [contract, setContract] = createSignal(null);
  const [proposals, setProposals] = createSignal(null)
  const contractAddress = addresses.voting
  const web3 = new Web3('http://127.0.0.1:8545');
  const abi = voting.abi;
  const navigate = useNavigate()

  const listProposals = async () => {
    if (contract()) {
      const result = await contract().methods.listProposals().call()
      console.log(result)
      setProposals(result)
    }
  };

  createEffect(() => {
    if (web3 && contractAddress && abi.length > 0) {
      const provider = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
      const contractInstance = new provider.eth.Contract(abi, contractAddress)
      setContract(contractInstance);
      listProposals()
    }
  }, [abi]);

  return (
    <div class="flex p-12 gap-8">
      {proposals() && proposals().map((ele, _) => (
        <div onClick={() => navigate(`/vote-proposal/${ele.id}`, { replace : true })}>
          <Card title={ele.title} description={ele.description} />
        </div>
      ))}
    </div>
  )
};

export default ListVotingProposals;
