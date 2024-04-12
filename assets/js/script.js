$(document).ready(function(){
    // Load search history from local storage
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Function to render search history
    function renderSearchHistory() {
        $('#searchHistory').empty();
        searchHistory.forEach(function(city) {
            const cityBtn = $('<button>').addClass('btn btn-outline-secondary btn-block mt-2 searchHistoryBtn').text(city);
            const cityDiv = $('<div>').addClass('row mb-2').append($('<div>').addClass('col').append(cityBtn));
            $('#searchHistory').append(cityDiv);
        });
    }

    // Render search history initially
    renderSearchHistory();

    // Click event for search history buttons
    $(document).on('click', '.searchHistoryBtn', function() {
        const city = $(this).text();
        getWeather(city);
        getForecast(city);
    });

    // Function to fetch weather data
    function getWeather(city) {
        const apiKey = '44c9442ccdc6f329627bd36122ae4918';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        
        // Make API request using fetch
        fetch(apiUrl, {
            cache: 'reload' // Force browser to reload data from the server
        })
        .then(function (response) {
            return response.json(); 
        })
        .then(function (data) {
            // Check if weather data is available
            if (data && data.main && data.weather && data.weather.length > 0) {
                const tempFahrenheit = (data.main.temp - 273.15) * 9/5 + 32;
                // Display current weather information
                const weatherInfo = `
                    <h2>Current Weather in ${city}</h2>
                    <p>Description: ${data.weather[0].description}</p>
                    <p>Temperature: ${tempFahrenheit.toFixed(2)}°F</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;
                $('#weatherInfo').html(weatherInfo);
                
                // Add city to search history
                if (!searchHistory.includes(city)) {
                    searchHistory.push(city);
                    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                    renderSearchHistory();
                }
            } else {
                console.error('Error fetching weather data: Invalid data received');
            }
        })
        .catch(function(error) {
            console.error('Error fetching weather data:', error);
        });
    }

    // Click event for search button
    $('#searchBtn').click(function(){
        var city = $('#cityInput').val();
        getWeather(city);
        getForecast(city);
    });
});

function getForecast(city) {
    const apiKey = '44c9442ccdc6f329627bd36122ae4918';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(apiUrl, { cache: 'reload' })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const forecasts = data.list.filter((item, index) => index % 8 === 0); // Filter to get one forecast per day
            const forecastCards = forecasts.map(forecast => {
                const dateTime = new Date(forecast.dt * 1000);
                const date = dateTime.toDateString();
                const tempFahrenheit = (forecast.main.temp - 273.15) * 9/5 + 32;
                const weatherDescription = forecast.weather[0].description;
                const humidity = forecast.main.humidity;
                const windSpeed = forecast.wind.speed;
                
                return `
                    <div class="col">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${date}</h5>
                                <p class="card-text">Temperature: ${tempFahrenheit.toFixed(2)}°F</p>
                                <p class="card-text">Description: ${weatherDescription}</p>
                                <p class="card-text">Humidity: ${humidity}%</p>
                                <p class="card-text">Wind Speed: ${windSpeed} m/s</p>
                            </div>
                        </div>
                    </div>
                `;
            });

            $('#forecastInfo').html(`<h3>5-Day Forecast</h3><div class="row">${forecastCards.join('')}</div>`);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            $('#forecastInfo').html('<p>Failed to fetch forecast data</p>');
        });
}




