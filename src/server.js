import express from "express";
import bodyParser from "body-parser";
import {createAINFTs2} from "./create_ainfts.js";
import multer from 'multer'
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import {AIGENJS_SERVER_PORT} from './config.js'
import {addSmartContract, getAINFTByProjectId, getAINFTProjectById} from './db.js'
import compileAINFTTokenContract from "./CompileAINFTTokenContract.js";
import deployAINFTTokenContract from "./DeployAINFTTokenContract.js";

const upload = multer();
const app = express()

app.use(cors())

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({extended: true}));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));

app.post('/project/ainft', (req, res) => {
    console.log(req.body);
    const projectId = req.body.project_id;

    getAINFTProjectById(projectId, function (project) {
        console.log("Project::", project)
        getAINFTByProjectId(projectId, async function (ainfts) {
            for (const ainft of ainfts) {
                console.log(ainft)
                await createAINFTs2(ainft, project)
            }
        })
    })

    // let aiNFTNotProcessed = [];
    // getAINFTByProjectId(projectId, async function (ainfts) {
    //     for (const ainft of ainfts) {
    //         if (ainft.status !== "created") {
    //             aiNFTNotProcessed.push(ainft.id)
    //         }
    //     }
    // })
    //
    // while (aiNFTNotProcessed.length > 0) {
    //     aiNFTNotProcessed = []
    //     getAINFTByProjectId(projectId, async function (ainfts) {
    //         for (const ainft of ainfts) {
    //             if (ainft.status !== "created") {
    //                 aiNFTNotProcessed.push(ainft.id)
    //             }
    //         }
    //     })
    // }

    res.send({"status": "success", "message": "NFT creation started"})
})

app.get("/metadata", async (req, res) => {
    console.log(req.body);

    let model_name = req.body.model_name;
    let metadata_file = path.join(model_dir, model_name + "_metadata.json")
    return await fs.readFile(metadata_file);
})

app.get("/project/ainft", async (req, res) => {
    const projectId = req.query.project_id;

    let totalAINFTs = 0;
    let processedAINFTs = 0;

    getAINFTByProjectId(projectId, async function (ainfts) {
        totalAINFTs = ainfts.length
        for (const ainft of ainfts) {
            if (ainft.status === "created") {
                processedAINFTs += 1;
            }
        }
    })

    return {"total_ainfts": totalAINFTs, "processed_ainfts": processedAINFTs}
})

/**
 * Compile and deploy the smart contract
 */
app.post("/project/contract", async (req, res) => {
    const tokenName = req.body.token_name;
    const tokenTicker = req.body.token_ticker;
    const projectId = req.body.project_id;

    if (tokenName === null || tokenTicker == null) {
        res.send({"status": "failure", "message": "Provide token name and token ticker"})
    }

    const compiledContractPath = compileAINFTTokenContract(tokenName, tokenTicker)

    let deploymentStatus = "pending";
    deployAINFTTokenContract(tokenName, compiledContractPath, function (contractAddress, compiledContractPath) {
        if (contractAddress) {
            addSmartContract(projectId, {
                address: contractAddress,
                chain: "Mantle",
                projectId: projectId,
                compiledContractPath: compiledContractPath
            }, function (status) {
                if (status === "success") {
                    deploymentStatus = "deployed"
                } else {
                    deploymentStatus = "failed"
                }
            })
        } else {
            deploymentStatus = "failed"
        }
    })

    while (deploymentStatus === "pending") {
    }

    if (deploymentStatus === "deployed") {
        res.send({"status": "success", "message": "Smart contract deployed successfully"})
    } else {
        res.send({"status": "failure", "message": "Smart contract deployment failed"})
    }
})


app.listen(AIGENJS_SERVER_PORT, () => {
    console.log(`Aigenjs is listening on port ${AIGENJS_SERVER_PORT}`)
})
