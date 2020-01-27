const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/tasks', auth, async (request,response) => {
    // const task = new Task(request.body);
    const task = new Task({
        ...request.body,
        owner: request.user._id
    })
    
    try{
        await task.save();
        response.status(201).send(task)
    }catch(e){ response.status(400).send(e) }
});

router.get('/tasks', auth, async (request,response)=>{
    try{
        // const tasks = await Task.find({ owner: request.user._id });  
        // response.send(tasks); 
        // or
        await request.user.populate('tasks').execPopulate();
        response.send(request.user.tasks);
    }catch(e){ response.status(500).send(e) }
});
router.get('/tasks/:id', auth, async (request,response)=>{
    const _id = request.params.id;

    try{
        const task = await Task.findOne({ _id, owner: request.user._id })
        if(!task){ return response.status(404).send() }
        response.status(200).send(task);
    }catch(e){ response.status(500).send(e) }
});

router.patch('/tasks/:id', auth, async (request,response) => {
    const _id = request.params.id;
    
    const updates = Object.keys(request.body);
    const allowedUpdates = ['description','completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation){ return response.status(404).send({error: 'Invalid operators'}) }

    try {
        const newUpdates = request.body;

        const task = await Task.findOne({ _id, owner: request.user._id });
        // const task = await Task.findById(_id);

        if(!task){ return response.status(404).send() }

        updates.forEach(update => task[update] = newUpdates[update]);
        task.save();

        response.status(200).send(task);
    }catch(e){ response.status(400).send(e) }
});

router.delete('/tasks/:id', auth, async (request,response) => {
    const _id = request.params.id;
    try{
        const task = await Task.findOne({ _id, owner: request.user._id });
        
        if(!task){ return response.status(404).send() }

        await task.remove();

        response.status(200).send(task);
    }catch(e){ response.status(400).send(e) }
});

module.exports = router;