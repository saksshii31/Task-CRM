const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWR_SECRET;

//generating the token
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET,{
        expiresIn: "1d",
    });
};

//verify token
const verifyToken = (token)=> {
    try{
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken,
};

