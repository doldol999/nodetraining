const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.port || 3000;

app.use(express.json()); // automatically parse incoming json to an object
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => { console.log('Server is up on port: ',port) });

const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
	// const task = await Task.findById('5e2efe6ca6e95528d480deaa');
	// await task.populate('owner').execPopulate();
	// console.log(task.owner);
	const user = await User.findById('5e2efe5ea6e95528d480dea8');
	await user.populate('tasks').execPopulate();
	console.log(user.tasks);
}

main();

/**Test Users
    "name": "Fishy Dais",
    "email": "fa@mous.com",
    "password": "testuser10101" 
    
	"name": "Carabao Mango",
	"email": "gina@mous.com",
	"password": "testuser10101"
    
    "name": "Crab Menta Lity",
	"email": "mangli@mous.com",
	"password": "testuser10101"
**/