const express = require('express');
const path = require('path');
const hbs = require('hbs');
const forecast = require('../src/utils/forecast');
const geocode = require('../src/utils/geocode');

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

const getForecastWithGeocoding = (address,callback) => {
    if (!address){ return console.log('No address provided!'); }
    geocode(address,(err,response = {}) => {
        if(err){ return callback(err,undefined); }
        const {latitude,longitude} = response;
        forecast(latitude, longitude, (error, data) => {
            if(error){ return callback(error,undefined); }
            const {summary,temperature,precipProbability} = data;
            callback(undefined,{ 
                location: response, 
                forecastData: data, 
                forecastSummary: `${summary} It is currently ${temperature} degrees out. There is a ${precipProbability}% chance of rain.`
            });
        })
    })
}

app.get('/weather',(req,res) => {
    if(!req.query.address){ 
        return res.send({ error: 'You must provide an address.' });
    }

    getForecastWithGeocoding(req.query.address,(err,response = {})=>{
        if(err){ return res.send({error: err}) }
        
        const {location,forecastSummary} = response;
        res.send({
            address: req.query.address,
            location: location.location,
            forecast: forecastSummary
        });
    });
});

app.get('/products',(req,res) => {
    if(!req.query.search){ 
        return res.send({ error: 'You must provide a search term.' });
    }
    res.send({
        products: []
    });
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