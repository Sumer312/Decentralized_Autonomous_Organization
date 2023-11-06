import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers"

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    }
  },
  solidity: "0.8.20",
};

export default config;
