const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (request,response,next) => {
    try{
        const token = request.header('Authorization').replace('Bearer ',''); //get value of Authorization header then remove the word Bearer from it
        const decoded = jwt.verify(token,process.env.JWT_SECRET); //verify token extracted from Authorization header
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }); //find a user that has the following id and token

        if(!user){ throw new Error('') } // no user is found throw an error which means no user is authenticated

        request.token = token;
        request.user = user; // user found. set request user to the authenticated user.

        next(); //continue 
    }catch(e){ response.status(401).send({error:'Please authenticate.'+e}) }
}

module.exports = auth;