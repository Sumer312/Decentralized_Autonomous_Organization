import { expect } from "chai"
import { ethers } from "hardhat"

describe("Testing", function() {
  it("Date checking", async function() {
    const test = await ethers.getContractFactory("Test");
    const token = await test.deploy();
    const date = await token.boolDate(Math.floor((new Date()).getTime() / 1000 + 24 * 60 * 60));
    console.log(date);
  })
})

