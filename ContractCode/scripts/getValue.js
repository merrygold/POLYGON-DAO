
async function main() {
    DAOVerifierAddress = "0x397D9b8880c91906F794355AdaA81Bd93f69eBdb"

    let daoVerifier = await ethers.getContractAt("DAOVerifier", DAOVerifierAddress)
  
    const value = await daoVerifier.voteStatus("0x526638eDd26A27B29304e1ddCe85104187863932");

    console.log("Value:", value);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
