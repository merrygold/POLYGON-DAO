const ethers = require("ethers")

async function createProposal() {
    DAOVerifierAddress = "0x397D9b8880c91906F794355AdaA81Bd93f69eBdb"

    let daoVerifier = await hre.ethers.getContractAt("DAOVerifier", DAOVerifierAddress)
    
    // * Description: String
    // * required amount: number
   const Description = `Buy , Buy a new home, A nwe Company a new bike`
   const RequiredAmount = 2333
  //  const RequiredAmount = ethers.utils.formatEther("10000000000000")
   console.log(RequiredAmount)
    try {
        const proposalPreview = {
            Description,
            RequiredAmount
        }
        console.log(proposalPreview)

        let proposal = await daoVerifier.createProposal(Description, RequiredAmount,{
          maxFeePerGas: 100,
          maxPriorityFeePerGas: 50,
      })
        console.log(proposal)
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
