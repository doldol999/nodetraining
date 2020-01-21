console.log('Weather app coming soon!');

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const forecastResultTitle = document.querySelector('#forecast-result').querySelector('h3');
const forecastResult = document.querySelector('#forecast-result').querySelector('p');
const errorMessage = document.querySelector('#error-message');

weatherForm.addEventListener('submit',(event) => {
    // prevents the form from running its default event 
    //which refreshes the whole page when submitted
    event.preventDefault(); 

    const address = search.value;
    
    if(address){
        errorMessage.textContent = '';
        forecastResultTitle.textContent = 'Loading...';
        forecastResult.textContent = '';

        fetch('http://localhost:3000/weather?address='+address).then((response)=>{
            response.json().then((data) => {

                if(data.error){ 
                    errorMessage.textContent = data.error;
                    forecastResultTitle.textContent = '';
                    return;
                }
                forecastResultTitle.textContent = data.location;
                forecastResult.textContent = data.forecast;
            });
        });
    }
});