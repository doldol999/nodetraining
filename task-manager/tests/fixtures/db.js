const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneID = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneID,
    name: 'Admin Lumbao',
    email: 'admin.mark@xtendops.com',
    password: 'testuser10101',
    tokens: [{
        token: jwt.sign({_id: userOneID},process.env.JWT_SECRET)
    }]
}

const userTwoID = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoID,
    name: 'Master User Lumbao',
    email: 'master.mark@xtendops.com',
    password: 'testuser10101',
    tokens: [{
        token: jwt.sign({_id: userTwoID},process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Create a perfect test case',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Create a perfect task manager app',
    completed: false,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Create a perfect weather app',
    completed: false,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany(); // wipe database everytime a test is executed
    await Task.deleteMany();
    await new User(userOne).save(); // create a default test user
    await new User(userTwo).save(); // create a default test user
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOneID,
    setupDatabase,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree
}