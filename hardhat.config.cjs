/** @type import('hardhat/config').HardhatUserConfig */
import 22f367f33aa6c5e4043cc8f0b71680c569cef0bb698c5dc3b4bb683e87bb5c49 from './src/config'

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
