const request = require('request');

const geocode = (address,callback) => {
    const mapboxurl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+encodeURIComponent(address)+'.json?access_token=pk.eyJ1IjoibWFyay1sdW1iYW8iLCJhIjoiY2s1aDZ0cWljMDBudjNlcGpvb3RjeG50OSJ9.CykjqXehCQ7y5DtUq899LQ&limit=1';
    request({uri: mapboxurl, json: true}, (err,{body}) => {
        if(err){
            callback(err,undefined);
        }else if(body.features.length < 1){
            const msg = 'Unable to find a match. Try again.';
            callback(msg,undefined);
        }else{
            const latitude = body.features[0].center[1];
            const longitude = body.features[0].center[0];
            const name = body.features[0].place_name;
            callback(undefined,{latitude: latitude,longitude: longitude, location: name});
        }
    });
}

module.exports = geocode;