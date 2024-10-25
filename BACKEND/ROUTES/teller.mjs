import express from "express";
import db from "../db/conn.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";
import { RegEx } from "../regex.mjs";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

// Sign up method
router.post("/signup", async (req, res) => {
    const { name, tellerID, isAdmin,  password, confirmPassword } = req.body;

    // Validate the name
    if (!RegEx.testAlphabet(name)) {
        return res.status(400).json({ message: "Invalid name format" });
    }
    if (!RegEx.testNumbers(tellerID)) {
        return res.status(400).json({message: "Invalid ID format" });
    }
    // Test the password strength
    const passwordStrong = RegEx.testPassword(password);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user document
    let newDocument = {
        name: name,
        tellerID: tellerID,
        password: hashedPassword
    };
    if (passwordStrong)
    {
        if(password == confirmPassword)
        {
            try {
                let collection = await db.collection("tellers");
                let result = await collection.insertOne(newDocument);
                console.log(result);
                res.status(201).send(result);
            } catch (error) {
                console.error("Signup error: ", error);
                res.status(500).json({ message: "Something went wrong, please try again." });
            }
        }
        else {
            res.status(500).json({ message: "Passwords don't match"})
        }
    }
    else {
        res.status(500).json({ message: "Password too weak"})
    }
});

// Login method
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { tellerID, password } = req.body;
    console.log(tellerID + " trying to sign in");
    try {
        const collection = await db.collection("tellers");
        const user = await collection.findOne({ tellerID });

        if (!user) {
            return res.status(401).json({ message: "Account number invalid" });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Password incorrect" });
        }

        // Authentication success
        const token = jwt.sign(
            { username: req.body.userID, password: req.body.password },
            "asdFASFLkasdASdASdAfSGASAsfjsSjkdAKJnsdjImCryingkjasDkASd",
            { expiresIn: "1h" }
        );
        res.status(200).json({ message: "Sign in successful", token: token, userID: req.body.userID });
        console.log("Session token: ", token);
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({ message: "Something went wrong, please try again." });
    }
});

export default router;
