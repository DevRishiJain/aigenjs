import {NFTStorage, File, Blob} from 'nft.storage'
import fs from "fs";
import fs_promises from "fs/promises";
import {deployFileToIPFS} from "./deploy_to_ipfs.js";
import path from "path";
import https from "https";

const client = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEE0ZDQ1NTFiQkU2NmRCZWNEOTUwOWEyOGNmRjU0YjFlOEJmNmE0RTQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NjM2NzM5ODMyMywibmFtZSI6IkFpZ2VuIFByb3RvY29sIn0.x6vCYM0E_QQbtviGb4yR1208v6tgdJXIhlSmbsG6p40' })

export async function deployFileToNFTStorage(fileName, filePath, func) {
    let content = await fs_promises.readFile(path.join(filePath, fileName))
    const result = await client.storeBlob(new Blob([content.toString()]))
    console.log("Data uploaded:", result)

    let result1 = await client.storeBlob(new Blob([JSON.stringify({name: fileName, cid: result.toString()})]))
    console.log("Metadata uploaded:", result1)

    await func({fileName: fileName, data_cid: result.toString(), format: "json", metadata_cid: result1.toString()})
    //return {fileName: fileName, data_cid: result.toString(), format: "json", metadata_cid: result1.toString()}
}

export async function checkStatus(cid){
    return await client.status(cid);
}

export async function deployFilesToNFTStorage(dirPath, func){
    let fileNames = await fs_promises.readdir(dirPath);
    //let metadata = []

    for(const fileName of fileNames){
        await deployFileToNFTStorage(fileName, dirPath, async function (single_metadata) {
            await func(single_metadata)
        })

        //metadata.push(single_metadata)
    }

    //return metadata;
}

export async function downloadFile(url, filePath){
    const file = fs.createWriteStream(filePath);
    const request = https.get(url, function(response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            console.log("Download Completed");
        });
    });
}