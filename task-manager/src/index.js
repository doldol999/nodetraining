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

const multer = require('multer');

const upload = multer({
	dest: 'images',
    limits: {
        fileSize: 1000000 //limits file upload size to 1 mb
	},
	fileFilter(request,file,callback){
		if (!file.originalname.match(/\.(doc|docx)$/)){
			return callback(new Error('Please upload a Word Document'));
		}
		callback(undefined,true);
	}
});

app.post('/upload', upload.single('upload'), (request,response)=>{
	response.send();
});

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