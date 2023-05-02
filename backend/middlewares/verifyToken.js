const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const getToken = require("../helpers/get-token");

const checkToken = (req,res,next) => {

    if(!req.headers.authorization){
        res.status(401).json({
            errors: ["Acesso Negado!"]
        })
        return;
    }

    const token = getToken(req);

    if(!token){
        res.status(401).json({
            errors: ["Acesso negado!"]
        })
        return;
    }

    try{

        const verified = jwt.verify(token, secret)

        req.user = verified;

        next();

    }catch(err){

        return res.status(400).json({errors: "Token inválido"})

    }

}

module.exports = checkToken;