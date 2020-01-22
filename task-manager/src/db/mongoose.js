const mongoose = require('mongoose');
const validator = require('validator');

//connect to Mongo database
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{ 
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
});

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
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
    }
});

const Tasks = mongoose.model('Tasks', {
    description: { 
        type: String,
        required: true,
        trim: true,
    },
    completed: { 
        type: Boolean,
        default: false
    },
});

const newTask = new Tasks({description: ' Trim this string. '});
newTask.save().then((task)=>{ console.log(task) }).catch((error)=>{ console.log(error) }).finally(()=>{ process.exit() });
