import { ethers } from "hardhat"

const oneDay = 24 * 60 * 60;

describe("Voting", function() {
  let soulbound: any;
  let accounts: any;
  let voting: any;
  let sbt: any;
  let title: any;
  let deadline: any;
  let description: any;

  this.beforeEach(async () => {
    soulbound = await ethers.getContractFactory("SoulBound");
    voting = await ethers.getContractFactory("Voting")
    accounts = await ethers.getSigners();
    sbt = await soulbound.deploy(accounts[0].address);
    for (let index = 0; index < 7; index++) {
      await sbt.safeMint(accounts[index].address, index, "IT");
    }
    title = "Voting proposal title";
    description = "Testing contract";
    deadline = Math.floor((new Date().getTime()) / 1000 + 2 * oneDay);
  })

  it("Voting proposal should be accepted", async function() {
    const vote = await voting.deploy(sbt.address);
    console.log(`creating a voting proposal {\n caller : ${accounts[0].address},\n title : ${title},\n description : ${description},\n deadline : ${deadline}\n}`);
    const proposal = await vote.createProposal(title, description, deadline);
    await vote.activateProposal(await proposal.value);
    await vote.voteProposal(accounts[2].address, await proposal.value, true)
    await vote.voteProposal(accounts[1].address, await proposal.value, true)
    await vote.voteProposal(accounts[3].address, await proposal.value, false)
    await vote.finalizeProposal(await proposal.value);
  })

  it("Voting proposal should be declined", async function() {
    const vote = await voting.deploy(sbt.address);
    console.log(`creating a voting proposal {\n caller : ${accounts[0].address},\n title : ${title},\n description : ${description},\n deadline : ${deadline}\n}`);
    const proposal = await vote.createProposal(title, description, deadline);
    await vote.activateProposal(await proposal.value);
    await vote.voteProposal(accounts[4].address, await proposal.value, true)
    await vote.voteProposal(accounts[5].address, await proposal.value, false)
    await vote.voteProposal(accounts[6].address, await proposal.value, false)
    try {
      await vote.finalizeProposal(await proposal.value);
    }
    catch (error) {
    }
  })

  it("Voting proposal should throw error", async function() {
    const vote = await voting.deploy(sbt.address);
    console.log(`creating a voting proposal {\n caller : ${accounts[0].address},\n title : ${title},\n description : ${description},\n deadline : ${deadline}\n}`);
    const proposal = await vote.createProposal(title, description, deadline);
    await vote.activateProposal(await proposal.value);
    try {
      await vote.voteProposal(accounts[8].address, await proposal.value, true)
      await vote.voteProposal(accounts[9].address, await proposal.value, true)
      await vote.voteProposal(accounts[7].address, await proposal.value, false)
      await vote.finalizeProposal(await proposal.value);
    }
    catch (error) {
    }
  })
})
