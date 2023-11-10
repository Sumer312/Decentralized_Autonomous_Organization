import { expect } from "chai"
import { ethers } from "hardhat"

const oneDay = 24 * 60 * 60;

describe("Fund Allocation", function() {
  let soulbound: any;
  let fa: any;
  let accounts: any;
  let sbt: any;
  this.beforeEach(async () => {
    soulbound = await ethers.getContractFactory("SoulBound");
    fa = await ethers.getContractFactory("FundAllocation");
    accounts = await ethers.getSigners();
    sbt = await soulbound.deploy(accounts[0].address);
    for (let index = 0; index < 4; index++) {
      await sbt.safeMint(accounts[index].address, index);
    }
    await accounts[0]
  })
  it("creating a proposal", async function() {
    const fund = await fa.deploy(sbt.address);
    console.log(await accounts[0].sendTransaction({
      to: fund.address,
      value: ethers.utils.parseEther("10")
    }));
    const proposal = await fund.createProposal(accounts[0].address, ethers.utils.parseEther('2'), "test", "proposal for testing", Math.floor((new Date().getTime()) / 1000 + 2 * oneDay), accounts[1].address);
    await fund.activateProposal(await proposal.value);
    await fund.voteProposalYes(accounts[2].address, await proposal.value)
    await fund.voteProposalYes(accounts[1].address, await proposal.value)
    await fund.voteProposalNo(accounts[3].address, await proposal.value)
    await fund.finalizeProposal(await proposal.value);
    console.log(await fund.interface.events);
    console.log(await accounts[1].getBalance());

  })
})
