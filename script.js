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

function getTime() {
    const offset = -2;
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const nd = new Date(utc + (3600000*offset));
    const timeStr = nd.toLocaleTimeString();
    document.getElementById("time").innerHTML = timeStr;
  }
  
  function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.currentTarget.style.backgroundColor = "lightgray";
  }
  
  function dragEnd(event) {
    event.currentTarget.style.backgroundColor = "";
  }
  
  function allowDrop(event) {
    event.preventDefault();
    event.currentTarget.style.backgroundColor = "lightgray";
  }
  
  function drop(event) {
    event.preventDefault();
    const source = event.dataTransfer.getData("text/plain");
    const sourceCard = document.getElementById(source);
    const targetCard = event.currentTarget;
    const targetParent = targetCard.parentNode;
    const sourceParent = sourceCard.parentNode;
    targetParent.insertBefore(sourceCard, targetCard.nextSibling);
    sourceParent.insertBefore(targetCard, sourceCard.nextSibling);
    event.currentTarget.style.backgroundColor = "";
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

// Call updateAllWeather on page load
updateAllWeather();
