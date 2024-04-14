import { createSignal, createEffect } from 'solid-js';
import soulbound from "../abi/soulbound.json"
import Web3 from 'web3';

const SoulBoundContract = () => {
  const [contract, setContract] = createSignal(null);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const web3 = new Web3('http://127.0.0.1:8545');
  const [address, setAddress] = createSignal()
  const abi = createSignal(soulbound.abi);

  createEffect(() => {
    if (web3 && contractAddress && abi.length > 0) {
      const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
      const contractInstance = new web3.eth.Contract(abi, contractAddress)
      setContract(contractInstance);
    }
  }, [abi]);

  const balanceOf = async (account) => {
    if (contract() && account !== null) {
      try {
        console.log(account)
        const result = await contract().methods.balanceOf(account).call()
        console.log('Result:', result);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <input type='text' onChange={(e) => setAddress(e.target.value)} placeholder='Enter account address' />
      <button onClick={() => balanceOf(address)}>Balance Of</button>
    </div>
  );
};

export default SoulBoundContract;

