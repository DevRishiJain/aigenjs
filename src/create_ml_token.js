import {PUBLIC_KEY} from "./config.js"
import {contract} from "./contract.js";
import fs from "fs/promises";

// Create a new ethereum account
// web3_obj.eth.accounts.create();

// Derive the public key from private key
// web3_obj.eth.accounts.privateKeyToAccount("private_key");

// get balance of an account
// web3_obj.eth.getBalance('0x6e35A20a740bC7288bdec5d4E138a253D4A72660').then(console.log)

export async function mintNFT(tokenURI, func){
    contract.methods.safeMint(PUBLIC_KEY,
        tokenURI).send({
        gas: 2000000,
        from: PUBLIC_KEY,
    }).catch((error)=>{
        console.log("Error2:", error)
    }).then((a)=>{
        console.log("Result:", a)
        console.log("Token id:", a.events.Transfer.returnValues.tokenId)
        func(a)
    })
}

function mintNFT2(tokenURI){
    const query = contract.methods.safeMint("0x982ef20545D706Daf813e0714E12DC8B33D85558", tokenURI)

    let encodedABI = query.encodeABI()
    console.log("Encoded ABI:", encodedABI)

    web3.eth.accounts.signTransaction(
        {
            data: encodedABI,
            gas: 2000000,
            from: "0x982ef20545D706Daf813e0714E12DC8B33D85558"
        },
        "48163abc317253f320dfa36311ee343fdcb9f77b61c659203a86326bda467520",
        false,
    ).catch((error) => {
        console.log("Error1:", error)
    }).then((signedTx)=>{
        console.log("Signed transaction:", signedTx)

        // contract.(signedTx.rawTransaction).catch((error) => {
        //     console.log("Error2:", error)
        // }).then((transactionReceipt)=>{
        //     console.log("Receipt:", transactionReceipt)
        // });
    })
}

//mintNFT("https://upload.wikimedia.org/wikipedia/commons/0/05/HONDA_ASIMO.jpg")

// contract.methods.tokenURI(0).call().then((value)=>{
//     console.log(value)
// })
