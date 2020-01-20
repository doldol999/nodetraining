const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');
// const express = require('express');
// const app = express();

const getForecastWithGeocoding = (address,callback) => {
    if (!address){ return console.log('No address provided!') }
    geocode(address,(err,response) => {
        const {latitude,longitude} = response;
        if(err){ return console.log('Geocoding-Error: ',err); callback(err,undefined); }
        forecast(latitude, longitude, (error, data) => {
            if(error){ console.log('Forecasting-Error: ',error); callback(error,undefined); }
            const {summary,temperature,precipProbability} = data;
            callback(undefined,{ 
                location: response, 
                forecastData: data, 
                forecastSummary: `${summary} It is currently ${temperature} degrees out. There is a ${precipProbability}% chance of rain.`
            });
        })
    })
}

getForecastWithGeocoding(process.argv[2],(err,res)=>{
    const {location,forecastSummary} = res;
    if(err){ return console.log('Error: ',err) }
    console.log(`${location.location}\n${forecastSummary}`);
});

// app.get('',(req,res)=>{
//     getForecastWithGeocoding(process.argv[2],(err,ress)=>{
//         const {location,forecastSummary} = ress;
//         if(err){ return console.log('Error: ',err) }
//         // console.log(`${location.location}\n${forecastSummary}`);
//         res.send(ress)
//     });
// });

// app.listen(3000,()=>{
//     console.log('Weather app is live on port 3000.');
// })