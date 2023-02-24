const path = require("path")
const fs = require("fs")
const solc = require("solc")

const helloPath = path.resolve(__dirname, 'contracts', 'SuperBlock.sol')
const source = fs.readFileSync(helloPath, 'UTF-8')

solc.compile(source, 1).contracts[':SuperBlock']
