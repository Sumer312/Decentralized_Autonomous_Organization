import { createSignal, createEffect } from 'solid-js';
import addresses from "../utils/contract_addresses"
import voting from "../../../web3/artifacts/contracts/Voting.sol/Voting.json"
import accounts from "../utils/accounts"
import Web3 from 'web3';

const ListVotingProposals = () => {
  const [contract, setContract] = createSignal(null);
  const contractAddress = addresses.voting
  const web3 = new Web3('http://127.0.0.1:8545');
  const [proposals, setProposals] = createSignal()
  const abi = voting.abi;

  const listProposals = async () => {
    if (contract()) {
      const result = await contract().methods.listProposals().send({ from: accounts[0] })
      return result
    }
    return null
  };


  createEffect(() => {
    if (web3 && contractAddress && abi.length > 0) {
      const provider = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
      const contractInstance = new provider.eth.Contract(abi, contractAddress)
      setContract(contractInstance);
    }
    const lists = listProposals()
    if (lists !== null) {
      setProposals(listProposals)
    }
  }, [abi]);

  return (
    <div>
      {proposals()}
    </div>
  )
};

export default ListVotingProposals;
