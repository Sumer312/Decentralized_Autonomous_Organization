import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers"

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
      gas: 2100000,
      gasPrice: 8000000000,
    }
  },
  solidity: "0.8.20",
};

export default config;
