const loginValidator = (req, res, next) => {
    const {email, password} = req.body;
    const payload = {email, password};
    for(let elem in payload){
        if(!payload[elem]){
            return res.status(400).send({msg:`Please provide ${elem}`});
        }
    }
    if(password.length < 5){
        return res.status(400).send({msg:`Password should have minimin 5 characters`});
    }
    let arr = email.split("");
    if(!arr.includes('@') || !arr.includes('.')){
        return res.status(400).send({msg:`Invalid Email`});
    }
    next();
}

module.exports = {
    loginValidator
}