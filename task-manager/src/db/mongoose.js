const mongoose = require('mongoose');

//connect to Mongo database
mongoose.connect(process.env.MONGODB_CONNECTRING_STRING,{ 
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});