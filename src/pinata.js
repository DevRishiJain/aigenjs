import pinataSDK from "@pinata/sdk"
import {PINATA_API_KEY, PINATA_SECRET_API_KEY} from "./config.js";
import fs from "fs";
import path from "path";

export function instantiatePinata(){
    let pinata = new pinataSDK(PINATA_API_KEY,
        PINATA_SECRET_API_KEY)

    pinata.testAuthentication().then((result) => {
        //handle successful authentication here
        console.log(result);
    }).catch((err) => {
        //handle error here
        console.log(err);
    });

    return pinata;
}

export function deployFileToPinata(fileName, filePath, tags, pinata){
    const readableStreamForFile = fs.createReadStream(path.join(filePath, fileName));
    const options = {
        pinataMetadata: {
            name: fileName,
            keyvalues: tags
        },
        pinataOptions: {
            cidVersion: 0
        }
    };
    pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
        //handle results here
        console.log(result);
    }).catch((err) => {
        //handle error here
        console.log(err);
    });
}