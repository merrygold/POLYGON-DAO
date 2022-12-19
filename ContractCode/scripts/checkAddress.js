async function checkAddress() {

    DAOVerifierAddress = "0x1312FC73D387DF92F877D953dEe71a29b9B7aE05"

    let daoVerifier = await hre.ethers.getContractAt("DAOVerifier", DAOVerifierAddress)
 
    // * Main work here
    try {
        console.log(await daoVerifier.isMember("0xfe2c2ce7bD13E89B03Fb7dB449CE6fbf8FA41E66"))
      }
      catch (e) {
        console.log("error: ", e);
      }
}


checkAddress()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
