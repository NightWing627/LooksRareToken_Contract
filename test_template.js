// We import Chai to use its asserting functions here.
const { SignerWithAddress } = require("@nomiclabs/hardhat-ethers/signers")
const { expect } = require("chai")
const { utils } = require("ethers")
const { ethers } = require("hardhat")
const zeroAddress = "0x0000000000000000000000000000000000000000"

const {
	expectRevert,
	time,
	ether,
	expectEvent,
} = require("@openzeppelin/test-helpers")
const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")
const whitelistAddress = require("../whitelist/whitelist.json")

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` recieves the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("GSD-NFT", function () {
	// Mocha has four functions that let you hook into the the test runner's
	// lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

	// They're very useful to setup the environment for tests, and to clean it
	// up after they run.

	// A common pattern is to declare some variables, and assign them in the
	// `before` and `beforeEach` callbacks.

	// `beforeEach` will run before each test, re-deploying the contract every
	// time. It receives a callback, which can be async.
	beforeEach(async function () {
		// Get the ContractFactory and Signers here.
		contract = await ethers.getContractFactory("GSDToken")
		;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

		// To deploy our contract, we just have to call Token.deploy() and await
		// for it to be deployed(), which happens onces its transaction has been
		// mined.
		hardhatToken = await contract.deploy(
			"https://ipfs.io/ipfs/QmQtN81i9eNrD3wxcr67scDpLvZDDXxbmAvNXMaZh3D6tB/"
		)

		// We can interact with the contract by calling `hardhatToken.method()`
		await hardhatToken.deployed()
	})

	// You can nest describe calls to create subsections.
	describe("Deployment", function () {
		// `it` is another Mocha function. This is the one you use to define your
		// tests. It receives the test name, and a callback function.

		// If the callback function is async, Mocha will `await` it.
		it("Should set the right owner", async function () {
			// Expect receives a value, and wraps it in an assertion objet. These
			// objects have a lot of utility methods to assert values.

			// This test expects the owner variable stored in the contract to be equal
			// to our Signer's owner.
			expect(await hardhatToken.owner()).to.equal(owner.address)
		})
	})

	describe("Minting", function () {
		it("PreSale", async function () {
			// time.increase(time.duration.days(2))

			const proof = [
				"0x8fd4503de27e27918f845414a2d8c93bb6eb8e36d1824cfbbfb9a6b1471668d2",
				"0x436055b76af1c271905531a6a0a5115f007160400ac89205aeb4fb3748d0390f",
				"0xf34d83e66145417730c0e0a9b021266646cbcc7fd386b1c29d8ea35f82c02973",
				"0xcb270871a60fad41af2a27595c2cb14a94eaf0658afc32c5f382e08e24ed6674",
				"0x963a8a161a1cc86c545853dde0e03e0078a9f8ff19d094adc2f88ebd4fc8b804",
			]
			await expect(
				await hardhatToken.PreSale(proof, 1, {
					value: utils.parseEther("0.055"),
				})
			)
				.to.emit(hardhatToken, "GSDMinted")
				.withArgs(owner.address, 31)
		})

		xit("PublicSale", async function () {
			await expect(
				await hardhatToken.PublicSale(1, {
					value: utils.parseEther("0.75"),
				})
			)
				.to.emit(hardhatToken, "GSDMinted")
				.withArgs(owner.address, 0)
		})

		xit("Should fail mint if it exceeds Max limit", async function () {
			for (let i = 0; i < 50; i++) {
				await hardhatToken.PublicSale(100, {
					value: utils.parseEther("10"),
				})
			}
			console.log(Number(await hardhatToken.totalSupply()))
		})

		xit("Should fail mint if value is below price", async function () {
			await expect(
				hardhatToken.PublicSale(1, {
					value: utils.parseEther("0.04"),
				})
			).to.be.revertedWith("Value is not enough (init)")
		})
	})

	describe("Reveal", function () {
		it("Should reveal by owner", async function () {
			await hardhatToken.setBaseURI(
				"https://gateway.pinata.cloud/ipfs/QmQsL8LG1ghPMEKeWx9nCj1NWUjEppRkuhyUcnoR4sTBo5/"
			)

			const baseTokenURI = await hardhatToken.baseTokenURI()
			await expect(baseTokenURI).to.be.eql(
				"https://gateway.pinata.cloud/ipfs/QmQsL8LG1ghPMEKeWx9nCj1NWUjEppRkuhyUcnoR4sTBo5/"
			)
		})
	})
})
