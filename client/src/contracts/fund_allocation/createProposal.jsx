import { createSignal, createEffect } from "solid-js"
import Navbar from "../../components/navbar";
import fundalloc from "../../abi/fundalloc.json"
import accounts from "../../utils/accounts"
import Web3 from 'web3';

const FundAllocationContract = () => {
  const [contract, setContract] = createSignal(null);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const web3 = new Web3('http://127.0.0.1:8545');
  const [title, setTitle] = createSignal()
  const [amount, setAmount] = createSignal()
  const [description, setDescription] = createSignal()
  const [department, setDepartment] = createSignal()
  const [recipient_address, setRecipientAddress] = createSignal()
  const [deadline, setDeadline] = createSignal()
  const abi = createSignal(fundalloc.abi);

  createEffect(() => {
    if (web3 && contractAddress && abi.length > 0) {
      const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
      const contractInstance = new web3.eth.Contract(abi, contractAddress)
      setContract(contractInstance);
    }
  }, [abi]);

  const createProposal = async () => {
    if (contract() && amount() && title() && description() && department() && deadline() && recipient_address()) {
      try {
        const result = await contract().methods.createProposal(accounts[0], amount(), title(), description(), department(), deadline(), recipient_address()).send({ from: accounts[0] })
        console.log('Result:', result);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <form>
        <input type='text' placeholder='Title' onChange={event => setTitle(event.target.value)} />
        <input type='number' placeholder='Amount' onChange={event => setAmount(event.target.value)} />
        <input type='text' placeholder='Recipient address' onChange={event => setRecipientAddress(event.target.value)} />
        <input type='date' placeholder='Deadline' onChange={event => setDeadline(event.target.value)} />
        <textarea rows='5' placeholder='Description' onChange={event => setDescription(event.target.value)} />
        <label for="department"> Department </label>
        <select name="department" onChange={event => setDepartment(event.target.value)} >
          <option value="IT"> IT </option>
          <option value="CIVIL"> CIVIL </option>
          <option value="CSE"> CSE </option>
          <option value="ECE"> ECE </option>
          <option value="AIML"> AIML </option>
          <button type='submit'> Create Proposal </button>
        </select>
        <button type="submit" onClick={createProposal}> submit </button>
      </form>
    </div>
  );
};

export default FundAllocationContract;

