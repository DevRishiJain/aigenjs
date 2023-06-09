import ethers from "ethers";
import {PRIVATE_KEY} from "./config.js";
import {provider} from "./web3_obj.js";

// Create wallet
let wallet = new ethers.Wallet(PRIVATE_KEY, provider);

let abi = '[\n' +
    '\t{\n' +
    '\t\t"inputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "nftAddress",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "tokenId",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"name": "AlreadyListed",\n' +
    '\t\t"type": "error"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"inputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "nftAddress",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "tokenId",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"name": "buyItem",\n' +
    '\t\t"outputs": [],\n' +
    '\t\t"stateMutability": "payable",\n' +
    '\t\t"type": "function"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"inputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "nftAddress",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "tokenId",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"name": "cancelListing",\n' +
    '\t\t"outputs": [],\n' +
    '\t\t"stateMutability": "nonpayable",\n' +
    '\t\t"type": "function"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"inputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "nftAddress",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "tokenId",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "price",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"name": "listItem",\n' +
    '\t\t"outputs": [],\n' +
    '\t\t"stateMutability": "nonpayable",\n' +
    '\t\t"type": "function"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"inputs": [],\n' +
    '\t\t"name": "NoProceeds",\n' +
    '\t\t"type": "error"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"inputs": [],\n' +
    '\t\t"name": "NotApprovedForMarketplace",\n' +
    '\t\t"type": "error"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"inputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "nftAddress",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "tokenId",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"name": "NotListed",\n' +
    '\t\t"type": "error"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"inputs": [],\n' +
    '\t\t"name": "NotOwner",\n' +
    '\t\t"type": "error"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"inputs": [],\n' +
    '\t\t"name": "PriceMustBeAboveZero",\n' +
    '\t\t"type": "error"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"inputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "nftAddress",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "tokenId",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "price",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"name": "PriceNotMet",\n' +
    '\t\t"type": "error"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"anonymous": false,\n' +
    '\t\t"inputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"indexed": true,\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "buyer",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"indexed": true,\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "nftAddress",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"indexed": true,\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "tokenId",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"indexed": false,\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "price",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"name": "ItemBought",\n' +
    '\t\t"type": "event"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"anonymous": false,\n' +
    '\t\t"inputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"indexed": true,\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "seller",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"indexed": true,\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "nftAddress",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"indexed": true,\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "tokenId",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"name": "ItemCanceled",\n' +
    '\t\t"type": "event"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"anonymous": false,\n' +
    '\t\t"inputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"indexed": true,\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "seller",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"indexed": true,\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "nftAddress",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"indexed": true,\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "tokenId",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"indexed": false,\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "price",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"name": "ItemListed",\n' +
    '\t\t"type": "event"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"inputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "nftAddress",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "tokenId",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "newPrice",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"name": "updateListing",\n' +
    '\t\t"outputs": [],\n' +
    '\t\t"stateMutability": "nonpayable",\n' +
    '\t\t"type": "function"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"inputs": [],\n' +
    '\t\t"name": "withdrawProceeds",\n' +
    '\t\t"outputs": [],\n' +
    '\t\t"stateMutability": "nonpayable",\n' +
    '\t\t"type": "function"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"inputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "nftAddress",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t},\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "tokenId",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"name": "getListing",\n' +
    '\t\t"outputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"components": [\n' +
    '\t\t\t\t\t{\n' +
    '\t\t\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t\t\t"name": "price",\n' +
    '\t\t\t\t\t\t"type": "uint256"\n' +
    '\t\t\t\t\t},\n' +
    '\t\t\t\t\t{\n' +
    '\t\t\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t\t\t"name": "seller",\n' +
    '\t\t\t\t\t\t"type": "address"\n' +
    '\t\t\t\t\t}\n' +
    '\t\t\t\t],\n' +
    '\t\t\t\t"internalType": "struct AigenMarketplace.Listing",\n' +
    '\t\t\t\t"name": "",\n' +
    '\t\t\t\t"type": "tuple"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"stateMutability": "view",\n' +
    '\t\t"type": "function"\n' +
    '\t},\n' +
    '\t{\n' +
    '\t\t"inputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "address",\n' +
    '\t\t\t\t"name": "seller",\n' +
    '\t\t\t\t"type": "address"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"name": "getProceeds",\n' +
    '\t\t"outputs": [\n' +
    '\t\t\t{\n' +
    '\t\t\t\t"internalType": "uint256",\n' +
    '\t\t\t\t"name": "",\n' +
    '\t\t\t\t"type": "uint256"\n' +
    '\t\t\t}\n' +
    '\t\t],\n' +
    '\t\t"stateMutability": "view",\n' +
    '\t\t"type": "function"\n' +
    '\t}\n' +
    ']'

export default async function createContract(){
    // Create contract instance with signer
    const aigenmarketplaceContract = new ethers.Contract("0x1f80624f9E15Ec64901fC1E0b9183A8c921064E7", abi, wallet);

    console.log(aigenmarketplaceContract)

    const PRICE = ethers.utils.parseEther("0.001")

    const tx = await aigenmarketplaceContract.connect(wallet).listItem("0xc0ed5719248578bfFba878D4f6Fa7c1cD2a46fb0", "0", PRICE)

    await tx.wait(1)
}

createContract().then(r => {})
