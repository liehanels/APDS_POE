import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

//sign up method
router.post("/signup", async (req, res) => {
    const password = bcrypt.hash(req.body.password, 10)
    let newDocument = {
        name: req.body.name,
        password: (await password).toString()
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);
    console.log(result);
    res.send(result).status(204);
})

//login method
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { name, password } = req.body;
    console.log(name + " trying to sign in")

    try {
        const collection = await db.collection("users");
        const user = await collection.findOne({ name });

        if (!user) {
            return res.status(401).json({ message: "Username invalid"});
        }
        //compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Password incorrect"});
        }
        else {
            //authentication success
            const token = jwt.sign({username:req.body.username, password:req.body.password},"asdFASFLkasdASdASdAfSGASAsfjsSjkdAKJnsdjImCryingkjasDkASd", {expiresIn:"1h"})
            res.status(200).json({ message: "Sign in successful", token: token, name: req.body.name});
            console.log("Session token: ", token)
        }
    }
    catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({ message: "Something went wrong, please try again."});
    }
});

export default router;