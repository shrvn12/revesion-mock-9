const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user.model');
const { registrationValidator } = require('../middlewares/registration.validator');
const { loginValidator } = require('../middlewares/login.validator');
const { Authenticator } = require('../middlewares/authenticator');
const userRouter = express.Router();

userRouter.post('/register',registrationValidator, async (req, res) => {
    const {name, email, password, dob, bio} = req.body;
    const payload = {name, email, password, dob, bio};
    const exist = await userModel.findOne({email});
    if(exist){
        return res.status(409).send({msg: 'Account already exists'});
    }
    payload.password = bcrypt.hashSync(payload.password,+process.env.slatRounds);
    const user = new userModel(payload);
    await user.save();
    res.status(201).send({msg: 'Registration Successful'});
})

userRouter.post('/login',loginValidator, async (req, res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).send({msg: 'Account does not exist'});
    }
    bcrypt.compare(password,user.password,(err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({msg: 'Something went wrong, please try again'});
        }
        else if(result){
            const payload = {
                name: user.name,
                email: user.email,
                password: user.password,
                dob: user.dob,
                bio: user.bio,
                posts: user.posts,
                friends:user.friends,
                friendRequests: user.friendRequests
            }
            const token = jwt.sign(payload,process.env.key);
            res.status(202).send({msg:'Login Successful', token});
        }
        else{
            res.status(401).send({msg:'Password do not match'});
        }
    });

})

userRouter.get('/users', Authenticator,async (req, res) => {
    const data = await userModel.find();
    res.status(200).send({size:data.length, data});
})

userRouter.get('/users/:id/friends',async (req, res) => {
    let id = req.params.id;
    if(id.length < 24){
        return res.status(400).send({msg:'Invalid ID'});
    }
    const user = await userModel.findById(id);
    res.status(200).send(user.friends);
})

userRouter.post('/users/:id/friends',Authenticator,async (req, res) => {
    let id = req.params.id;
    if(id.length < 24){
        return res.status(400).send({msg:'Invalid ID'});
    }
    let user = await userModel.findById(id);
    let curuser = await userModel.findOne({email: req.body.user.email});
    user.friendRequests.push(curuser);
    await userModel.findByIdAndUpdate(id,user);
    res.status(201).send({msg: 'Friend request sent'});
})

userRouter.patch('/users/:id/friends/:friendId',async (req, res) => {
    let id = req.params.id;
    let fid = req.params.friendId;
    let {accept} = req.body;
    if(accept !== true && accept !== false){
        return res.status(400).send({msg: 'Please provide accept status as accept:true or accept:false'});
    }
    if(id.length < 24){
        return res.status(400).send({msg:'Invalid ID'});
    }
    let user = await userModel.findById(id);
    let freind = await userModel.findById(fid);
    let arr = [];
    for(let elem of user.friendRequests){
        if(elem.email == freind.email && accept){
            user.friends.push(elem);
        }
        else if(elem.email !== freind.email){
            console.log(elem.email,freind.email);
            arr.push(elem);
        }
    }
    user.friendRequests = arr;
    await userModel.findByIdAndUpdate(id, user);
    res.sendStatus(204);
})

module.exports = {
    userRouter
}