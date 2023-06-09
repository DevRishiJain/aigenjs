import * as Web3 from 'web3'
import { OpenSeaSDK, Network } from 'opensea-js'

// This example provider won't let you make transactions, only read-only calls:
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io')

const openseaSDK = new OpenSeaSDK(provider, {
    networkName: Network.Goerli,
    apiKey: YOUR_API_KEY
})

// Expire this auction one day from now.
// Note that we convert from the JavaScript timestamp (milliseconds):
const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24)

const listing = await openseaSDK.createSellOrder({
    asset: {
        tokenId,
        tokenAddress,
    },
    accountAddress,
    startAmount: 3,
    // If `endAmount` is specified, the order will decline in value to that amount until `expirationTime`. Otherwise, it's a fixed-price order:
    endAmount: 0.1,
    expirationTime
})