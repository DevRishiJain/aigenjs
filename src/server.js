import express from "express";
import bodyParser from "body-parser";
import {createAINFT} from "./create_ainfts.js";
import multer from 'multer'
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import {AIGENJS_SERVER_PORT, MODELS_DIR} from './config.js'
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

app.post('/project/ainft_create', async (req, res) => {
    console.log(req.body);
    const projectId = req.body.project_id;

    let ainft_results = await createAINFT(projectId,MODELS_DIR + projectId)
    console.log(ainft_results)



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

// Saving and loading w3name Keys


app.post('/saveSigningKey', async (req, res) => {

    const { keys, projectId } = req.body;
    console.log(keys,projectId)
    let filepath = MODELS_DIR + projectId + "-w3keys.txt";
    try {
      await fs.writeFile(filepath, keys);
      res.status(200).json({ message: 'Signing key saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save signing key' });
    }
  });
  
  
  app.post('/loadSigningKey', async (req, res) => {
    const projectId = req.body.projectId;
    let filename = MODELS_DIR + projectId + "-w3keys.txt";
    try {
      const keys = JSON.parse((await fs.readFile(filename)).toString())
      res.status(200).json({ keys });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to load signing key' });
    }
  });


app.listen(AIGENJS_SERVER_PORT, () => {
    console.log(`Aigenjs is listening on port ${AIGENJS_SERVER_PORT}`)
})
