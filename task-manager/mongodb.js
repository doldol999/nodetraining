// CRUD
const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL,{ 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    },(error,client) => { if(error){ return console.log('Unable to connect to database.',error); }

    const db = client.db(databaseName);
    const tasksCollection = db.collection('tasks');
    const usersCollection = db.collection('users');

    tasksCollection.deleteOne({ description: 'Run python script.' }).then(({result})=>{ console.log(result) })
    .catch((error)=>{ console.log(error) }).finally(()=>{ process.exit() });
});