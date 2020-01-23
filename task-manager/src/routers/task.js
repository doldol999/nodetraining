const express = require('express');
const Task = require('../models/task');
const router = express.Router();

router.post('/tasks', async (request,response) => {
    const task = new Task(request.body);
    
    try{
        await task.save();
        response.status(201).send(task)
    }catch(e){ response.status(400).send(e) }
});

router.get('/tasks', async (request,response)=>{
    try{
        const tasks = await Task.find();
        response.send(tasks);
    }catch(e){ response.status(500).send(e) }
});
router.get('/tasks/:id', async (request,response)=>{
    const _id = request.params.id;

    try{
        const task = await Task.findById(_id);
        if(!task){ return response.status(404).send() }
        response.status(200).send(task);
    }catch(e){ response.status(500).send(e) }
});

router.patch('/tasks/:id', async (request,response) => {
    const _id = request.params.id;
    
    const updates = Object.keys(request.body);
    const allowedUpdates = ['description','completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation){ return response.status(404).send({error: 'Invalid operators'}) }

    try {
        const task = await Task.findByIdAndUpdate(_id, request.body, { new:true,runValidators:true });
        if(!task){ return response.status(404).send() }
        response.status(200).send(task);
    }catch(e){ response.status(400).send(e) }
});

router.delete('/tasks/:id', async (request,response) => {
    const _id = request.params.id;
    try{
        const task = await Task.findByIdAndDelete(_id);
        if(!task){ return response.status(404).send() }
        response.status(200).send(task);
    }catch(e){ response.status(400).send(e) }
});

module.exports = router;