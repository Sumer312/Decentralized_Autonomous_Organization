import { useParams } from "@solidjs/router"
import { createSignal } from "solid-js";
import Web3 from "web3";
import addresses from "../utils/contract_addresses";
import accounts from "../utils/accounts";
import fundallocation from "../../../web3/artifacts/contracts/Voting.sol/Voting.json"

const DisplayFundAllocationProposal = () => {
  const [contract, setContract] = createSignal(null);
  const contractAddress = addresses.fundallocation
  const web3 = new Web3('http://127.0.0.1:8545');
  const [proposal, setProposal] = createSignal()
  const abi = fundallocation.abi;
  const { proposalId } = useParams()

  const getProposal = async () => {
    if (contract()) {
      const result = await contract().methods.getProposalById(proposalId).send({ from: accounts[0] })
      setProposal(result)
    }
  }

  createEffect(() => {
    if (web3 && contractAddress && abi.length > 0) {
      const provider = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
      const contractInstance = new provider.eth.Contract(abi, contractAddress)
      setContract(contractInstance);
      getProposal()
    }
  }, [abi]);

  return (
    <div>
      <h1>{proposal().title} </h1>
      <p>{proposal().deadline} </p>
      <p>{proposal().description} </p>
      <p>{proposal().concernedDepartment} </p>
      <p>{proposal().recepient} </p>
      {proposal().isActive &&
        <div>
          <input class="input input-bordered input-lg input-primary w-96 max-w-2xl" type='text' onChange={(e) => setAddress(e.target.value)} placeholder='Enter account address' />
          <span class="label-text">Your Vote</span>
          <select class="select select-primary w-96 max-w-2xl" name="department" onChange={event => setDepartment(event.target.value)} >
            <option value="true"> Yes </option>
            <option value="false"> No </option>
          </select>
        </div>
      }
      {proposal().isCompleted &&
        proposal().yesCount > proposal().noCount ? <p> Proposal Accepted </p> : <p> Proposal Declined </p>
      }
    </div>
  )

}
export default DisplayFundAllocationProposal;
