const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const User = require("../models/User");

//Get user by jwt token
const getUserByToken = async(token) => {

    if(!token){
        res.status(401).json({
            errors: "Acesso negado!"
        })
        return;
    }

    const decoded = jwt.verify(token, secret);

    const userId = decoded.id
    
    const user = await User.findOne({_id: userId}).select("-password")

    return user;

}

module.exports = getUserByToken;