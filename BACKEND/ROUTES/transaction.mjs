import checkauth from "../check-auth.mjs";
import express from "express"
import db from "../db/conn.mjs";
import { RegEx } from "../regex.mjs";

const router = express.Router();

//get all transactions for a user
router.get("/transactions", checkauth, async (req, res) => {
    try {
        const userName = req.query.name; // Assuming the user's name is passed as a query parameter
        const collection = await db.collection("transactions");
        const transactions = await collection.find({ user: userName }).toArray();

        res.status(200).send(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).send({ error: "An error occurred while fetching transactions." });
    }
});

router.post("/newtransaction", checkauth, async (req, res) => {
    try {
        // Log the incoming request body
        console.log("Request Body:", req.body);

        // Validate inputs
        const isValidUser = RegEx.testAlphabet(req.body.user);
        const isValidTransactionAmount = RegEx.testNumbers(req.body.transactionAmount);
        const isValidTransactionAddress = RegEx.testAlphanumerical(req.body.transactionAddress);

        // Log validation results for debugging
        console.log("Validation Results:", {
            isValidUser,
            isValidTransactionAmount,
            isValidTransactionAddress
        });

        // Check if all validations pass
        if (!isValidUser || !isValidTransactionAmount || !isValidTransactionAddress) {
            return res.status(400).send({ error: "Invalid input data" });
        }

        // Create the new document with the actual values
        let newDocument = {
            user: req.body.name,
            transactionAmount: req.body.transactionAmount,
            transactionAddress: req.body.transactionAddress
        };

        // Log the new document before inserting
        console.log("New Document:", newDocument);

        let collection = await db.collection("transactions");
        let result = await collection.insertOne(newDocument);

        // Log the result of the insertion
        console.log("Insertion Result:", result);

        // Send a clear response with the inserted document and any additional data
        res.status(201).send({
            message: "Transaction successfully created",
            transaction: newDocument,
            token: req.headers.authorization.split(" ")[1] // Assuming the token is in the Authorization header
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "An error occurred while processing the transaction." });
    }
});

export default router;