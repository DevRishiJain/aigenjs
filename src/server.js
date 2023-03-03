import express from 'express'
import {createAINFTs} from "./create_ainfts.js"

const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')

    createAINFTs("/").then(r => {
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})