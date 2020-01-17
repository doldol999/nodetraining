const express = require('express');
const path = require('path');

const app = express() //creates express app
const publicdirpath = path.join(__dirname, '../public'); //path to public directory

app.set('view engine','hbs'); //set up handle bars to use it in the project
app.use(express.static(publicdirpath));

app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather App'
    });
});
app.get('/about',(req,res)=>{
    res.render('about',{
        title: 'About',
        author: 'Mark Anthony',
        src: '/assets/me.jpg'
    });
});

app.get('/help',(req,res)=>{
    res.render('help',{
        title: 'Help',
        author: 'Mark Anthony',
        message: 'This is a static message.'
    });
});

app.get('/weather',(req,res) => {
    res.send({data:'data'});
});

app.listen(3000,() => {
    console.log('Server live on port 3000.');
});