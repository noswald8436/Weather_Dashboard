// Track whether the temperature is displayed in Celsius or Fahrenheit
let isCelsius = true;  // Default to Celsius

// Load favorites from localStorage on startup
window.onload = () => {
    loadFavorites();
};

// Listener for the 'Search' button click event
document.getElementById('searchButton').addEventListener('click', function () {
    const city = document.getElementById('cityInput').value;
    if (city) {
        getWeather(city);
        getForecast(city);
    }
});

// Listener for the 'Add to Favorites' button
document.getElementById('addFavoriteButton').addEventListener('click', function () {
    const city = document.getElementById('cityInput').value;
    if (city) {
        addFavorite(city);
    }
});

// Listener for the unit toggle switch event
document.getElementById('unitToggle').addEventListener('change', function () {
    isCelsius = !isCelsius;
    const label = document.querySelector('label[for="unitToggle"]');
    label.textContent = isCelsius ? "Switch to Fahrenheit" : "Switch to Celsius";
    const city = document.getElementById('cityInput').value;
    if (city) {
        getWeather(city);
        getForecast(city);
    }
});

// Function to fetch current weather data for a given city
async function getWeather(city) {
    const apiKey = '9c23d10ca9e6452697c53e3a44ee4e62';
    const units = isCelsius ? 'M' : 'I';  // 'M' for metric, 'I' for imperial
    const weatherUrl = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}&units=${units}`;

    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherData').innerHTML = '<p>Error fetching weather data. Please try again.</p>';
    }
}

// Function to fetch 5-day weather forecast for a given city
async function getForecast(city) {
    const apiKey = '9c23d10ca9e6452697c53e3a44ee4e62';
    const units = isCelsius ? 'M' : 'I';  // 'M' for metric, 'I' for imperial
    const forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${apiKey}&units=${units}&days=5`;

    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        document.getElementById('forecastData').innerHTML = '<p>Error fetching forecast data. Please try again.</p>';
    }
}

// Function to display current weather data on the page
function displayWeather(data) {
    if (!data || !data.data || data.data.length === 0) {
        document.getElementById('weatherData').innerHTML = '<p>No weather data available</p>';
        return;
    }

    const weather = data.data[0];
    const tempUnit = isCelsius ? '°C' : '°F';
    const weatherHtml = `
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${weather.city_name}, ${weather.country_code}</h5>
                    <p class="card-text">Temperature: ${weather.temp} ${tempUnit}</p>
                    <p class="card-text">Weather: ${weather.weather.description}</p>
                    <p class="card-text">Humidity: ${weather.rh}%</p>
                    <img src="https://www.weatherbit.io/static/img/icons/${weather.weather.icon}.png" alt="Weather icon">
                </div>
            </div>
        </div>
    `;
    document.getElementById('weatherData').innerHTML = weatherHtml;
}

// Function to display 5-day weather forecast data on the page
function displayForecast(data) {
    if (!data || !data.data || data.data.length === 0) {
        document.getElementById('forecastData').innerHTML = '<p>No forecast data available</p>';
        return;
    }

    let forecastHtml = '';
    const tempUnit = isCelsius ? '°C' : '°F';
    data.data.forEach(day => {
        forecastHtml += `
            <div class="col-12 col-md-2">
                <div class="card">
                    <div class="card-body text-center">
                        <h6 class="card-title">${new Date(day.datetime).toLocaleDateString()}</h6>
                        <p class="card-text">Temp: ${day.temp} ${tempUnit}</p>
                        <p class="card-text">${day.weather.description}</p>
                        <img src="https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png" alt="Weather icon">
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementById('forecastData').innerHTML = forecastHtml;
}

// Function to add a city to favorites
function addFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
        loadFavorites();
    } else {
        alert("City is already in favorites!");
    }
}

// Function to load favorite cities from local storage
function loadFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    let listHtml = '<h4>Favorite Cities:</h4>';
    favorites.forEach(city => {
        listHtml += `<button class="btn btn-link" onclick="selectFavoriteCity('${city}')">${city}</button>`;
    });

    document.getElementById('favoritesList').innerHTML = listHtml;
}

// Function to handle favorite city button click
function selectFavoriteCity(city) {
    document.getElementById('cityInput').value = city;
    getWeather(city);
    getForecast(city);
}