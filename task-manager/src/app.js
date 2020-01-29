const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(express.json()); // automatically parse incoming json to an object
app.use(userRouter);
app.use(taskRouter);

module.exports = app;

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