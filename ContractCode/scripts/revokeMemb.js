const hh = require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");



async function withdrawAll() {

    // const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()

    // * Gas Calculation
    // get max fees from gas station
    let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
    try {
      const { data } = await axios({
        method: 'get',
        url: 'https://gasstation-mumbai.matic.today/v2',
      })
      maxFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxFee) + '',
        'gwei'
      )
      maxPriorityFeePerGas = ethers.utils.parseUnits(
        Math.ceil(data.fast.maxPriorityFee) + '',
        'gwei'
      )
    } catch {
      // ignore
    }
    // const daoVerifier = new ethers.Contract(address, ContractABI, signer)
    
    let daoVerifier = await hre.ethers.getContractAt("DAOVerifier", "0x397D9b8880c91906F794355AdaA81Bd93f69eBdb")

    // * Transaction
    try {
      const revokeMembTxn = await daoVerifier.revokeMembership( "0xfe2c2ce7bD13E89B03Fb7dB449CE6fbf8FA41E66",{
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit: "1000000"
      });
      console.log(revokeMembTxn)

      // * wait for 2 confirmations after txn get mined!
      await revokeMembTxn.wait(2);

    } catch (error) {
      console.log(error)
    }


  }

  
withdrawAll()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
