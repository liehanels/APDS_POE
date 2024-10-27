import checkauth from "../check-auth.mjs";
import express from "express"
import db from "../db/conn.mjs";
import { RegEx } from "../regex.mjs";
import mongoose from 'mongoose';
import Transaction from "../model/transactionModel.mjs";

import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.ATLAS_URI || "";

const router = express.Router();

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
  });
  
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Connection to MongoDB closed due to application termination');
    process.exit(0);
  });
  
//get all transactions for a user
router.get("/transactions", checkauth, async (req, res) => {
    try {
        const accountnum = req.query.accountnum;
        const collection = await db.collection("transactions");
        if (accountnum != null){
            const transactions = await collection.find({ accountnum: accountnum }).toArray();
            res.status(200).send(transactions);
        } else {
            const transactions = await collection.find().toArray();
            res.status(200).send(transactions);
        }
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
        const isValidUser = RegEx.testAlphanumerical(req.body.accountnum);
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
            accountnum: req.body.accountnum,
            transactionAmount: req.body.transactionAmount,
            transactionAddress: req.body.transactionAddress,
            transactionStatus: "Pending"
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
router.patch('/transactions/:id', async (req, res) => {
    console.log('PATCH /transactions/:id called with ID:', req.params.id);
    try {
      const { status } = req.body;
      const { id } = req.params;
      
      // Check MongoDB connection state
      if (mongoose.connection.readyState !== 1) {
        console.log('MongoDB connection not ready:', mongoose.connection.readyState);
        return res.status(500).json({ message: 'MongoDB connection not ready' });
      }
  
      let transaction;
      try {
        const objectId = new mongoose.Types.ObjectId(id);
        transaction = await Transaction.findById(objectId);
      } catch (e) {
        console.log('Invalid ObjectId format:', id);
        return res.status(400).json({ message: 'Invalid ObjectId format' });
      }
  
      if (!transaction) {
        console.log('Transaction not found for ID:', id);
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      transaction.transactionStatus = status;
      await transaction.save();
      console.log('Transaction updated:', transaction);
  
      res.status(200).json(transaction);
    } catch (error) {
      console.log('Error:', error);
      res.status(500).json({ message: 'Error updating transaction status', error });
    }
  });
  
export default router;