async function createProposal() {
    DAOVerifierAddress = "0x397D9b8880c91906F794355AdaA81Bd93f69eBdb"

    let daoVerifier = await hre.ethers.getContractAt("DAOVerifier", DAOVerifierAddress)
    
    // * id: uint256
    // * vote: bool
   const id = 3
   const vote = true
    try {
        const votePreview = {
            id,
            vote
        }
        console.log(votePreview)
        let voteTXN = await daoVerifier.voteOnProposal(id, vote)
        console.log(voteTXN)
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
