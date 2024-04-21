import { createSignal, createEffect } from 'solid-js';
import addresses from "../utils/contract_addresses"
import soulbound from "../../../web3/artifacts/contracts/SoulBound.sol/SoulBound.json"
import accounts from "../utils/accounts"
import Web3 from 'web3';
import toast from 'solid-toast';

const Mint = () => {
  const [contract, setContract] = createSignal(null);
  const contractAddress = addresses.soulbound
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

  const mint = async (account) => {
    if (contract() && account !== null) {
      const result = await contract().methods.safeMint(account, "123", "IT").send({ from: accounts[0] })
      if (result.transactionHash !== null) {
        console.log('Result:', result);
        toast("hi")
      }
      console.log('Result:', result.transactionHash);
    }
  };


  return (
    <div class="mt-24">
      <form class="flex flex-col items-center gap-2">
        <input class="input input-bordered input-lg input-primary w-96 max-w-2xl" type='text' onChange={(e) => setAddress(e.target.value)} placeholder='Enter account address' />
        <button class="btn btn-primary btn-outline btn-lg max-w-2xl w-96" onClick={(event) => {
          event.preventDefault()
          mint(address())
        }}>Mint</button>
      </form>
    </div>
  );
};

export default Mint;
