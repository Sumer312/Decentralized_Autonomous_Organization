import { expect } from "chai"
import { ethers } from "hardhat"

const oneDay = 24 * 60 * 60;

describe("Fund Allocation", function() {
  let soulbound: any;
  let fa: any;
  let accounts: any;
  let sbt: any;
  let sender: any;
  let eth: any;
  let title: any;
  let deadline: any;
  let description: any;
  let reciever: any;

  this.beforeEach(async () => {
    soulbound = await ethers.getContractFactory("SoulBound");
    fa = await ethers.getContractFactory("FundAllocation");
    accounts = await ethers.getSigners();
    sbt = await soulbound.deploy(accounts[0].address);
    for (let index = 0; index < 7; index++) {
      await sbt.safeMint(accounts[index].address, index, "IT");
    }
    sender = accounts[0].address;
    eth = ethers.utils.parseEther('2')
    title = "Proposal Title";
    description = "Testing contract";
    deadline = Math.floor((new Date().getTime()) / 1000 + 2 * oneDay);
    reciever = accounts[1].address
  })

  it("Proposal should be accepted", async function() {
    const fund = await fa.deploy(sbt.address);
    await accounts[0].sendTransaction({
      to: fund.address,
      value: ethers.utils.parseEther("10")
    });
    console.log(`creating a proposal {\n sender : ${sender},\n amount : ${eth},\n title : ${title},\n description : ${description},\n deadline : ${deadline},\n reciever : ${reciever}\n}`);
    const proposal = await fund.createProposal(eth, title, description, "IT", deadline, reciever);
    await fund.activateProposal(await proposal.value);
    await fund.voteProposal(accounts[2].address, await proposal.value, true)
    await fund.voteProposal(accounts[1].address, await proposal.value, true)
    await fund.voteProposal(accounts[3].address, await proposal.value, false)
    await fund.finalizeProposal(await proposal.value);
    expect(await accounts[1].getBalance()).to.equal(ethers.utils.parseEther("10002"));
  })

  it("Proposal should be declined", async function() {
    const fund = await fa.deploy(sbt.address);
    await accounts[0].sendTransaction({
      to: fund.address,
      value: ethers.utils.parseEther("10")
    });
    console.log(`creating a proposal {\n sender : ${sender},\n amount : ${eth},\n title : ${title},\n description : ${description},\n deadline : ${deadline},\n reciever : ${reciever}\n}`);
    const proposal = await fund.createProposal(eth, title, description, "IT", deadline, reciever);
    await fund.activateProposal(await proposal.value);
    await fund.voteProposal(accounts[4].address, await proposal.value, true)
    await fund.voteProposal(accounts[5].address, await proposal.value, false)
    await fund.voteProposal(accounts[6].address, await proposal.value, false)
    try {
      await fund.finalizeProposal(await proposal.value);
    } catch (error) {
      expect(await accounts[1].getBalance()).to.equal(ethers.utils.parseEther("10002"));
    }
  })

  it("Proposal should throw error", async function() {
    const fund = await fa.deploy(sbt.address);
    await accounts[0].sendTransaction({
      to: fund.address,
      value: ethers.utils.parseEther("10")
    });
    console.log(`creating a proposal {\n sender : ${sender},\n amount : ${eth},\n title : ${title},\n description : ${description},\n deadline : ${deadline},\n reciever : ${reciever}\n}`);
    const proposal = await fund.createProposal(eth, title, description, "IT", deadline, reciever);
    await fund.activateProposal(await proposal.value);
    try {
      await fund.voteProposal(accounts[8].address, await proposal.value, true)
      await fund.voteProposal(accounts[9].address, await proposal.value, true)
      await fund.voteProposal(accounts[7].address, await proposal.value, false)
      await fund.finalizeProposal(await proposal.value);
    } catch (error) {
      expect(await accounts[1].getBalance()).to.equal(ethers.utils.parseEther("10002"));
    }
  })

  it("Contract should list proposals", async function() {
    const fund = await fa.deploy(sbt.address);
    await accounts[0].sendTransaction({
      to: fund.address,
      value: ethers.utils.parseEther("10")
    });
    console.log(`creating a proposal {\n sender : ${sender},\n amount : ${eth},\n title : ${title},\n description : ${description},\n deadline : ${deadline},\n reciever : ${reciever}\n}`);
    const proposal = await fund.createProposal(eth, title, description, "IT", deadline, reciever);
    const list = await fund.listProposals();
    console.log(list);
  })

})
