/* import { expect } from "chai" */
/* import { ethers } from "hardhat" */
/**/
/* describe("SoulBound", function() { */
/*   it("testing for mint", async function() { */
/*     const sbt = await ethers.getContractFactory("SoulBound"); */
/*     const owner = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"; */
/*     const otherOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; */
/*     const reciever = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"; */
/*     try { */
/*       const token = await sbt.deploy(owner); */
/*       console.log(await token.owner()); */
/*       await token.safeMint(reciever, "123"); */
/*     } catch (error) { */
/*       console.log(error); */
/*     } */
/*   }), */
/*     it("testing for transfer", async function() { */
/*       const sbt = await ethers.getContractFactory("SoulBound"); */
/*       const owner = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"; */
/*       const otherOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; */
/*       const reciever = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"; */
/*       const token = await sbt.deploy(otherOwner); */
/*       await token.safeMint(reciever, "123"); */
/*       try { */
/*         const transfer = await token.transferFrom(reciever, owner, "123"); */
/*       } catch (error) { */
/*         console.log(await token.balanceOf(owner)); */
/*         console.log(await token.balanceOf(reciever)); */
/*       } */
/*     }) */
/* }) */
