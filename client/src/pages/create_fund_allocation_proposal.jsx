import { createSignal, createEffect } from "solid-js"
import Web3 from 'web3';
import fundalloc from "../../../web3/artifacts/contracts/FundAllocation.sol/FundAllocation.json"
import accounts from "../utils/accounts"
import addresses from '../utils/contract_addresses';

const CreateFundAllocationProposal = () => {
  const [contract, setContract] = createSignal(null);
  const contractAddress = addresses.fundallocation
  const web3 = new Web3('http://127.0.0.1:8545');
  const [title, setTitle] = createSignal()
  const [amount, setAmount] = createSignal()
  const [description, setDescription] = createSignal()
  const [department, setDepartment] = createSignal()
  const [recipient_address, setRecipientAddress] = createSignal()
  const [deadline, setDeadline] = createSignal()
  const abi = fundalloc.abi;

  createEffect(() => {
    if (web3 && contractAddress && abi.length > 0) {
      const provider = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
      const contractInstance = new provider.eth.Contract(abi, contractAddress)
      setContract(contractInstance);
    }
  }, [abi]);

  const createProposal = async () => {
    if (contract()) {
      try {
        const result = await contract().methods.createProposal(accounts[0], amount, title, description, department, deadline, recipient_address).send({ from: accounts[0] })
        console.log('Result:', result);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <form class="flex flex-col items-center gap-2">
        <input class="input input-bordered input-lg input-primary w-96 max-w-2xl" type='text' placeholder='Title' onChange={event => setTitle(event.target.value)} />
        <input class="input input-bordered input-lg input-primary w-96 max-w-2xl" type='number' placeholder='Amount' onChange={event => setAmount(event.target.value)} />
        <input class="input input-bordered input-lg input-primary w-96 max-w-2xl" type='text' placeholder='Recipient address' onChange={event => setRecipientAddress(event.target.value)} />
        <input class="input input-bordered input-lg input-primary w-96 max-w-2xl" type='date' placeholder='Deadline' onChange={event => setDeadline(event.target.value)} />
        <textarea class="textarea textarea-primary w-96 max-w-2xl text-lg" rows='5' placeholder='Description' onChange={event => setDescription(event.target.value)} />
        <span class="label-text">Department</span>
        <select class="select select-primary w-96 max-w-2xl" name="department" onChange={event => setDepartment(event.target.value)} >
          <option value="IT"> IT </option>
          <option value="CIVIL"> CIVIL </option>
          <option value="CSE"> CSE </option>
          <option value="ECE"> ECE </option>
          <option value="AIML"> AIML </option>
        </select>
        <button class="btn btn-primary btn-outline btn-lg max-w-2xl w-96" type="submit" onClick={createProposal}> Submit </button>
      </form>
    </div>
  );
};

export default CreateFundAllocationProposal
