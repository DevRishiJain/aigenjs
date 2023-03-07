import {contract} from "./contract.js";
import {PUBLIC_KEY} from "./config.js";
import {deployFilesToNFTStorage, deployFileToNFTStorage} from "./nftstorage.js";
import fs1 from "fs";
import fs from "fs/promises";
import path from "path";
import fs_promises from "fs/promises";
import {updateAINFT} from "./db.js";

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
export async function createAINFTs(model_name, model_dir) {
    const final_shards = path.join(model_dir, "final_shards")
    const metadata_file = path.join(model_dir, model_name+"_metadata.json")

    await deployFilesToNFTStorage(final_shards, async function (metadata) {
        console.log("Metadata initial:", metadata)
        await mintNFT("https://" + metadata.metadataCid + ".ipfs.nftstorage.link", async function (result) {
            metadata.tokenId = result.events.Transfer.returnValues.tokenId
            console.log("Metadata:", metadata)
            try {
                if (fs1.existsSync(metadata_file)) {
                    //file exists
                    fs.readFile(metadata_file).then(content=>{
                        let model_metadata = JSON.parse(content.toString())
                        model_metadata.push(metadata)

                        fs.writeFile(metadata_file, JSON.stringify(model_metadata), { flag: 'w' }).then(r => {
                        })
                    })
                }else{
                    fs.writeFile(metadata_file, JSON.stringify([metadata]),{flag: 'w'}).then(r=>{
                    })
                }
            } catch(err) {
                console.error(err)
                fs.writeFile(metadata_file, JSON.stringify([metadata]),{flag: 'w'}).then(r=>{
                })
            }
        })
    })

    let fileNames = await fs_promises.readdir(final_shards);

    let allFilesProcessed = false;

    while (!allFilesProcessed){
        fs.readFile(metadata_file).then(content => {
            let model_metadata = JSON.parse(content.toString())

            for(const fileName in fileNames){
                allFilesProcessed = searchFileNameInMetadata(fileName, model_metadata);
            }
        });
    }

    if(allFilesProcessed){
        console.log("All files processed")
        return true;
    }
}

export async function createAINFTs2(ainft, ainft_project){
    console.log("AINFT", ainft)
    console.log("Project:", ainft_project)
    await deployFileToNFTStorage(ainft.fileName, ainft_project.model_dir, async function (metadata) {
        await mintNFT("https://" + metadata.metadataCid + ".ipfs.nftstorage.link", async function (result) {
            console.log("Result:", result)
            metadata.tokenId = result.events.Transfer.returnValues.tokenId
            updateAINFT(ainft, metadata)
        })
    })
}

function searchFileNameInMetadata(fileName, model_metadata){
    for(const single_metadata in model_metadata){
        if(single_metadata.fileName === fileName){
            return true;
        }
    }
    return false
}

