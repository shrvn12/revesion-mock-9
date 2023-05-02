const registrationValidator = (req, res, next) => {
    const {name, email, password, dob, bio} = req.body;
    const payload = {name, email, password, dob, bio};
    for(let elem in payload){
        if(!payload[elem]){
            return res.status(400).send({msg:`Please provide ${elem}`});
        }
    }
    if(new Date(dob) == 'Invalid Date'){
        return res.status(400).send({msg:`Date should be in format YYYY-MM-DD`});
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
    registrationValidator
}