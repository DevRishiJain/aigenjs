import {Blob} from 'nft.storage'
import fs from "fs";
import fs_promises from "fs/promises";
import path from "path";
import https from "https";
import {client} from "./nftstorage_client.js";
import {encryptDataAES, encryptDataEth, generateInitVector, generateKey} from "./encryption.js";
import {PublicKey} from "./web3_obj.js";



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
//deployFilesToNFTStorage("/Users/devrishijain/Desktop/Aigen/Models/mobilenet/final_shards")
export async function deployFilesToNFTStorage(dirPath) {
    let fileNames = await fs_promises.readdir(dirPath);
    let all_metadata = [];

    for (const fileName of fileNames) {
        console.log("\nProcessing:", fileName)

        console.log("Deploying file to NFTStorage")
        let content = await fs_promises.readFile(path.join(dirPath, fileName))

        // generate key for this file
        let contentPrivateKey = generateKey()
        let contentInitVector = generateInitVector()

        // encrypt content
        console.log("\nEncrypting content...")
        let encryptedContent = encryptDataAES(content.toString(), contentPrivateKey, contentInitVector)
        //console.log("Content encrypted using:", contentPrivateKey.toString('hex'))
        console.log("Content encrypted successfully!")

        let contentKeys = {
            key: contentPrivateKey.toString("hex"),
            iv: contentInitVector.toString("hex")
        }

        // encrypt keys
        console.log("\nEncrypting content keys...")
        let encryptedKeys = encryptDataEth(JSON.stringify(contentKeys), PublicKey)
        console.log("Content keys encrypted successfully!")

        console.log("\nUploading data to NFTStorage...")
        const result = await client.storeBlob(new Blob([encryptedContent]))
        console.log("Data uploaded successfully!")

        console.log("\nUploading metadata to NFTStorage...")
        let result1 = await client.storeBlob(new Blob([JSON.stringify({
            name: fileName, cid: result.toString(),
            keys: encryptedKeys
        })]))
        console.log("Metadata uploaded successfully!")

        let final_metadata = {
            fileName: fileName,
            dataCid: result.toString(),
            format: "json",
            metadataCid: result1.toString()
        }
        all_metadata.push(final_metadata)
    }

    return all_metadata;
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