const request = require('request');

const forecast = (latitude,longitude,callback) => {
    const url = 'https://api.darksky.net/forecast/1d3e4ec0ea9021ece98feb39a00e3e07/'+latitude+','+longitude;
    request({url: url, json: true}, (err,{body}) => {
        const responseError = body.error;
        if(err){
            callback(err,undefined);
        }else if(responseError){
            callback(responseError,undefined);
        }else{
            const temperature =  body.currently.temperature;
            const precipProbability = body.currently.precipProbability;
            const summary = body.daily.summary;
            callback(undefined,{
                temperature: temperature,
                precipProbability: precipProbability,
                summary: summary
            })
        }
    })
}

module.exports = forecast;