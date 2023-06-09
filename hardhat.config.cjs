/** @type import('hardhat/config').HardhatUserConfig */
import {PRIVATE_KEY} from './src/config'

module.exports = {
  defaultNetwork: 'polygon',
  networks: {
    polygon: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts : [PRIVATE_KEY]
    }
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};
