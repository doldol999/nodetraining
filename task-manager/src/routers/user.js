const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.post('/users', async (request,response)=>{
    const user = new User(request.body);
    try { 
        await user.save();
        response.status(201).send(user);
    }catch(e){ response.status(400).send(e) }
});

router.get('/users', async (request,response)=>{
    try{
        const users = await User.find();
        response.send(users);
    }catch(e){ response.status(500).send(e) }
});

router.get('/users/:id', async (request,response)=>{
    const _id = request.params.id;

    try{
        const user = await User.findById(_id);
        if(!user){ return response.status(404).send() }
        response.send(user);
    }catch(e){ response.status(500).send(e) }
});

router.patch('/users/:id', async (request,response) => {
    const _id = request.params.id;
    
    const updates = Object.keys(request.body);
    const allowedUpdates = ['name','email','password','age'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });
    
    if(!isValidOperation){ return response.status(400).send({error: 'Invalid operators'}) } 

    try{
        const user = await User.findByIdAndUpdate(_id,request.body,{ new:true, runValidators:true });
        if(!user){ response.status(404).send() }

        response.send(user);        
    }catch(e){ response.status(400).send() }
});

router.delete('/users/:id', async (request,response) => {
    const _id = request.params.id;
    try{
        const user = await User.findByIdAndDelete(_id);
        if(!user){ return response.status(404).send() }
        response.status(200).send(user);
    }catch(e){ response.status(400).send(e) }
});

module.exports = router;