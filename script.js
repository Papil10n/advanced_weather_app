const apiKey = 'a8590965e7304020b6134901221912'; // Replace with your API key
const cities = {
  kyiv: {
    name: 'Kyiv',
    lat: 50.4547,
    lon: 30.5238
  },
  amsterdam: {
    name: 'Amsterdam',
    lat: 52.3667,
    lon: 4.8945
  },
  dnipro: {
    name: 'Dnipro',
    lat: 48.4647,
    lon: 35.0462
  }
};
const addButton = document.getElementById("add-new-city");
const popupForm = document.getElementById("popup-form");
const closebutton = document.getElementById("close-button");
const form = popupForm.querySelector("form");
const cityInput = form.querySelector("#city-input");
const latitudeInput = form.querySelector("#latitude-input");
const longitudeInput = form.querySelector("#longitude-input");


function getTime() {
    const offset = -2;
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const nd = new Date(utc + (3600000*offset));
    const timeStr = nd.toLocaleTimeString();
    document.getElementById("time").innerHTML = timeStr;
  }
  
// Function to get weather data from WeatherAPI
async function getWeatherData(city) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city.lat},${city.lon}&days=5`;
  const response = await fetch(url);
  const data = await response.json();
  const current = data.current;
  const forecast = data.forecast.forecastday;
  return { current, forecast };
}

// Update weather for a city
async function updateWeather(cityId) {
  const city = cities[cityId];
  const cityElement = document.getElementById(cityId);
  const currentElement = cityElement.querySelector('.current-weather');
  const forecastElement = cityElement.querySelector('.forecast');

  // Get weather data from WeatherAPI
  const { current, forecast } = await getWeatherData(city);

  // Update current weather
  currentElement.querySelector('.temp').textContent = `${Math.round(current.temp_c)}°C`;
  currentElement.querySelector('.description').textContent = current.condition.text;
  currentElement.querySelector('.icon').innerHTML = `<img src="${current.condition.icon}">`;

  // Update forecast
  forecast.forEach((day, index) => {
    const listItem = forecastElement.children[index];
    listItem.querySelector('div:first-child').textContent = new Date(day.date).toLocaleString('en-US', { weekday: 'short' });
    listItem.querySelector('.weather-icon').innerHTML = `<img src="${day.day.condition.icon}">`;
    listItem.querySelector('div:last-child').textContent = `${Math.round(day.day.avgtemp_c)}°C`;
  });
}

function saveDataToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getDataFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
}

// Helper function to get day of week from a number (1-7)
function getDayOfWeek(day) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return daysOfWeek[day % 7];
}

// Update weather for all cities
async function updateAllWeather() {
  for (const cityId in cities) {
    await updateWeather(cityId);
  }
}

// Add an event listener to the button
addButton.addEventListener("click", function(event) {
  // Show the pop-up form
  popupForm.style.display = "block";

  const addBtnInForm = document.getElementById("submit-button");

  addBtnInForm.addEventListener("click", function(event) {
    const city = cityInput.value;
    const latitude = latitudeInput.value;
    const longitude = longitudeInput.value;

    createCard(city);
    cities[city] = {
      name: 'city',
      lat: latitude,
      lon: longitude
    }
    updateAllWeather();
    saveDataToLocalStorage("cities", cities);
    popupForm.style.display = "none";
  })
});


// Add an event listener to the Close button
closebutton.addEventListener("click", function(event) {
  // Hide the pop-up form
  popupForm.style.display = "none";
});


function createCard(city) {
  const newDiv = document.createElement("div");

  // Add the necessary classes and id to the div
  newDiv.className = "col-md-4";
  newDiv.innerHTML = `
    <div class="card city-card" id="${city}">
      <div class="card-header">
        <h2 class="city-name">${city}</h2>
      </div>
      <div class="card-body">
        <div class="current-weather">
          <div class="temp">--°C</div>
          <div class="description">--</div>
          <div class="icon"></div>
        </div>
        <ul class="list-group list-group-flush forecast">
          <li class="list-group-item">
            <div>Today</div>
            <div class="weather-icon"></div>
            <div>--°C</div>
          </li>
          <li class="list-group-item">
            <div></div>
            <div class="weather-icon"></div>
            <div>--°C</div>
          </li>
          <li class="list-group-item">
            <div></div>
            <div class="weather-icon"></div>
            <div>--°C</div>
          </li>
        </ul>
      </div>
    </div>
  `;
  console.log(newDiv);
  // Add the div to the container element
  const container = document.querySelector(".row");
  container.appendChild(newDiv);
}

// Call updateAllWeather on page load
updateAllWeather();
setInterval(getTime, 100);