const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user.model');

const Authenticator = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(401).send({msg:'Please login to continue'});
    }
    let token = req.headers.authorization.split(" ");
    token = token[token.length-1];
    jwt.verify(token,process.env.key,async (err, decoded) => {
        if(err){
            return res.status(401).send({msg:'Token validation failed, Please login again'});
        }
        const user = await userModel.findOne({email: decoded.email});
        if(!user){
            return res.status(400).send({msg:'Access denied'});
        }
        req.body.user = decoded;
        next();
    })
}

module.exports = {
    Authenticator
}