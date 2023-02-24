import fs_promises from 'fs/promises';
import fs from "fs";
import {ipfs} from "./ipfs_obj.js";
import {changeExtension} from "./utils.js"
import path from "path";
import * as https from "https";

export async function deployFileToIPFS(fileName, filePath){
    let result = await uploadFileToIPFS(fileName, filePath);
    console.log("Data deployed:", result);

    let result1 = await uploadContentToIPFS("metadata_"+fileName,
        JSON.stringify({name: fileName,
            cid: result.cid.toString()}))
    console.log("Metadata deployed:", result);

    return {fileName: fileName, data_cid: result.cid.toString(), format: "json", metadata_cid: result1.cid.toString()}
}

export async function deployFilesToIPFS(dirPath){
    let fileNames = await fs_promises.readdir(dirPath);
    let metadata = []

    for(const fileName of fileNames){
        let single_metadata = await deployFileToIPFS(fileName, dirPath)
        metadata.push(single_metadata)
    }

    return metadata;

    // fs.readdir(VGG16_WEIGHTS_DIR).then((fileNames)=>{
    //     for (const fileName of fileNames.splice(0, 1)) {
    //
    //         await uploadFile(fileName, VGG16_WEIGHTS_DIR+fileName);
    //
    //         fs.readFile(VGG16_WEIGHTS_DIR+fileName, 'utf-8').then(async (content) => {
    //             console.log(content)
    //             // store weights in ipfs
    //             let result = await ipfs.add({path: fileName, content: content});
    //             console.log(result);
    //
    //             // store metadata
    //             let result1 = await ipfs.add({path: changeExtension("config_"+fileName, ".json"), content: JSON.stringify({name: fileName,
    //                     cid: result.cid.toString()})});
    //
    //             // store ipfs cids
    //             await fs.appendFile("weights_cids.json", JSON.stringify({fileName: fileName, data_cid: result.cid.toString(), format: "json", metadata_cid: result1.cid.toString()}));
    //             console.log("cid appended");
    //
    //             func({fileName: fileName, data_cid: result.cid.toString(), format: "json", metadata_cid: result1.cid.toString()})
    //         }).catch((err)=>{
    //             console.log(err);
    //         });
    //     }
    // }).catch((error)=>{
    //     console.log(error);
    // });
}

async function uploadFileToIPFS(fileName, filePath){
    //let content = await import(path.join(filePath, fileName), { assert: { type: "json" } });
    let content = fs.readFileSync(path.join(filePath, fileName), 'utf-8')
    return uploadContentToIPFS(fileName, content)
}

async function uploadContentToIPFS(fileName, content){
    return await ipfs.add({path: fileName, content: JSON.stringify(content)}, {wrapWithDirectory: true,
        progress: (prog) => console.log(`received: ${prog}`)});
}

export async function downloadFileFromIPFS(cid, filePath){
    const chunks = [];
    for await (const chunk of ipfs.get(cid)) {
        chunks.push(chunk);
        console.log(chunk.toString());
    }

    await fs_promises.writeFile(filePath, chunks.toString());
}
