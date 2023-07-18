import { contract } from "./contract.js";
import { CONTRACT_ADDRESS, PUBLIC_KEY } from "./config.js";
import { deployFilesToNFTStorage } from "./nftstorage.js";
import fs from "fs/promises";
import path from "path";
import { updateAINFT } from "./db.js";
import { getGasPrice, getNonce, wallet } from "./web3_obj.js";
import ethers from "ethers";
import { launchpad_contract } from "./web3_obj.js";

export async function mintNFT(tokenURI) {
  console.log("\nMinting AINFT...");
  let rawTxn = await contract.safeMint(PUBLIC_KEY, tokenURI);
  let receipt = await rawTxn.wait();

  if (receipt) {
    const event = receipt.events.find((event) => event.event === "Transfer");
    console.log(
      "Transaction successful!!!" +
        "\n" +
        "Transaction Hash:",
      (await rawTxn).hash +
        "\n" +
        "Block Number: " +
        (await receipt).blockNumber +
        "\n" +
        "TokenId: " +
        event.args.tokenId.toNumber()
    );
    return event;
  } else {
    console.log("Error submitting transaction!");
    return null;
  }
}

export async function createAINFT(model_name, model_dir) {
  const final_shards = path.join(model_dir, "final_shards");
  const metadata_file = path.join(model_dir, model_name + "_metadata.json");

  let final_metadata = await deployFilesToNFTStorage(final_shards);
  let tokenList = [];
  for (let i = 0; i < final_metadata.length; i++) {
    let single_metadata = final_metadata[i];
    const tokenURI =
      "https://" + single_metadata.metadataCid + ".ipfs.nftstorage.link";
    let minting_event = await mintNFT(tokenURI);
    single_metadata.tokenId = minting_event.args.tokenId.toNumber();
    tokenList.push(minting_event.args.tokenId.toNumber();)
    //linking ainfts to projects



    try {
      if (await fs.access(metadata_file)) {
        let content = await fs.readFile(metadata_file);
        let model_metadata = JSON.parse(content.toString());
        model_metadata.push(single_metadata);
        await fs.writeFile(metadata_file, JSON.stringify(model_metadata), {
          flag: "w",
        });
      } else {
        await fs.writeFile(metadata_file, JSON.stringify([single_metadata]), {
          flag: "w",
        });
      }
    } catch (err) {
      console.error(err);
      await fs.writeFile(metadata_file, JSON.stringify([single_metadata]), {
        flag: "w",
      });
    }
  }
  try {
    let Project = await launchpad_contract.createAINFT(model_name, CONTRACT_ADDRESS, tokenList );

    Project.wait()
    .then(async (receipt) => {
        console.log(receipt)
        
    })
    .catch(error => {
        console.error('Transaction error:', error);
    });
} catch (error) {
    console.error('Contract interaction error:', error);
}
  console.log("\nAll files processed!");
  console.log("Final metadata file: ", metadata_file);
  return true;
}
