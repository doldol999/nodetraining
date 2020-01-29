const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => { console.log('Server is up on port: ',port) });

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