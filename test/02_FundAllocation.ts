import { expect } from "chai"
import { ethers } from "hardhat"

const oneDay = 24 * 60 * 60;

describe("Fund Allocation", function() {
  it("creating a proposal", async function() {
    const sbt = await ethers.getContractFactory("SoulBound");
    const fa = await ethers.getContractFactory("FundAllocation");
    const accounts = await ethers.getSigners();
    const soul = await sbt.deploy(accounts[0].address);
    await soul.safeMint(accounts[0].address, 123);
    const fund = await fa.deploy(accounts[0].address);
    const proposal = await fund.createProposal(accounts[0].address, 2, "test", "proposal for testing", Math.floor((new Date().getTime()) / 1000 + 2 * oneDay), accounts[1].address);
    const token = await fund.activateProposal(await proposal.value);
    console.log(token);
  })
})
