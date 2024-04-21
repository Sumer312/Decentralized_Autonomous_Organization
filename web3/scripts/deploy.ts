import { ethers } from "hardhat";

async function main() {
  let accounts = await ethers.getSigners()
  const soulbound = await ethers.getContractFactory("SoulBound")
  const fundalloc = await ethers.getContractFactory("FundAllocation")
  const voting = await ethers.getContractFactory("Voting")
  const t1 = await soulbound.deploy(accounts[0].address)
  const t2 = await fundalloc.deploy(t1.address)
  const t3 = await voting.deploy(t1.address)
  await accounts[0].sendTransaction({
    to: t2.address,
    value: ethers.utils.parseEther("10")
  });
  console.log(t1.address)
  console.log(t2.address)
  console.log(t3.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
