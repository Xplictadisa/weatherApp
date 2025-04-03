const locationElem = document.querySelector('.js-location');
const timeElem = document.querySelector('.js-current-time');
const tempElem = document.querySelector('.js-current-temperature');
const dewpointElem = document.querySelector('.dew-point');
const precipElem = document.querySelector('.js-precipitation');
const windElem = document.querySelector('.js-wind');
const visElem = document.querySelector('.js-visibility');
const button = document.getElementById('button');
const currentWeatherContainerElem = document.querySelector('.current-weather-container');
const tomorrowWeatherElem = document.querySelector('.js-tomorrow-weather');

const forecastContainer = document.querySelector('.js-daily-forecast');

renderCurrentLocationWeather();

button.addEventListener('click', async function(e) {
  try {
    e.preventDefault()
    const input = document.getElementById('input');
    const position = input.value.trim();
    const data = await getWeather(position);
    console.log(data);

    currentWeather(data);
    forecastWeather(data)

  } catch (error) {
    console.log(`Error: ${error.message}`)
    alert('No matching location found.')
  }
})



function getPosition() {
  return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((data) => {
        // console.log(data)
        const latitude = data.coords.latitude;
        const longitude = data.coords.longitude;
        const position = `${latitude},${longitude}`;
        resolve(position)
      }, (error) => {
        console.log(error.message);
        alert(`${error.message}: Please enable your Device Location to get the precise weather for your location `)
        reject(error)
      });
  })
}


async function showPosition() {
  const position = await getPosition();
  let userLocation = position;
  return userLocation
}

async function getWeather(position) {
  try {
    const apiKey = '58a91199fc7144af9da130254252803';
    const url = `https://api.weatherapi.com/v1//forecast.json.json?key=${apiKey}&q=${position}&days=5`;

    const response = await fetch(url);
    // console.log(response)
    const data = await response.json();
    return data

  } catch (error) {
    console.log(`fetching error: ${error}`)
  }
}

function todayDate() {
  const date = new Date();
  const dateString = date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    weekday: 'short'
  })
  return dateString
}

function formatEachForecastDate(param) {
  const date = new Date(param);
  const dateString = date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    weekday: 'short'
  })
  return dateString
}

function checkDayandNightTime(data) {
  const elem = currentWeatherContainerElem.classList;
  if (data.current.is_day === 0 ) {
    if (elem.contains('daytime-background') === false) {
      elem.add('daytime-background');
      elem.remove('nightTime-background')
    }
  } else {
    elem.remove('daytime-background')
    elem.add('nightTime-background')
  } 
}

function currentWeather(data) {
  locationElem.innerText = `${data.location.region}, ${data.location.country}`;

  timeElem.innerText = todayDate();
  tempElem.innerHTML = `${data.current.temp_c}<sup class="degCelsius">°C</sup>`;

  dewpointElem.innerText = `dewpoint: ${data.current.dewpoint_c}°C`;

  const small = precipElem.querySelector('small');
  small.innerText = data.current.condition.text;

  const weatherImage = precipElem.querySelector('img');
  weatherImage.src = data.current.condition.icon;

  windElem.querySelector('p').innerText = `${data.current.wind_kph} km/h`;
  windElem.querySelector('small').innerText = `Blowing from ${data.current.wind_dir}`;

  visElem.querySelector('small').innerText = `Visibility is ${data.current.vis_km} km`;
}

function forecastWeather(data) {
  let forecastHTML = '';
  const forecast = data.forecast.forecastday;
  forecast.forEach((items) => {
    // console.log(items);
    if (forecast[0].date !== items.date) {
      // console.log(items.date)
      forecastHTML += `
        <div class="forecast items">
          <img class="forecast-icon" src="${items.day.condition.icon}" alt="">
          <small class="forcast-time">${formatEachForecastDate(items.date)}</small>
          <h2>${items.day.avgtemp_c}°C</h2>
        </div>
      `;

      forecastContainer.innerHTML = forecastHTML;
    }

    tomorrowWeatherElem.querySelector('.weather-text').innerText = forecast[1].day.condition.text;

    tomorrowWeatherElem.querySelector('img').src = forecast[1].day.condition.icon;

    tomorrowWeatherElem.querySelector('.minmax-temp').innerHTML = `<small>${forecast[1].day.maxtemp_c}°</small>
          <small>${forecast[1].day.mintemp_c}°</small>`
  })
}

async function renderCurrentLocationWeather() {
  const userLocation = await showPosition();
  console.log(userLocation);
  const data = await getWeather(userLocation);
  console.log(data);

  currentWeather(data);
  forecastWeather(data)
  checkDayandNightTime(data)
}
