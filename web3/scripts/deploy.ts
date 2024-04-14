import { ethers } from "hardhat";

async function main() {
  let accounts = await ethers.getSigners()
  const sbt = await ethers.getContractFactory("SoulBound")
  const token = await sbt.deploy(accounts[0].address)
  await token.safeMint(accounts[1].address, "123", "IT")
  await token.safeMint(accounts[2].address, "123", "IT")
  await token.safeMint(accounts[3].address, "123", "IT")
  console.log(await token.balanceOf(accounts[0].address))
  console.log(await token.balanceOf(accounts[1].address))
  console.log(await token.balanceOf(accounts[2].address))
  console.log(await token.balanceOf(accounts[3].address))
  console.log(token.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
