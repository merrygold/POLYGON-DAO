async function createProposal() {
    DAOVerifierAddress = "0x397D9b8880c91906F794355AdaA81Bd93f69eBdb"

    let daoVerifier = await hre.ethers.getContractAt("DAOVerifier", DAOVerifierAddress)
    
    // * id: uint256
   const id = 30
    try {
        const proposalPreview = {
            id
        }
        console.log(proposalPreview)
        let pollConducted = await daoVerifier.countVotes(id)
        console.log(pollConducted)
      }
      catch (e) {
        console.log("error: ", e);
      }
}


createProposal()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
