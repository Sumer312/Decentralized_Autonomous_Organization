/* import { expect } from "chai" */
/* import { ethers } from "hardhat" */
/**/
/* describe("Testing", function() { */
/*   it("testing fund allocation", async function() { */
/*     const sbt = await ethers.getContractFactory("SoulBound"); */
/*     const fa = await ethers.getContractFactory("FundAllocation"); */
/*     const accounts = await ethers.getSigners(); */
/*     await sbt.deploy(accounts[0]); */
/*     const token = await fa.deploy(accounts[0]); */
/*     const proposal = await token.createProposal(accounts[0], 2, "test", "proposal for testing", Math.floor((new Date().getTime() + 24 * 60 * 60) / 1000), accounts[1]); */
/*     await token.activateProposal(await proposal); */
/*     await token.voteProposalYes(accounts[2], await proposal); */
/*     await token.voteProposalYes(accounts[2], await proposal); */
/*     await token.voteProposalNo(accounts[2], await proposal); */
/*     await token.voteProposalNo(accounts[3], await proposal); */
/*     console.log(proposal); */
/*     expect(proposal).to.equal(1); */
/*   }), */
/**/
/*     it("activate proposal", async function() { */
/*       const sbt = await ethers.getContractFactory("SoulBound"); */
/*       const fa = await ethers.getContractFactory("FundAllocation"); */
/*       const accounts = await ethers.getSigners(); */
/*       await sbt.deploy(accounts[0]); */
/*       const token = await fa.deploy(accounts[0]); */
/*       const proposal = await token.createProposal(accounts[0], 2, "test", "proposal for testing", Math.floor((new Date().getTime() + 24 * 60 * 60) / 1000), accounts[1]); */
/*       await token.activateProposal(await proposal); */
/*       console.log(proposal); */
/*       expect(proposal).to.equal(1); */
/*     }) */
/**/
/*   it("finalize proposal", async function() { */
/*     const sbt = await ethers.getContractFactory("SoulBound"); */
/*     const fa = await ethers.getContractFactory("FundAllocation"); */
/*     const accounts = await ethers.getSigners(); */
/*     await sbt.deploy(accounts[0]); */
/*     const token = await fa.deploy(accounts[0]); */
/*     const proposal = await token.createProposal(accounts[0], 2, "test", "proposal for testing", Math.floor((new Date().getTime() + 24 * 60 * 60) / 1000), accounts[1]); */
/*     await token.activateProposal(await proposal); */
/*     await token.finalizeProposal(await proposal); */
/*     console.log(proposal); */
/*     expect(proposal).to.equal(1); */
/*   }) */
/**/
/* }) */
