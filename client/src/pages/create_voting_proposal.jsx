import { createSignal, createEffect } from "solid-js"
import Web3 from 'web3';
import voting from "../../../web3/artifacts/contracts/Voting.sol/Voting.json"
import accounts from "../utils/accounts"
import addresses from '../utils/contract_addresses';

const CreateVotingProposal = () => {
  const [contract, setContract] = createSignal(null);
  const contractAddress = addresses.voting
  const web3 = new Web3('http://127.0.0.1:8545');
  const [title, setTitle] = createSignal()
  const [description, setDescription] = createSignal()
  const [deadline, setDeadline] = createSignal()
  const abi = voting.abi;

  createEffect(() => {
    if (web3 && contractAddress && abi.length > 0) {
      const provider = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
      const contractInstance = new provider.eth.Contract(abi, contractAddress)
      setContract(contractInstance);
    }
  }, [abi]);

  const createProposal = async () => {
    if (contract()) {
      const deadline_date = new Date(deadline())
      const uint_deadline = BigInt(deadline_date.getTime() / 1000)
      const result = await contract().methods.createProposal(title(), description(), uint_deadline).send({ from: accounts[0] })
      console.log('Result:', result);
    }
  };

  return (
    <div>
      <form class="flex flex-col items-center gap-2">
        <input class="input input-bordered input-lg input-primary w-96 max-w-2xl" type='text' placeholder='Title' onChange={event => setTitle(event.target.value)} />
        <input class="input input-bordered input-lg input-primary w-96 max-w-2xl" type='date' placeholder='Deadline' onChange={event => setDeadline(event.target.value)} />
        <textarea class="textarea textarea-primary w-96 max-w-2xl text-lg" rows='5' placeholder='Description' onChange={event => setDescription(event.target.value)} />
        <button class="btn btn-primary btn-outline btn-lg max-w-2xl w-96" type="submit" onClick={(event) => {
          event.preventDefault()
          createProposal()
        }}> Submit </button>
      </form>
    </div>
  );
};

export default CreateVotingProposal;
