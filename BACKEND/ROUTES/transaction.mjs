import checkauth from "../check-auth.mjs";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import { RegEx } from "../regex.mjs";
import dotenv from "dotenv";

dotenv.config();
const mongoURI = process.env.ATLAS_URI || "";
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const router = express.Router();

// Connect to MongoDB
async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
  }
}
connectToDB();

process.on('SIGINT', async () => {
  await client.close();
  console.log('Connection to MongoDB closed due to application termination');
  process.exit(0);
});

// Get all transactions for a user
router.get("/transactions/userlist", checkauth, async (req, res) => {
  try {
    const accountnum = req.query.accountnum;
    const collection = client.db("users").collection("transactions");
    let transactions;
    if (accountnum != null) {
      transactions = await collection.find({ accountnum: accountnum, }).toArray();
    } else {
      transactions = await collection.find().toArray();
    }
    res.status(200).send(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send({ error: "An error occurred while fetching transactions." });
  }
});

// Get all transactions for a user
router.get("/transactions", checkauth, async (req, res) => {
  try {
    const accountnum = req.query.accountnum;
    const collection = client.db("users").collection("transactions");
    let transactions;

    if (accountnum != null) {
      transactions = await collection.find({ 
        accountnum: accountnum,
        transactionStatus: "Pending"
      }).toArray();
    } else {
      transactions = await collection.find({ 
        transactionStatus: "Pending"
      }).toArray();
    }

    res.status(200).send(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send({ error: "An error occurred while fetching transactions." });
  }
});


// Create a new transaction
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
      isValidTransactionAddress,
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
      transactionStatus: "Pending",
    };

    // Log the new document before inserting
    console.log("New Document:", newDocument);

    const collection = client.db("users").collection("transactions");
    let result = await collection.insertOne(newDocument);

    // Log the result of the insertion
    console.log("Insertion Result:", result);

    // Send a clear response with the inserted document and any additional data
    res.status(201).send({
      message: "Transaction successfully created",
      transaction: newDocument,
      token: req.headers.authorization.split(" ")[1], // Assuming the token is in the Authorization header
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "An error occurred while processing the transaction." });
  }
});

// Update a transaction status
router.patch('/transactions/:id', async (req, res) => {
  console.log('PATCH /transactions/:id called with ID:', req.params.id);
  try {
    const { transactionStatus } = req.body;
    const { id } = req.params;

    let transaction;
    try {
      const objectId = new ObjectId(id);
      const collection = client.db("users").collection("transactions");
      transaction = await collection.findOne({ _id: objectId });

      if (!transaction) {
        console.log('Transaction not found for ID:', id);
        return res.status(404).json({ message: 'Transaction not found' });
      }

      // Update the transaction status
      const updatedTransaction = await collection.updateOne(
        { _id: objectId },
        { $set: { transactionStatus: transactionStatus } }
      );

      console.log('Transaction updated:', updatedTransaction);
      res.status(200).json(updatedTransaction);
    } catch (e) {
      console.log('Invalid ObjectId format:', id);
      return res.status(400).json({ message: 'Invalid ObjectId format' });
    }
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: 'Error updating transaction status', error });
  }
});

export default router;
