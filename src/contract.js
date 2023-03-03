import {web3} from "./web3_obj.js";
import {CONTRACT_ADDRESS} from "./config.js";
import {readFile} from 'fs/promises';

const abi = JSON.parse(
    await readFile(
        new URL('./ainft_abi.json', import.meta.url)
    )
);

export const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS)