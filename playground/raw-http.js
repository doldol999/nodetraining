const https = require('https');

const url = 'https://api.darksky.net/forecast/1d3e4ec0ea9021ece98feb39a00e3e07/37.8267,-122.4233';

const request = https.request(url,(res) => {
    let data = '';

    res.on('data',(chunk) => {
        data = data + chunk.toString();
    });

    res.on('end', () => {
        const body = JSON.parse(data);
        console.log(body);
    });
});

request.on('error', (error) => {
    console.log('An error',error);
});

request.end();