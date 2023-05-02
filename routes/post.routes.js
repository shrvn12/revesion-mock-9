const express = require('express');
const { postModel } = require('../models/post.model');
const { Authenticator } = require('../middlewares/authenticator');
const { userModel } = require('../models/user.model');

const postRouter = express.Router();

postRouter.get('/posts',async (req, res) => {
    const data = await postModel.find();
    res.status(200).send({size: data.length, data});
})

postRouter.get('/posts/:id',async (req, res) => {
    let id = req.params.id;
    if(id.length < 24){
        return res.status(400).send({msg:'Invalid ID'});
    }
    const data = await postModel.findById(id);
    res.status(200).send({size: data.length, data});
})

postRouter.post('/posts',Authenticator,async (req, res) => {
    const {text, image} = req.body;
    if(!text){
        return res.status(400).send({msg:'Please provide some text...'});
    }

    const payload = {
        user: req.body.user,
        text,
        image,
        createdAt: new Date().toDateString()
    }

    const post = new postModel(payload);
    await post.save();

    const user = await userModel.findOne({email: req.body.user.email});
    user.posts.push(post);

    await userModel.findByIdAndUpdate(user.id, user);

    res.status(201).send({msg:'Post created'});

})

postRouter.patch('/posts/:id',Authenticator,async (req, res) => {
    let id = req.params.id;
    if(id.length < 24){
        return res.status(400).send({msg:'Invalid ID'});
    }
    let post = await postModel.findById(id);
    const user = await userModel.findOne({email: req.body.user.email});
    if(!post){
        return res.status(404).send({msg:'Post not found...'});
    }
    if(post.user.email !== user.email){
        return res.status(401).send('Access denied');
    }
    const {text, image} = req.body;
    if(!text){
        return res.status(400).send({msg:'Please provide some text...'});
    }

    post.text = text;
    post.image = image;

    await postModel.findByIdAndUpdate(id,post);

    let arr = [];
    for(let elem of user.posts){
        if(elem._id.toString() == id){
            arr.push(post);
        }
        else{
            arr.push(elem);
        }
    }

    user.posts = arr;
    console.log(user.posts);

    await userModel.findByIdAndUpdate(user._id.toString(), user);

    res.sendStatus(204);

})

postRouter.delete('/posts/:id', Authenticator,async (req, res) => {
    let id = req.params.id;
    if(id.length < 24){
        return res.status(400).send({msg:'Invalid ID'});
    }
    const user = await userModel.findOne({email: req.body.user.email});
    let arr = [];
    for(let elem of user.posts){
        if(elem._id.toString() !== id){
            arr.push(elem);
        }
    }

    user.posts = arr;

    await userModel.findByIdAndUpdate(user._id.toString(), user);

    await postModel.findByIdAndDelete(id);
    res.sendStatus(204);
})

postRouter.patch('/posts/:id/like', Authenticator,async (req, res) => {
    let id = req.params.id;
    if(id.length < 24){
        return res.status(400).send({msg:'Invalid ID'});
    }

    let post = await postModel.findById(id);

    const user = await userModel.findOne({email: req.body.user.email});

    // let arr = [];
    // for(let elem of user.posts){
    //     if(elem._id.toString() == id){
    //         arr.push(post);
    //     }
    //     else{
    //         arr.push(elem);
    //     }
    // }

    // user.posts = arr;

    // console.log(user.posts);

    // await userModel.findByIdAndUpdate(user._id.toString(), user);

    post.likes.push(user);

    await postModel.findByIdAndUpdate(id, post);

    res.sendStatus(204);

})

postRouter.patch('/posts/:id/comment', Authenticator,async (req, res) => {
    let id = req.params.id;
    const {text} = req.body;

    if(id.length < 24){
        return res.status(400).send({msg:'Invalid ID'});
    }
    if(!text){
        return res.status(400).send({msg:'Comment cannot be empty'});
    }

    let post = await postModel.findById(id);

    const user = await userModel.findOne({email: req.body.user.email});

    const payload = {
        user,
        text,
        createdAt: new Date().toDateString()
    }

    post.comments.push(payload);

    await postModel.findByIdAndUpdate(id, post);

    // let arr = [];
    // for(let elem of user.posts){
    //     if(elem._id.toString() == id){
    //         arr.push(post);
    //     }
    //     else{
    //         arr.push(elem);
    //     }
    // }

    // user.posts = arr;
    // console.log(user.posts);

    // await userModel.findByIdAndUpdate(user._id.toString(), user);

    return res.sendStatus(204);

})

module.exports = {
    postRouter
}