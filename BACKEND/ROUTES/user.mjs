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
    const { name, accountnum, password, confirmPassword } = req.body;

    // Validate the name
    if (!RegEx.testAlphabet(name)) {
        return res.status(400).json({ message: "Invalid name format" });
    }
    if (!RegEx.testAlphanumerical(accountnum)) {
        return res.status(400).json({message: "Invalid ID format" });
    }
    // Test the password strength
    const passwordStrong = RegEx.testPassword(password);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user document
    let newDocument = {
        name: name,
        accountnum: accountnum,
        password: hashedPassword,
        role: "user"
    };
    if (passwordStrong)
    {
        if(password == confirmPassword)
        {
            try {
                let collection = await db.collection("users");
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
    const { name, accountnum, password } = req.body;
    console.log(name + " trying to sign in");

    try {
        const collection = await db.collection("users");
        const user = await collection.findOne({ accountnum });

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
            { username: req.body.accountnum, password: req.body.password },
            "asdFASFLkasdASdASdAfSGASAsfjsSjkdAKJnsdjImCryingkjasDkASd",
            { expiresIn: "1h" }
        );
        res.status(200).json({ message: "Sign in successful", token: token, accountnum: req.body.accountnum });
        console.log("Session token: ", token);
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({ message: "Something went wrong, please try again." });
    }
});

router.get('/checkUser', authenticateJWT, async (req, res) => { 
    console.log("Checking user");

    // Access accountnum from the request body (as sent by the frontend)
    const accountnum = req.query.accountnum; 

    try {
        const collection = db.collection("users");
        const user = await collection.findOne({ accountnum: accountnum }); 

        if (user) {
            return res.status(200).json({ 
                message: "User found", 
                role: user.role 
            });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) { 
        console.error("Error checking user:", error);
        return res.status(500).json({ message: "Internal server error" }); 
    }
});

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; 

        jwt.verify(token, "asdFASFLkasdASdASdAfSGASAsfjsSjkdAKJnsdjImCryingkjasDkASd", (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }

            req.user = user; 
            next(); 
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
}

export default router;
