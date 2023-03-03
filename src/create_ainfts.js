import {contract} from "./contract.js";
import {PUBLIC_KEY} from "./config.js";
import {deployFilesToNFTStorage} from "./nftstorage.js";
import fs1 from "fs";
import fs from "fs/promises";

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

export async function createAINFTs(weights_dir) {
    await deployFilesToNFTStorage(weights_dir, async function (metadata) {
        console.log("Metadata initial:", metadata)
        await mintNFT("https://" + metadata.metadata_cid + ".ipfs.nftstorage.link", async function (result) {
            metadata.tokenId = result.events.Transfer.returnValues.tokenId
            console.log("Metadata:", metadata)

            try {
                if (fs1.existsSync(model_name+"_metadata.json")) {
                    //file exists
                    fs.readFile(model_name + "_metadata.json").then(content=>{
                        let model_metadata = JSON.parse(content.toString())
                        model_metadata.push(metadata)

                        fs.writeFile(model_name + "_metadata.json", JSON.stringify(model_metadata), { flag: 'w' }).then(r => {
                        })
                    })
                }else{
                    fs.writeFile(model_name+"_metadata.json", JSON.stringify([metadata]),{flag: 'w'}).then(r=>{
                    })
                }
            } catch(err) {
                console.error(err)
                fs.writeFile(model_name+"_metadata.json", JSON.stringify([metadata]),{flag: 'w'}).then(r=>{
                })
            }
        })
    })
}

