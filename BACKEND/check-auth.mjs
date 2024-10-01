import jwt from "jsonwebtoken"

const checkauth=(req, res, next) =>
{
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "asdFASFLkasdASdASdAfSGASAsfjsSjkdAKJnsdjImCryingkjasDkASd")
        next();
    }
    catch(error)
    {
        res.status(401).json({
            message: "Invalid token"
        });
    }
};

export default checkauth