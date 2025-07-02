// select the elements
const cardWeahter = document.querySelectorAll('.item');
const searchInput = document.querySelector('#search')
const Suggestions = document.querySelector('#suggestions')

// to get weather by api
async function getWeatherData(ip) {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8e9dfa8c5b3141948f3203031250107&q=${ip}&days=3`);
    const data = await res.json();
    displayToday(data.current, data.location)
    displayForecast(data.forecast.forecastday)
}

//user is asked for permission to report location information if agree get loction from browser (Higher accuracy) else get from weatherApi
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        //successCallback if user allow to get his location from the browser
        pos => getWeatherData(`${pos.coords.latitude},${pos.coords.longitude}`),
        //errorCallback if user didn't allow to get his location from the browser (use weather auto ip)
        _ => getWeatherData('auto:ip')
    );
}

// display the weather of current day
function displayToday(current, location) {
    // get day , weekend & month
    const date = new Date(location.localtime);
    const day = date.getDate();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    // displayCurrent
    cardWeahter[0].innerHTML = `
        <div class="item-header d-flex justify-content-between align-items-center" id="today">
            <p class="day mb-0">${weekday}</p>
            <p class="date mb-0">${day} ${month}</p>
        </div>
        <div class="item-content" id="current">
            <div class="item-content-header d-flex justify-content-between align-items-center">
                <h2 class="location mb-0 fs-3">${location.name} / ${location.country}</h2>
                <span class="weather-icon"><img src="${current.condition.icon}" alt="${current.condition.text}"></span>
            </div>
            <div class="degree">${current.temp_c}<sup>o</sup>C</div>
            <div class="custom fs-4">${current.condition.text}</div>
            <div class="item-content-bottom d-flex justify-content-evenly align-items-center">
                <span><img src="./img/icon-umberella.png" class="me-2" alt="humidity">${current.humidity}%</span>
                <span><img src="./img/icon-wind.png" class="me-2" alt="Wind speed">${current.wind_kph}km/h</span>
                <span><img src="./img/icon-compass.png" class="me-2" alt="Wind direction">${current.wind_dir}</span>
            </div>
        </div>
    `
}

// display the forecast of 2 day after
function displayForecast(forecast) {
    for (let i = 1; i < forecast.length; i++) {
        const date = new Date(forecast[i].date);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        cardWeahter[i].innerHTML = `
            <div class="item-header">
                <p class="day mb-0">${weekday}</p>
            </div>
            <div class="item-content">
                <div class="weather-icon mb-3">
                    <img src="${forecast[i].day.condition.icon}" alt="${forecast[i].day.condition.text}" width="48">
                </div>
                <div class="degree">${forecast[i].day.maxtemp_c}<sup>o</sup>C</div>
                <div class="min"><small>${forecast[i].day.mintemp_c}<sup>o</sup></small></div>
                <div class="custom fs-5">${forecast[i].day.condition.text}</div>
            </div>
        `
    }
}

// display the Suggestions cities list for user by search weatherapi
async function displaySuggestions(value) {
    const res = await fetch(`https://api.weatherapi.com/v1/search.json?key=8e9dfa8c5b3141948f3203031250107&q=${value}`);
    const cities = await res.json();
    Suggestions.innerHTML = "";
    for (let i = 0; i < cities.length; i++) {
        const li = document.createElement("li");
        li.innerText = `${cities[i].name}, ${cities[i].country}`;
        // add event click if user click on element
        li.addEventListener("click", _ => {
            Suggestions.innerHTML = "";
            searchInput.value = cities[i].name;
            getWeatherData(cities[i].name);
        });
        Suggestions.appendChild(li);
    }
}

// while typing display the weather & Suggestions but after value length > 2
searchInput.addEventListener("input", e => {
    if (e.target.value.trim().length > 2) {
        displaySuggestions(e.target.value.trim())
        getWeatherData(e.target.value.trim())
    }
});

// when click outside the input empty it after 0,5s
searchInput.addEventListener("blur", _ => {
    setTimeout(_ => {
        Suggestions.innerHTML = "";
    }, 500);
});

// when click on find button send the input value to city
document.querySelector('.location-form').addEventListener('submit', e => {
    e.preventDefault();
    if (searchInput.value.trim().length > 2) {
        getWeatherData(searchInput.value.trim())
    }
})