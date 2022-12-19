async function main() {

    // * CONSTANTS
    const circuitId = "credentialAtomicQuerySig";
    const validatorAddress = "0xb1e86C4c687B85520eF4fd2a0d14e81970a15aFB";
  
    // ** Proof Schemas
    
    // ? Extracted from PID Platform
    // * Schema    
    const schema_hash = "7cf3975685c0dacc404583f82d9ac9f7" 
    const schema_end = fromLittleEndian(hexToBytes(schema_hash))
  
    // ** Proof Queries
  
    // * Member Query
    const memberSlotIndex = 3 // * Attribute # 1
    const memberOperator = 1 // * Must be Equal To
    const memberQuery = {
      schema: ethers.BigNumber.from(schema_end),
      slotIndex: memberSlotIndex,
      operator: memberOperator,
      value: [1, ...new Array(63).fill(0).map(i => 0)],
      circuitId,
      };
    
  
    // ! Add the address of the contract just deployed
    DAOVerifierAddress = "0x80A6B117511c6527E57F25D04D9adfee23Ae1B0E"
  
    let daoVerifier = await hre.ethers.getContractAt("DAOVerifier", DAOVerifierAddress)

    const member_requestId = await daoVerifier.MEMBER_REQUEST_ID();
  
     async function setRequest(requestId, validatorAddress, query) {
      let request = await daoVerifier.setZKPRequest(
        requestId,
        validatorAddress,
        query
      );
      
      console.log(request)
     }
  
    try {

    //   * For Member

      await setRequest(member_requestId, validatorAddress, memberQuery)
      console.log("Request set Member");

    }
    catch (e) {
      console.log("error: ", e);
    }
  }
  
  // * Utility Functions
  function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }
  
  function fromLittleEndian(bytes) {
    const n256 = BigInt(256);
    let result = BigInt(0);
    let base = BigInt(1);
    bytes.forEach((byte) => {
      result += base * BigInt(byte);
      base = base * n256;
    });
    return result;
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  