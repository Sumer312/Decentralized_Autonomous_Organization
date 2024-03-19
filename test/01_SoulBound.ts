import { expect } from "chai"
import { ethers } from "hardhat"

describe("SoulBound", function() {
  let accounts: any;
  let sbt: any;
  this.beforeEach(async () => {
    sbt = await ethers.getContractFactory("SoulBound");
    accounts = await ethers.getSigners();
  })
  it("testing for mint", async function() {
    const token = await sbt.deploy(accounts[0].address);
    await token.safeMint(accounts[1].address, "123", "IT");
    expect(await token.balanceOf(accounts[1].address)).to.equal(1)

  }),
    it("testing for transfer", async function() {
      const token = await sbt.deploy(accounts[0].address);
      await token.safeMint(accounts[1].address, "123", "IT");
      try {
        await token.transferFrom(accounts[1].address, accounts[3].address, "123");
      } catch (error) {
        expect(await token.balanceOf(accounts[1].address)).to.equal(1);
        expect(await token.balanceOf(accounts[3].address)).to.equal(0);
      }
    })
})
