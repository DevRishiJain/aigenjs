import Web3 from "web3";
import {PRIVATE_KEY, PROVIDER_URL} from "./config.js";
import ethers from "ethers";
import { getPublicKeyFromPrivateKey } from "./encryption.js";
import { AIGEN_LAUNCHPAD_CONTRACT_ADDRESS } from "./config.js";
import Launchpad_abi from "./aigen_launchpad.json";
export const provider = new ethers.providers.JsonRpcProvider({ url: PROVIDER_URL });
const signer = provider.getSigner();
export const web3 = new Web3(PROVIDER_URL)

export const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
export let PublicKey = getPublicKeyFromPrivateKey(PRIVATE_KEY)
//export const provider = new ethers.providers.Web3Provider(window.ethereum);
//export const signer = provider.getSigner();
export let launchpad_contract = new ethers.Contract(AIGEN_LAUNCHPAD_CONTRACT_ADDRESS, Launchpad_abi, provider).connect(signer);//setup for contracts
export async function getGasPrice() {
    return (await provider.getGasPrice()).toNumber()
}


export async function getNonce(signer) {
    return await provider.getTransactionCount(wallet.address)
}

