import solc from "solc";
import {fileURLToPath} from "url";
import path from "path";
import fs from 'fs'
import fsExtra from "fs-extra";

function createInput(tokenName, tokenTicker) {
    const currentTokenName = 'AINFTToken.sol'
    const currentTokenTicker = "AINFT"
    const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    const inboxPath = path.resolve(__dirname, 'contracts', currentTokenName); //current working directory
    let source = fs.readFileSync(inboxPath, 'utf8').replaceAll(currentTokenName, tokenName).replaceAll(currentTokenTicker, tokenTicker); //read raw source file
    let sources = {}
    sources[tokenName+".sol"] = {content: source}

    return {
        language: 'Solidity',
        sources: sources, settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };
}

function findImports(relativePath) {
    //my imported sources are stored under the node_modules folder!
    const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    const absolutePath = path.resolve(__dirname, 'node_modules', relativePath);
    const source = fs.readFileSync(absolutePath, 'utf8');
    return {contents: source};
}

export default function compileAINFTTokenContract(tokenName, tokenTicker) {
    const input = createInput(tokenName, tokenTicker)
    const buildPath = path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), "build");
    const contractsPath = path.resolve(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), "contracts");

    // Removes folder build and every file in it
    fsExtra.removeSync(buildPath);

    let output = JSON.parse(solc.compile(JSON.stringify(input), {import: findImports})).contracts;
    console.log(output)
    // `output` here contains the JSON output as specified in the documentation
    for (const contractName in output[tokenName+'.sol']) {
        console.log(contractName + ': ' + output[tokenName+'.sol'][contractName].evm.bytecode.object);
    }
    // if (!fs.existsSync(buildPath)){
    //     fs.mkdirSync(buildPath);
    // }

    // Re-Create build folder for output files from each contract
    fsExtra.ensureDirSync(buildPath);

    const filePath = path.join(buildPath, tokenName + ".json")

    //output = output.contracts['AINFTToken.sol'][tokenName]

    //const buildPath = path.resolve(__dirname, 'build');

    // Output contains all objects from all contracts
    // Write the contents of each to different files
    for (let contract in output) {
        console.log(contract)
        fsExtra.outputJsonSync(
            filePath,
            output[contract]
        );
    }

    console.log('Contract compiled successfully!')

    //writeOutput(output, buildPath);

    // fs.writeFile(filePath, JSON.stringify(output), "utf8", ()=>{
    //     console.log('Written to file')
    // })

    return filePath
}

function writeOutput(compiled, buildPath) {
    for (let contractFileName in compiled.contracts) {
        const contractName = contractFileName.replace('.sol', '');
        console.log('Writing: ', contractName + '.json');
        // fsExtra.outputJsonSync(
        //     path.resolve(buildPath, contractName + '.json'),
        //     compiled.contracts[contractFileName].basic
        // );

        fs.writeFile(path.resolve(buildPath, contractName + '.json'),
            JSON.stringify(compiled.contracts[contractFileName]), "utf8", () => {
            })

        console.log('Contract compiled successfully!')
    }
}

// const contractPath = compileAINFTTokenContract("PLTToken", "PLT")
// console.log(contractPath)

// import path from "path";
// import fs from "fs";
// import {fileURLToPath} from "url";
// import ethers from "@nomiclabs/hardhat-ethers";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// async function main() {
//     const arg1 = "MLToken";
//     const arg2 = "MLT";
//     const arg3 = 100000;
//     const MyContract = await ethers.getContractFactory("MLToken");
//     const myContract = await MyContract.deploy(arg1, arg2, arg3);
//
//     await myContract.deployed();
//
//     console.log(`MLT Token deployed to ${myContract.address}`);
//
//     //wait for 5 block transactions to ensure deployment before verifying
//     await myContract.deployTransaction.wait(5);
//
//     //verify (source: https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan#using-programmatically)
//     await hardhat.run("verify:verify", {
//         address: myContract.address,
//         contract: "contracts/MyContract.sol:MyContract", //Filename.sol:ClassName
//         constructorArguments: [arg1, arg2, arg3],
//     });
// }
//
// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });
