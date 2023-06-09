import solc from "solc";
import path from "path";
import fs from "fs";
import {fileURLToPath} from 'url'
import {contracts, compile} from 'truffle'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inboxPath = path.resolve(__dirname, 'contracts', 'MLToken.sol'); //current working directory
const source = fs.readFileSync(inboxPath, 'utf8'); //read raw source file



let input = {
    language: 'Solidity',
    sources: {
        'MLToken.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

let output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(output)

// `output` here contains the JSON output as specified in the documentation
for (let contractName in output.contracts['MLToken.sol']) {
    console.log(
        contractName +
        ': ' +
        output.contracts['MLToken.sol'][contractName].evm.bytecode.object
    );
}
