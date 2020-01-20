const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express() //creates express app

//Define paths for Express config
const publicdirpath = path.join(__dirname, '../public'); //path to public directory
const viewsPath = path.join(__dirname,'../templates/views'); //custom views directory instead of views
const partialsPath = path.join(__dirname,'../templates/partials'); //path to partials directory

//Setup handlebars engine and views location
app.set('view engine','hbs'); //set up handle bars to use it in the project
app.set('views',viewsPath); //set custom views directory
hbs.registerPartials(partialsPath); //set partials directory

//Setup static directory to serve
app.use(express.static(publicdirpath));

app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather App',
        author: 'Mark Anthony',
        favico: '/assets/weather.png'
    });
});
app.get('/about',(req,res)=>{
    res.render('about',{
        title: 'About',
        author: 'Mark Anthony',
        src: '/assets/me.jpg',
        favico: '/assets/weather.png'
    });
});

app.get('/help',(req,res)=>{
    res.render('help',{
        title: 'Help',
        author: 'Mark Anthony',
        message: 'This is a static message.',
        favico: '/assets/weather.png'
    });
});

app.get('/weather',(req,res) => {
    res.send({data:'data'});
});

// display a specific 404 for /page-name/ sub-pages
// example here 
app.get('/help/*', (req,res) => {
    res.render('error',{
        title: 'ERROR 404',
        author: 'Mark Anthony',
        errorMessage: 'Help Article Not Found!',
        favico: '/assets/weather.png'
    });
});

// * is a wild card character that indicates match anything that hasn't been matched so far
app.get('*', (req,res) => {
    res.render('error',{
        title: 'ERROR 404',
        author: 'Mark Anthony',
        errorMessage: 'Page Not Found!',
        favico: '/assets/weather.png'
    });
});

app.listen(3000,() => {
    console.log('Server live on port 3000.');
});