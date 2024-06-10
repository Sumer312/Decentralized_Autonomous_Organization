import { useParams } from "@solidjs/router"
import { createSignal, createEffect } from "solid-js";
import Web3 from "web3";
import addresses from "../utils/contract_addresses";
import accounts from "../utils/accounts";
import voting from "../../../web3/artifacts/contracts/Voting.sol/Voting.json"

const DisplayVoteProposal = () => {
  const [contract, setContract] = createSignal(null);
  const [proposal, setProposal] = createSignal()
  const [address, setAddress] = createSignal()
  const contractAddress = addresses.voting
  const web3 = new Web3('http://127.0.0.1:8545');
  const abi = voting.abi;
  const { proposalId } = useParams()

  const getProposal = async () => {
    if (contract()) {
      const result = await contract().methods.getProposalById(proposalId).call()
      console.log(result)
      console.log(new Date(Number(result.deadline) * 1000))
      setProposal(result)
    }
  }

  const activateProposal = async () => {
    if (contract() && proposal()) {
      const result = await contract().methods.activateProposal(proposal().id).send({ from: accounts[0] })
      console.log(result)
    }
  }

  const finalizeProposal = async () => {
    if (contract() && proposal()) {
      const result = await contract().methods.finalizeProposal(proposal().id).send({ from: accounts[0] })
      console.log(result)
    }
  }


  const voteProposal = async (vote) => {
    if (contract() && proposal() && address()) {
      const result = await contract().methods.voteProposal(address(), proposal().id, vote).send({ from: accounts[0] })
      console.log(result)
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
    <div class="flex flex-col gap-6 p-24">
      <h1 class="text-6xl text-primary font-mono font-bold">{proposal() && proposal().title} </h1>
      <p class="text-2xl text-secondary font-mono font-semibold">{proposal() && proposal().proposer} </p>
      <p class="text-2xl text-secondary font-mono font-semibold">{proposal() && new Date(Number(proposal().deadline) * 1000).toString().substring(0, 24)} </p>
      {proposal() && proposal().isActive === true ? <p class="text-3xl text-success font-semibold w-80 font-mono"> Active </p> : <></>}
      <p class="text-2xl text-primary">{proposal() && proposal().description} </p>
      {proposal() && proposal().isCompleted === true ? proposal().yesCount > proposal().noCount ?
        <p class="text-3xl text-success font-bold font-mono"> Proposal Accepted </p> : <p class="text-3xl text-primary font-bold font-mono"> Proposal Declined </p> : <></>}
      {proposal() && proposal().isCompleted === false && proposal().isActive == false ?
        <button class="btn btn-lg btn-accent min-w-sm max-w-2xl w-80" onClick={activateProposal}> Activate Proposal </button> : <></>}
      {proposal() && proposal().isCompleted === false && proposal().isActive == true ? <>
        <div tabindex="0" class="collapse w-80 bg-accent text-primary-content focus:bg-secondary focus:text-secondary-content">
          <input type="checkbox" />
          <button class="btn btn-accent btn-lg w-80 collapse-title text-xl font-semibold">
            Cast vote
          </button>
          <div class="collapse-content">
            <div class="flex flex-col">
              <input class="input input-bordered text-primary-content input-lg input-accent w-72 max-w-2xl" type='text' onChange={(e) => setAddress(e.target.value)} placeholder='Enter account address' />
              <div class="flex flex-row gap-2 mt-6">
                <button class="btn btn-success btn-circle btn-lg" onClick={() => voteProposal(true)}>Yes</button>
                <button class="btn btn-error btn-circle btn-lg" onClick={() => voteProposal(false)}>No</button>
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-secondary btn-lg w-80 collapse-title text-xl font-semibold" onClick={finalizeProposal}>
          Finalize Proposal
        </button>
      </> : <></>}
    </div>
  )
}
export default DisplayVoteProposal;
