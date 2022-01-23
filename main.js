let APIURL = new URL('https://api.openweathermap.org/data/2.5/weather?');
let APIKey = '9f559701852bb8b9a6b2f3b954186205';
let cityName = document.querySelector('#cityName');
let infoTxt = document.getElementsByClassName('info-txt')[0];
let inputPart = document.querySelector('.input-part');
let weatherPart = document.querySelector('.weather-part');
let wrapper = document.querySelector('.wrapper');

document.addEventListener('click', (e) =>{
    let target = e.target;

    if (target && target.classList.contains('bx-left-arrow-alt')){
        goBackToMain();
    }else if (target && target.classList.contains('getLocationBtn')){
        getLocation()
    }
})

document.addEventListener('keyup', (e) => {
    let target = e.code;
    if(target && target.includes('Enter')){
        let cityNameValue = cityName.value;
        cheekedCityName(cityNameValue, APIKey);
    }
})

// will get user current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else { 
        UnFoundCityName('', 'Geolocation is not supported by this browser');
    }
}

// Will get current location if user click on button ('GET Device Location')
async function showPosition(position) {

    let {latitude, longitude} = position.coords;

    foundCityName('Getting weather details...');
    
    let result = await fetch(APIURL + 'lat=' + latitude + '&lon=' + longitude + '&units=metric' +'&appid=' + APIKey, {
        method: 'Get',
    });

    if(result.ok){
        let positionData = await result.json();
        displayWeatherInfo(positionData);
    }
}

// Will return red message if there any error with user current location 
function showError(error){
    switch(error.code){
        case error.PERMISSION_DENIED:
            UnFoundCityName('', 'User denied the request for Geolocation');
        break;
        case error.POSITION_UNAVAILABLE:
            UnFoundCityName('', 'Location information is unavailable');
        break;
        case error.TIMEOUT:
            UnFoundCityName('', 'The request to get user location timed out');
        break;
        case error.UNKNOWN_ERROR:
            UnFoundCityName('', 'An unknown error occurred');
        break;
    }
}

// Will check if name that user put it is a valid or not via API
async function cheekedCityName (cityName, APIKey){
        
    if(cityName){

        foundCityName('Getting weather details...');
        
        let result = await fetch(APIURL + 'q=' + cityName + '&units=metric' + '&appid=' + APIKey,
            {
            method:'Get',
        });

        if(result.ok){
        
            const cityData = await result.json();

            displayWeatherInfo(cityData)
            
        }else{
            UnFoundCityName(cityName, " isn't a valid city name");
        }
    } 
}

// After click on back arrow will go back to main
function goBackToMain(){
    wrapper.classList.remove('active');
    infoTxt.classList.remove('pending');
    infoTxt.style.display = 'none';
    cityName.value = '';
}

// Display all information of the city that user choose.
function displayWeatherInfo(cityData){
    console.log(cityData);
    let{id, description} = cityData.weather[0];
    let city = cityData.name;
    let country = cityData.sys.country;
    let {temp, feels_like, humidity} = cityData.main;

    wrapper.classList.add('active');
    document.querySelector('.numb').textContent =  Math.floor(temp);
    document.querySelector('.location span').innerHTML = city + ', ' + country;
    document.querySelector('.weather').textContent = description;
    document.querySelector('.numb-2').textContent =  Math.floor(feels_like);
    document.querySelector('.column.humidity span').textContent = humidity + '%';

    checkTheWeather(id);
}

// Change the icon depend on icon id (API icon)
function checkTheWeather(id){
    let imgSrc = weatherPart.querySelector('img');

    if(id >= 200 && id <= 232){
        imgSrc.src = '../imgs/storm.svg';
    }else if( id >= 500 && id <= 531){
        imgSrc.src = '../imgs/rain.svg';
    }else if(id >= 600 && id <= 622){
        imgSrc.src = '../imgs/snow.svg';
    }else if(id >= 801 && id <= 804){
        imgSrc.src = '../imgs/cloud.svg';
    }else if(id == 800){
        imgSrc.src = '../imgs/clear.svg';
    }

}

// Display red message if the city are not found or there are a error.
function UnFoundCityName(cityName, message){
    infoTxt.classList.remove('pending');
        infoTxt.style.display = 'block';
        infoTxt.innerHTML = cityName + message;
        infoTxt.classList.add('error');

}

// Display green message if the city are found
function foundCityName(message){
    infoTxt.classList.remove('error');
    infoTxt.style.display = 'block';
    infoTxt.innerHTML = message;
    infoTxt.classList.add('pending');
}

cheekedCityName();
