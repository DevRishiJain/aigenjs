import {web3} from "./web3_obj.js";
import {CONTRACT_ADDRESS} from "./config.js";

import { readFile } from 'fs/promises';
const json = JSON.parse(
    await readFile(
        new URL('./mltoken_abi.json', import.meta.url)
    )
);

export const contract = new web3.eth.Contract(json, CONTRACT_ADDRESS)