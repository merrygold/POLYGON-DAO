const { ethers } = require("hardhat");

require("@nomiclabs/hardhat-etherscan");
async function main() {
// Verify the contract after deploying
await hre.run("verify:verify", {
address: "0x80A6B117511c6527E57F25D04D9adfee23Ae1B0E",
constructorArguments: [],
});
}
// Call the main function and catch if there is any error
main()
.then(() => process.exit(0))
.catch((error) => {
console.error(error);
process.exit(1);
});