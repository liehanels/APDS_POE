import jwt from "jsonwebtoken"

const checkauthEmployee=(req, res, next) =>
    {
        try {
            const token = req.headers.authorization.split(" ")[1];
            jwt.verify(token, "asdFASFLkasdASdASdAfSGAimnotcryingimjusthappysfjsSjkdAKJnsdjkjasDkASd")
            next();
        }
        catch(error)
        {
            res.status(401).json({
                message: "Invalid token"
            });
        }
    };

export default checkauthEmployee