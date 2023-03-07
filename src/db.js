import sqlite3 from "sqlite3";
import {DATABASE_PATH} from './config.js'

let db = new sqlite3.Database(DATABASE_PATH, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});

export function getAINFTProjectById(projectId, func) {
    db.get(`SELECT * FROM ainft_project WHERE id=${projectId}`, [], (err, row) => {
        if (err) {
            throw err;
        }
        console.log(row)
        func(row)
    });
}

export function getAllAINFTProjects(func){
    db.all(`SELECT * FROM ainft_project`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        func(rows)
    });
}

export function getAINFTByProjectId(projectId, func){
    db.all(`SELECT * FROM ainft WHERE projectId=${projectId}`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        func(rows)
    });
}

export function getAINFTById(id, func){
    db.get(`SELECT * FROM ainft WHERE id=${id}`, [], (err, row) => {
        if (err) {
            throw err;
        }
        func(row)
    });
}

export function updateAINFT(ainft, values){
    let values1 = [values.dataCid, values.metadataCid, values.format, values.tokenId, "created", ainft.id]

    let query = `UPDATE ainft SET dataCid=?, metadataCid=?, format=?,
        tokenId=?, status=? WHERE id=?`
        
    db.run(query, values1, (err) => {
        if (err) {
            throw err;
        }
        console.log("AI NFT updated")
    });
}

export default db;