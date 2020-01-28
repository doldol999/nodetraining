const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
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

// logout user from current device - delete current token
router.post('/users/logout', auth, async (request,response) => {
    try{
        request.user.tokens = request.user.tokens.filter(token => token.token !== request.token)
        await request.user.save();
        response.send();
    }catch(e){ response.status(500).send() }
});

//logout user from all devices - delete all tokens
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

const upload = multer({
    // dest: 'avatars', //--only if you need to store files to the file system
    limits: {
        fileSize: 1000000 //limits file upload size to 1 mb
    },
    fileFilter(request,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            callback(new Error('Please upload an image file.'))
        }
        callback(undefined,true);
    }
});
const errorHandler = (error,request,response,next) => {
    if(error){
        response.status(400).send({error: error.message});
    }
}
router.post('/users/me/avatar', auth, upload.single('avatar'), async (request,response)=>{
    const buffer = await sharp(request.file.buffer).resize({ width:250, height:250 }).png().toBuffer();
    request.user.avatar = buffer;
    await request.user.save();
    response.send();
},errorHandler);

router.delete('/users/me/avatar', auth, async (request,response) => {
    request.user.avatar = undefined;
    await request.user.save();
    response.status(200).send(request.user);
},errorHandler);

router.get('/users/:id/avatar', async (request,response) => {
    try {
        // const avatar = request.user.avatar;
        const user = await User.findById(request.params.id);
        
        if(!user || !user.avatar){ throw new Error(); }

        response.set('Content-Type','image/png');
        response.send(user.avatar);
    } catch (error) { response.status(404).send() }
});

module.exports = router;