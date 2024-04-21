import { createSignal, createEffect } from 'solid-js';
import addresses from "../utils/contract_addresses"
import fundalloc from "../../../web3/artifacts/contracts/FundAllocation.sol/FundAllocation.json"
import Web3 from 'web3';
import { useNavigate } from '@solidjs/router';
import Card from "../components/card"

const ListFundAllocationProposals = () => {
  const [contract, setContract] = createSignal(null);
  const [proposals, setProposals] = createSignal(null)
  const contractAddress = addresses.fundallocation
  const web3 = new Web3('http://127.0.0.1:8545');
  const abi = fundalloc.abi;
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
        <div onClick={() => navigate(`/fund-proposal/${ele.id}`, { replace: true })}>
          <Card title={ele.title} description={ele.description} />
        </div>
      ))}
    </div>
  )
};

export default ListFundAllocationProposals;
