//imports
import cors from "cors";
import express from "express";
import fs from "fs";
import https from "https";
import users from "./ROUTES/user.mjs";
import transactions from "./ROUTES/transaction.mjs";
//vars
const PORT = 3001;
const app = express();

const options = {
    key: fs.readFileSync('KEYS/privatekey.pem'),
    cert: fs.readFileSync('KEYS/certificate.pem')
}
//server code
app.use(cors());
app.use(express.json());

app.use((reg,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    res.setHeader("Access-Control-Allow-Methods","*");
    next();
})

app.use("/user",users);
app.route("/user",users);
app.use("/transaction", transactions);
app.route("/transaction", transactions);

let server = https.createServer(options,app)
console.log(PORT, " is running server successfully")
server.listen(PORT);