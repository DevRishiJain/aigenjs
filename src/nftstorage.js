import {Blob} from 'nft.storage'
import fs from "fs";
import fs_promises from "fs/promises";
import path from "path";
import https from "https";
import {client} from "./nftstorage_client.js";

export async function deployFileToNFTStorage(fileName, filePath, func) {
    console.log(fileName, filePath)
    let content = await fs_promises.readFile(path.join(filePath, fileName))
    const result = await client.storeBlob(new Blob([content.toString()]))
    console.log("Data uploaded:", result)

    let result1 = await client.storeBlob(new Blob([JSON.stringify({name: fileName, cid: result.toString()})]))
    console.log("Metadata uploaded:", result1)

    await func({fileName: fileName, dataCid: result.toString(), format: "json", metadataCid: result1.toString()})
}

export async function checkStatus(cid) {
    return await client.status(cid);
}

export async function deployFilesToNFTStorage(dirPath, func) {
    console.log("Dirpath:", dirPath)
    let fileNames = await fs_promises.readdir(dirPath);
    console.log("Filenames:", fileNames)
    for (const fileName of fileNames) {
        console.log(fileName)
        await deployFileToNFTStorage(fileName, dirPath, async function (single_metadata) {
            await func(single_metadata)
        })
    }
}

export async function downloadFileFromNFTStorage(url, filePath) {
    const file = fs.createWriteStream(filePath);
    const request = https.get(url, function (response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            console.log("Download Completed");
        });
    });
}