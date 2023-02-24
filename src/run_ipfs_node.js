import * as IPFS from 'ipfs-core'

async function createIPFSNode(){
    const ipfs = await IPFS.create()
    console.log("Ipfs running on,", ipfs)
    return ipfs;
}

createIPFSNode().then((ipfs)=>{
})
