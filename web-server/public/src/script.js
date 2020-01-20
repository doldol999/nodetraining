console.log('Weather app coming soon!');

fetch('http://localhost:3000/weather?address=Boston').then((response)=>{
    response.json().then((data) => {
        if(data.error){ return console.log(data.error); }
        console.log(`${data.location} \n ${data.forecast}`);
    });
});