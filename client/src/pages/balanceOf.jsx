import { createSignal, createEffect } from 'solid-js';
import addresses from "../utils/contract_addresses"
import soulbound from "../../../web3/artifacts/contracts/SoulBound.sol/SoulBound.json"
import Web3 from 'web3';

const BalanceOf = () => {
  const [contract, setContract] = createSignal(null);
  const contractAddress =  addresses.soulbound
  const web3 = new Web3('http://127.0.0.1:8545');
  const [address, setAddress] = createSignal()
  const abi = soulbound.abi;

  createEffect(() => {
    if (web3 && contractAddress && abi.length > 0) {
      const provider = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
      const contractInstance = new provider.eth.Contract(abi, contractAddress)
      setContract(contractInstance);
    }
  }, [abi]);

  const balanceOf = async (account) => {
    if (contract() && account !== null) {
      const result = await contract().methods.balanceOf(account).call()
      console.log('Result:', result);
    }
  };

  return (
    <div>
      <input type='text' onChange={(e) => setAddress(e.target.value)} placeholder='Enter account address' />
      <button onClick={() => balanceOf(address())}>Balance Of</button>
    </div>
  );
};

export default BalanceOf;
