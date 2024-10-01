import checkauth from "../check-auth.mjs";
import express from "express"
import db from "../db/conn.mjs";

const router = express.Router();

//get all transactions
router.get("/", checkauth, async (req, res) => {
    let collection = await db.collection("transactions");
    let results = await collection.find({}).toArray;
    res.send(results).status(200);
});

//new transaction
router.post("/newtransaction", checkauth, async (req, res) => {
    let newDocument = {
        user: req.body.user,
        transactionAmount: req.body.transactionAmount,
        transactionAddres: req.body.transactionAddres
    };
    let collection = await db.collection("transactions");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});
export default router;