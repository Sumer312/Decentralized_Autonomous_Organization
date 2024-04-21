import { useParams } from "@solidjs/router"
import { createSignal, createEffect } from "solid-js";
import Web3 from "web3";
import addresses from "../utils/contract_addresses";
import accounts from "../utils/accounts";
import voting from "../../../web3/artifacts/contracts/Voting.sol/Voting.json"

const DisplayVoteProposal = () => {
  const [contract, setContract] = createSignal(null);
  const contractAddress = addresses.voting
  const web3 = new Web3('http://127.0.0.1:8545');
  const [proposal, setProposal] = createSignal()
  const abi = voting.abi;
  const { proposalId } = useParams()

  const getProposal = async () => {
    if (contract()) {
      const result = await contract().methods.getProposalById(proposalId).call()
      console.log(result)
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
    <div class="flex">
      <h1>{proposal() && proposal().title} </h1>
      <p>{proposal() && proposal().deadline} </p>
      <p>{proposal() && proposal().description} </p>
      {proposal() && proposal().isActive &&
        <div>
          <input class="input input-bordered input-lg input-primary w-96 max-w-2xl" type='text' onChange={(e) => setAddress(e.target.value)} placeholder='Enter account address' />
          <span class="label-text">Your Vote</span>
          <select class="select select-primary w-96 max-w-2xl" name="department" onChange={event => setDepartment(event.target.value)} >
            <option value="true"> Yes </option>
            <option value="false"> No </option>
          </select>
        </div>
      }
      {proposal() && proposal().isCompleted === true &&
        proposal().yesCount > proposal().noCount ? <p> Proposal Accepted </p> : <p> Proposal Declined </p>
      }

    </div>
  )

}
export default DisplayVoteProposal;
