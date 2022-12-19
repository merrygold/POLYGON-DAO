/**
* @type import(‘hardhat/config’).HardhatUserConfig
*/
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
        solidity: "0.8.0",
        defaultNetwork: "mumbai",
        networks: {
            hardhat: {},
            mumbai: {
               url: "https://polygon-mumbai.g.alchemy.com/v2/KEB-3zJIeqcA1FvFMHKDCj8OqobNL4ad",
               accounts: [`0x3df43ee50ed4275cdf822b4a7056471c1b7bc7074b097808303f978b460ae3ab`],           }
        },
        etherscan: {
           apiKey: {
            polygonMumbai: "GEE53FU137BXBQ2I5VY3CU3964MSW74XT"
         },
        },
};


// NEW CONTRACT

// 0x3df43ee50ed4275cdf822b4a7056471c1b7bc7074b097808303f978b460ae3ab DEPLOYER


// OLD CONTRACT
// 0x21b5edbd5d4589c2491cfa0babc1b1e3459e0398720ea884ec847c077e71d58d DONOR

// 0x780b7f857f77327b58d85068ca699b4c8e499d496ac0d51a91f3c76d8bb05967 DONOR

// 0x3df43ee50ed4275cdf822b4a7056471c1b7bc7074b097808303f978b460ae3ab OWNER

// 0x1da82bf98883d30b197cb9da0f30c0a891589125ca83a2a77eacc1f6795101b7 Deployer

// 0x8603351f5aa40fb84ea44fb602eda480d7b1e31c751dbdb1ccb7ddf1cf7498c1 Member