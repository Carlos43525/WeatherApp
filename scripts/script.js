const key = '44d0e3f0f739b241849ebd5be5e41d7f';
const tempSelect = document.querySelector('[data-temp]');
let obj; 
let loc = 'Louisville';
let units = 'imperial'
let chosenUnit = '°F';
let count = 0;

function populateCardHeader(containerDiv, obj) {
    let div = document.createElement('div');

    div.classList.add('card-header'); // Top most div
    containerDiv.appendChild(div);

    let windIcon = document.createElement('i'); // First i element containing wind speed data
    let windSpan = document.createElement('span');
    let windSpeed = document.createTextNode(' ' + Math.round(obj.list[count].wind.speed) + ' mph');
    windSpan.appendChild(windSpeed);
    windIcon.classList.add('fas', 'fa-wind', 'fa-2x');
    windIcon.appendChild(windSpan);
    div.appendChild(windIcon);

    let humidIcon = document.createElement('i'); // Second i element containing humidity data
    let humidSpan = document.createElement('span');
    let humidity = document.createTextNode(' ' + obj.list[count].main.humidity + '%');
    humidSpan.appendChild(humidity)
    humidIcon.classList.add('fas', 'fa-tint', 'fa-2x')
    humidIcon.appendChild(humidSpan);
    div.appendChild(humidIcon);
};

function populateWeatherIcon(containerDiv, obj) {
    // Weather codes are split into groups from 2xx - 8xx
    // i.e. 201 = thunderstorm w/ rain. id takes the weather id
    // and divides it by ten and rounds it. i.e. 201 becomes 
    // 20. This is fed into weatherIconSelect() to select an icon 
    // based on weather. 
    let id = Math.round(obj.list[count].weather[0].id / 10);
    let classId = weatherIconSelect(id);

    let div = document.createElement('div');
    let icon = document.createElement('i');

    div.classList.add('weather-icon');
    icon.classList.add('fas', classId, 'fa-5x');
    div.appendChild(icon);
    containerDiv.appendChild(div);
};

function populateWeatherInfo(containerDiv, obj) {
    let div = document.createElement('div');
    let h2 = document.createElement('h2');
    let h1 = document.createElement('h1');
    let hr = document.createElement('hr');
    let sup = document.createElement('sup');
    let sub = document.createElement('sub');

    div.classList.add('weather-info');
    let name = document.createTextNode(obj.list[count].name);
    let temperature = document.createTextNode(Math.round(obj.list[count].main.temp));
    let unit = document.createTextNode(chosenUnit);
    if (!count > 0) {
        let feelsLike = document.createTextNode('Feels like ' + Math.round(obj.list[count].main.feels_like) + ' ' + chosenUnit);
        sub.appendChild(feelsLike);
    }
    h2.appendChild(name);
    sup.appendChild(unit);
    h1.appendChild(temperature);
    h1.append(sup, sub);
    div.append(h2, hr, h1);

    containerDiv.appendChild(div);
};

function generateWeatherCard() {
    let container = document.querySelector('.container');
    let containerDiv = document.createElement('div');

    containerDiv.classList.add('card', 'card--night');
    container.appendChild(containerDiv);

    populateCardHeader(containerDiv, obj);
    populateWeatherIcon(containerDiv, obj);
    populateWeatherInfo(containerDiv, obj);
};

function weatherIconSelect(id) {
    switch (id) {
        case 20: // 20x thunderstorm weather codes
            return 'fa-bolt';
        case 30: // 30x drizzle
            return 'fa-cloud-rain';
        case 50: // 50x rain
            return 'fa-cloud-showers-heavy';
        case 60: // 60x snow
            return 'fa-snowflake';
        case 70: // 70x atmoshpere (mist, haze, etc.)
            return 'fa-smog';
        case 80: // 80x clear
            return 'fa-sun';
        default: // Represents codes 801-804 (clouds)
            return 'fa-cloud';
    }
};

async function getWeather(loc, units) {
    // grabs 5 day forecast by deafult
    await fetch(`http://api.openweathermap.org/data/2.5/find?q=${loc}&units=${units}&cnt=5&appid=${key}`, 
    { mode: 'cors' })
    .then(res => res.json())
    .then(data => obj = data);
    // .catch(); TODO
    for (let i = 0; i < 5; i++) {
        generateWeatherCard(obj, count);
        count++;
    }
    count = 0; 
};

// Search location 

const submit = document.querySelector('[type="submit"]');

submit.addEventListener('click', (e) => {
    e.preventDefault();
    loc = document.getElementById('loc-search').value;
    console.log(loc);
    getWeather(loc, units);
});

getWeather(loc, units); // generates default weather for Louisville
