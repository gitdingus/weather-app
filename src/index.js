const getElement = function getElementFromQuerySelector(cssSelector){
  return document.querySelector(cssSelector);
}
const apiKey = getElement('#api-key');
const city = getElement('#city');
const state = getElement('#state');
const zipcode = getElement('#zipcode');
const country = getElement('#country');
const findButton = getElement('#find');
const locationForm = getElement('#location');
const citiesResults = getElement('#cities');
const currentWeather = getElement('#current-weather');
let currentWeatherData;
let units = 'imperial';

const clearCitiesResults = function clearChildrenFromCitiesDiv (){
  while (citiesResults.firstChild !== null){
    citiesResults.firstChild.remove();
  }
}
const buildGeocodeQuery = function buildGeocodeAPIQueryBasedOnProvidedData(){
  // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
  // http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}
  if (apiKey.value === ''){
    throw Error('Must provide API key');
    return;
  }

  let apiQuery = 'http://api.openweathermap.org/geo/1.0/';
  if (zipcode.value !== ''){
    apiQuery += `zip?zip=${encodeURIComponent(zipcode.value)}`;
    if (country.value !== ''){
      apiQuery += `,${encodeURIComponent(country.value)}`;
    }
    apiQuery += `&limit=5&appid=${encodeURIComponent(apiKey.value)}`;

    return apiQuery;
  } else if (city.value !== ''){
    apiQuery += `direct?q=${encodeURIComponent(city.value)}`;
    if (state.value !== ''){
      apiQuery += `,${encodeURIComponent(state.value)}`;
    }
    if (country.value !== ''){
      apiQuery += `,${encodeURIComponent(country.value)}`;
    }
    apiQuery += `&limit=5&appid=${encodeURIComponent(apiKey.value)}`;

    return apiQuery;
  } 
  return undefined;
}
const fetchLocations = async function getLocationsList(apiQuery){
  try {
    const response = await fetch(apiQuery);
    console.log('Response OK? ' + response.ok);
    const data = await response.json();

    return data;
  }
  catch (error){
    console.log('Error: ' + error);
  }
}

locationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  return false;
});


function buildCurrentWeatherQuery(location){
  // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
  let currentWeatherQuery = 'https://api.openweathermap.org/data/2.5/weather?';
  currentWeatherQuery += `lat=${location.lat}&`;
  currentWeatherQuery += `lon=${encodeURIComponent(location.lon)}&`;
  currentWeatherQuery += `appid=${encodeURIComponent(apiKey.value)}&`;
  if (units === 'imperial'){
    currentWeatherQuery += `units=imperial`;
  }

  return currentWeatherQuery;
}

async function fetchCurrentWeather(apiQuery) {
  const response = await fetch(apiQuery);
  console.log('Response OK? ' + response.ok);
  const currentWeather = await response.json();

  return currentWeather;
}

function clearCurrentWeatherDisplay(){
  while(currentWeather.firstChild){
    currentWeather.firstChild.remove();
  }
}

function getWeatherIconSrc(iconId){
  // http://openweathermap.org/img/wn/{iconID}@2x.png

  return `http://openweathermap.org/img/wn/${iconId}@2x.png`;
}

function getReadableTime(date){
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}
function displayCurrentWeather(weather){
  const currentWeatherDisplayTemplate = getElement('#weather-conditions-template');
  const currentWeatherDisplay = currentWeatherDisplayTemplate.content.firstElementChild.cloneNode(true);
  const location = currentWeatherDisplay.querySelector('.location');
  const weatherIcon = currentWeatherDisplay.querySelector('.weather-icon');
  const weatherCategory = currentWeatherDisplay.querySelector('.weather-category');
  const weatherDescription = currentWeatherDisplay.querySelector('.weather-description');
  const temperature = currentWeatherDisplay.querySelector('.temperature');
  const feelsLike = currentWeatherDisplay.querySelector('.feels-like');
  const humidity = currentWeatherDisplay.querySelector('.humidity');
  const pressure = currentWeatherDisplay.querySelector('.pressure');
  const visibility = currentWeatherDisplay.querySelector('.visibility');
  const windSpeed = currentWeatherDisplay.querySelector('.wind-speed');
  const windDirection = currentWeatherDisplay.querySelector('.wind-direction');
  const windGust = currentWeatherDisplay.querySelector('.wind-gust');
  const clouds = currentWeatherDisplay.querySelector('.clouds');
  const sunrise = currentWeatherDisplay.querySelector('.sunrise');
  const sunset = currentWeatherDisplay.querySelector('.sunset');
  const rainDetails = currentWeatherDisplay.querySelector('.rain-details');
  const rain1hr = currentWeatherDisplay.querySelector('.rain-1hr');
  const rain3hr = currentWeatherDisplay.querySelector('.rain-3hr');
  const snowDetails = currentWeatherDisplay.querySelector('.snow-details');
  const snow1hr = currentWeatherDisplay.querySelector('.snow-1hr');
  const snow3hr = currentWeatherDisplay.querySelector('.snow-3hr');
  const closeButton = currentWeatherDisplay.querySelector('.window-buttons .close-button');
  const collapseButton = currentWeatherDisplay.querySelector('.window-buttons .collapse-button');
  const moreDetails = currentWeatherDisplay.querySelector('.more-details');
  location.textContent = `${weather.name}, ${weather.sys.country}`;
  weatherIcon.src = getWeatherIconSrc(weather.weather[0].icon);
  weatherCategory.textContent = weather.weather[0].main;
  weatherDescription.textContent = weather.weather[0].description;
  temperature.textContent = weather.main.temp;
  feelsLike.textContent = weather.main.feels_like;
  humidity.textContent = weather.main.humidity;
  pressure.textContent = weather.main.pressure;
  visibility.textContent = weather.visibility;
  windSpeed.textContent = weather.wind.speed;
  windDirection.textContent = weather.wind.deg;
  windGust.textContent = weather.wind.gust;
  clouds.textContent = weather.clouds.all;
  sunrise.textContent = getReadableTime(new Date(weather.sys.sunrise * 1000));
  sunset.textContent = getReadableTime(new Date(weather.sys.sunset * 1000));
  if (weather.rain !== undefined){
    rain1hr.textContent = weather.rain['1h'];
    rain3hr.textContent = weather.rain['3h'];
  } else {
    rainDetails.classList.add('inactive');
  }
  if (weather.snow !== undefined){
    snow1hr.textContent = weather.snow['1h'];
    snow3hr.textContent = weather.snow['3h'];
  } else {
    snowDetails.classList.add('inactive');
  }

  closeButton.addEventListener('click', (e) => {
    currentWeatherDisplay.remove();
  });

  collapseButton.addEventListener('click', (e) => {
    if (moreDetails.classList.contains('collapsed')) {
      moreDetails.classList.remove('collapsed');
      collapseButton.textContent = 'Collapse';
    } else {
      moreDetails.classList.add('collapsed');
      collapseButton.textContent = 'Expand';
    }
  });

  // clearCurrentWeatherDisplay();

  currentWeather.appendChild(currentWeatherDisplay);

}
function buildLocationElement(location){
  const p = document.createElement('p');
  
  if (location.state !== undefined){
    p.textContent = `${location.name}, ${location.state}, ${location.country}`;
  } else if (location.zip !== undefined){
    p.textContent = `${location.name}, ${location.zip}, ${location.country}`;
  }
  p.setAttribute('data-latlong', `lat=${location.lat}&lon=${location.lon}`);
  p.addEventListener('click', async function (e) {
    const currentWeather = await fetchCurrentWeather(buildCurrentWeatherQuery(location));
    currentWeatherData = currentWeather;
    console.log(currentWeather);
    displayCurrentWeather(currentWeather);
  });

  return p;

}
findButton.addEventListener('click', async (e) => {

  clearCitiesResults();
  // clearCurrentWeatherDisplay();
  try { 
    const query = buildGeocodeQuery();
    const locations = await fetchLocations(query);
  
    clearCitiesResults();
    if (Array.isArray(locations) === true) {
      locations.forEach((location) => {
        citiesResults.appendChild(buildLocationElement(location));
      });
    } else { // should be checking for an Object
      citiesResults.appendChild(buildLocationElement(locations));

    }
  }
  catch (error)  {
    console.log("Error: Could not retrieve data");
  };

});