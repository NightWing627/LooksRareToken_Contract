const hre = require("hardhat");

async function main() {
  const contract = await hre.ethers.getContractFactory("LooksRareToken");
  const token = await contract.deploy("0x30d62E471C5bF6275CD95075Af3E283Af7D94D12", 1, 2);
  await token.deployed();

  console.log("Deployed to:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
