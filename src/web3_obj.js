import Web3 from "web3";
import {PRIVATE_KEY, PROVIDER_URL} from "./config.js";
import ethers from "ethers";

export const provider = new ethers.providers.JsonRpcProvider({ url: PROVIDER_URL });
const signer = provider.getSigner();
export const web3 = new Web3(PROVIDER_URL)

export const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

export async function getGasPrice() {
    return (await provider.getGasPrice()).toNumber()
}

export async function getNonce(signer) {
    return await provider.getTransactionCount(wallet.address)
}
