const { expect } = require("chai");
const { ethers } = require("hardhat");

const zeroAddress = "0x0000000000000000000000000000000000000000"

describe("TEST", function () {
  beforeEach(async function () {
    const contract = await ethers.getContractFactory("LooksRareToken");

		[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

    token = await contract.deploy("0x30d62E471C5bF6275CD95075Af3E283Af7D94D12", 1, 2);
    await token.deployed();
  });

  describe("Deployment", function () {
		it("Should set the right owner", async function () {
			expect(await token.owner()).to.equal(owner.address)
		})
	})

  describe("Mint", () => {
    it("To Test Mint", async () => {
      console.log( Number(await token.SUPPLY_CAP()) )
      console.log( (await token.totalSupply()).toNumber() )

      expect(await token.mint("0x30d62E471C5bF6275CD95075Af3E283Af7D94D12", 1)).to.emit(token, "Transfer").withArgs(zeroAddress, "0x30d62E471C5bF6275CD95075Af3E283Af7D94D12", 1)

      console.log( (await token.totalSupply()).toNumber() )
    });
  })
});
