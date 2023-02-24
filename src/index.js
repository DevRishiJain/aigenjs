import {deployFilesToIPFS, downloadFileFromIPFS, deployFileToIPFS} from "./deploy_to_ipfs.js";
import {mintNFT} from "./create_ml_token.js";
import fs from "fs/promises";
import fs1 from "fs"
import path from "path";
import {instantiatePinata, deployFileToPinata} from "./pinata.js";
import {checkStatus, deployFileToNFTStorage, deployFilesToNFTStorage, downloadFile} from "./nftstorage.js";

/**
 * Steps
 * 1. Deploy miniAIs to ipfs
 * 2. Create AI Tokens for the miniAIs
 */
let aigenml_dir = "/Users/apple/AigenProtocol/codebase/aigenml"
let model_name = "mobilenet"
let model_dir = path.join(aigenml_dir, model_name)
let weights_dir = path.join(aigenml_dir, model_name, "final_shards")

async function createModelTokens() {
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

    // let finalMetadata = []
    // let counter = 0;
    // console.log("Final metadata:", finalMetadata)
    //
    // for (const m of metadata) {
    //     console.log(m);
    //     await mintNFT("https://" + m.metadata_cid+".ipfs.nftstorage.link", function (result) {
    //         m.tokenId = result.events.Transfer.returnValues.tokenId
    //         console.log(m)
    //         finalMetadata.push(m)
    //         counter += 1;
    //
    //         if (counter === metadata.length) {
    //             console.log("Final metadata:", finalMetadata)
    //             fs.writeFile(model_name + "_metadata.json", JSON.stringify(finalMetadata)).then(r => {
    //             })
    //         }
    //     })
    // }

    // let metadata2 = await deployFileToNFTStorage(model_name + "_config.json", model_dir)
    // await mintNFT("https://" + metadata2.metadata_cid+".ipfs.nftstorage.link", function (result) {
    //     metadata2.tokenId = result.events.Transfer.returnValues.tokenId
    //     console.log("Token created:", metadata2)
    //     finalMetadata.push(metadata2)
    //     console.log("Final metadata:", finalMetadata)
    //     fs.writeFile(model_name + "_metadata.json", JSON.stringify(finalMetadata)).then(r => {
    //     })
    // })
}

async function downloadFiles() {
    // let finalMetadata = await import("../text_classification_metadata.json", { assert: { type: "json" } })
    // console.log(finalMetadata)

    fs.readFile("mobilenet_metadata.json").then(content=>{
        let finalMetadata = JSON.parse(content.toString())
        for (const metadata3 of finalMetadata) {
            console.log(metadata3)
            if (!fs1.existsSync(path.join(model_dir, "downloaded_shards"))) {
                fs1.mkdirSync(path.join(model_dir, "downloaded_shards"));
            }

            downloadFile("https://" + metadata3.data_cid + ".ipfs.nftstorage.link", path.join(model_dir, "downloaded_shards", metadata3.fileName))

            // downloadFileFromIPFS(metadata3.data_cid, path.join(model_dir, "downloaded_splits", metadata3.fileName)).then(r => {
            // })
        }
    })
}

// createModelTokens().then((res)=>{})

// deployFileToIPFS("text_classification_split_9.json", weights_dir).then(r=>{
//     console.log(r)
// })

// downloadFileFromIPFS("QmWpBbhJAn18ix4HDYCyyBYr8bajbQAZX1rJ66eY4TCy8Q", path.join(model_dir, "downloaded_splits", "abc.json")).then(r => {
//     console.log("file downloaded")
// })

// let content = await import(path.join(model_dir, "weights", "conv1d.json"), { assert: { type: "json" } });
// fs.writeFile("abc.json", JSON.stringify(content)).then(r => {})

// let pinata = instantiatePinata()

// deployFileToPinata("text_classification_split_1.json", weights_dir, {tag1: "text_classification",
//     tag2: "split_9"}, pinata)

// let content = await fs.readFile(path.join(weights_dir, "text_classification_split_1.json"))
//
// content = [content.toString()]

// deployFileToNFTStorage("text_classification_split_1.json", weights_dir).then(r=>{console.log(r)})

// checkStatus("bafybeic4nbwv363aiu5otcwlqdkqeevf3qy4jbhjp6zlangzin476u2aaa").then(r=>{console.log(r)})

// downloadFile("https://bafybeifo4clikg2ezvajkphyptyjggk2tufa7w3wgmetzkukvjfjdg2vpm.ipfs.nftstorage.link",
//     "abc2.json").then(r=>{
//     console.log(r)
// })

//createModelTokens().then(r=>{console.log(r)})

downloadFiles().then(r=>{
    console.log(r)
})
