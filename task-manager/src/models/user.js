const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, //guarantee uniqueness
        validate(value){
            if(!validator.isEmail(value)){ throw new Error('Email is invalid!') }
        }
    }, 
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number.');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(validator.contains(value,'password')){ throw new Error('Password must not contain the word \"password\".') }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

// Adding a static function to our model User
// Static methods are accessible on the Model
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email: email});

    if(!user){throw new Error('Login Failed') }
    
    const isMatched = await bcrypt.compare(password,user.password);

    if(!isMatched){ throw new Error('Login Failed') }

    return user;
}

// Methods are accessible on instances
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()},'thisismynewsignin'); //generate token

    user.tokens = user.tokens.concat({token}); //save token to user's list of tokens
    await user.save(); //save user infos

    return token;
}

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

//the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this; //grab the object provided before it is saved 
    
    //modify the object's plain text pass with a hashed one
    if(user.isModified('password')){  //true when value is first created or being updated
        user.password = await bcrypt.hash(user.password,8); //use a hash value to override the plain text password
    }
    
    next(); //run next when done modifying
});

userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User