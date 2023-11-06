import { expect } from "chai"
import { ethers } from "hardhat"

const oneDay = 24 * 60 * 60;

describe("Testing", function() {
  it("testing fund allocation", async function() {
    const sbt = await ethers.getContractFactory("SoulBound");
    const fa = await ethers.getContractFactory("FundAllocation");
    const accounts = await ethers.getSigners();
    const soul = await sbt.deploy(accounts[0].address);
    await soul.safeMint(accounts[0].address, 123);
    const fund = await fa.deploy(accounts[0].address);
    const proposal = await fund.createProposal(accounts[0].address, 2, "test", "proposal for testing", Math.floor((new Date().getTime()) / 1000 + 2 * oneDay), accounts[1].address);
    const token = await fund.activateProposal(await proposal.value);
    console.log(token);
    await fund.voteProposalYes(accounts[2].address, await proposal.value);
    await fund.voteProposalYes(accounts[2].address, await proposal.value);
    await fund.voteProposalNo(accounts[4].address, await proposal.value);
    await fund.voteProposalNo(accounts[3].address, await proposal.value);
  })

  /*   it("activate proposal", async function() { */
  /*     const sbt = await ethers.getContractFactory("SoulBound"); */
  /*     const fa = await ethers.getContractFactory("FundAllocation"); */
  /*     const accounts = await ethers.getSigners(); */
  /*     await sbt.deploy(accounts[0].address); */
  /*     const token = await fa.deploy(accounts[0].address); */
  /*     const proposal = await token.createProposal(accounts[0].address, 2, "test", "proposal for testing", Math.floor((new Date().getTime()) / 1000 + 2 * oneDay), accounts[1].address); */
  /*     await token.activateProposal(await proposal); */
  /*     console.log(proposal); */
  /*     expect(proposal).to.equal(1); */
  /*   }) */
  /**/
  /* it("finalize proposal", async function() { */
  /*   const sbt = await ethers.getContractFactory("SoulBound"); */
  /*   const fa = await ethers.getContractFactory("FundAllocation"); */
  /*   const accounts = await ethers.getSigners(); */
  /*   await sbt.deploy(accounts[0].address); */
  /*   const token = await fa.deploy(accounts[0].address); */
  /*   const proposal = await token.createProposal(accounts[0].address, 2, "test", "proposal for testing", Math.floor((new Date().getTime()) / 1000 + 7 * oneDay), accounts[1].address); */
  /*   await token.activateProposal(await proposal); */
  /*   await token.finalizeProposal(await proposal); */
  /*   console.log(proposal); */
  /*   expect(proposal).to.equal(1); */
  /* }) */

})
