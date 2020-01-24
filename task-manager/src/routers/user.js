const express = require('express');
const User = require('../models/user');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/users', async (request,response)=>{
    const user = new User(request.body);
    try { 
        await user.save();
        const token = await user.generateAuthToken();
        response.status(201).send({user,token});
    }catch(e){ response.status(400).send(e) }
});

router.post('/users/login', async (request,response) => {
    try{
        const {email,password} = request.body;//grab email and password from request body
        const user = await User.findByCredentials(email,password); //grab user infos if it exist
        const token = await user.generateAuthToken(); //generate and save token for this user
        response.send({user,token}); //send user info and token value
    }catch(e){ response.status(400).send(e) }
});

router.post('/users/logout', auth, async (request,response) => {
    try{
        request.user.tokens = request.user.tokens.filter(token => token.token !== request.token)
        await request.user.save();
        response.send();
    }catch(e){ response.status(500).send() }
});

router.post('/users/logout-all', auth, async (request,response) => {
    try{
        request.user.tokens = [];
        await request.user.save();
        response.send();
    }catch(e){ response.status(500).send(e) }
});

//gets user profile when authenticated
router.get('/users/me', auth, async (request,response)=>{
    response.send(request.user);
});

router.patch('/users/me', auth, async (request,response) => {
    const updates = Object.keys(request.body);
    const allowedUpdates = ['name','email','password','age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if(!isValidOperation){ return response.status(400).send({error: 'Invalid operators'}) } 

    try{
        const user = request.user;
        updates.forEach( update => user[update] = request.body[update] );
        await user.save();  //save the updated version of the fetched user
        response.send(user);        
    }catch(e){ response.status(400).send() }
});

//allow logged in user to delete their profile
router.delete('/users/me', auth, async (request,response) => {
    try{
        await request.user.remove();
        response.status(200).send(request.user);
    }catch(e){ response.status(400).send(e) }
});

module.exports = router;