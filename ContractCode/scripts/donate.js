const hh = require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function donate() {

    DAOVerifierAddress = "0x397D9b8880c91906F794355AdaA81Bd93f69eBdb"

    let daoVerifier = await hre.ethers.getContractAt("DAOVerifier", DAOVerifierAddress)
    
    const amount = ethers.utils.parseEther("0.0034")
    
    console.log(`Donating: ${amount}`)
    
    // * Main work here
    try {
        console.log(await daoVerifier.Donate({value:amount}))

      }
      catch (e) {
        console.log("error: ", e);
      }
}


donate()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
