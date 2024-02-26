import { apiKey } from "/env.js"

const form = document.querySelector("form")
const weatherContainer = document.querySelector(".weather-container")
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();
console.log(`Current time: ${hours}:${minutes}:${seconds}`);

const getLocalTime = offsetTime => {
    const utcTime = new Date();
    const localTimeZoneOffsetInMinutes = utcTime.getTimezoneOffset();
    const totalOffsetInSeconds = localTimeZoneOffsetInMinutes * 60 + offsetTime;
    const localTime = new Date(utcTime.getTime() + totalOffsetInSeconds * 1000)
    let hours = localTime.getHours().toString().padStart(2, '0');
    const minutes = localTime.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const time = `${hours}:${minutes} ${ampm}`
    return time
}

const fetchWeatherDataByCity = async city => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
        const data = await response.json()
        const localTime = getLocalTime(data.timezone)
        const weatherData = {
            name: data.name,
            current_temp: data.main.temp,
            low_temp: data.main.temp_min,
            high_temp: data.main.temp_max,
            forcast: data.weather[0].description,
            weatherId:data.weather[0].id,
            humidity: data.main.humidity,
            localTime: localTime
        }
        return weatherData
    } catch (error) {
        console.error(error);
    }
}

form.addEventListener("submit", async e => {
    e.preventDefault()
    let inputText = form[0].value
    const weatherData = await fetchWeatherDataByCity(inputText)
    
    addWeatherData(weatherData)
})

const addWeatherData = data => {
    if (data) {
        if (data.weatherId === 800) {
            document.body.className = ""
            document.body.classList.add("sunny");
        } else if (data.weatherId >= 801 && data.weatherId <= 804) {
            document.body.className = ""
            document.body.classList.add("clouds");
        } else if (data.weatherId >= 300 && data.weatherId <= 531) {
            document.body.className = ""
            document.body.classList.add("rain");
        } else if (data.weatherId >= 600 && data.weatherId <= 622) {
            document.body.className = ""
            document.body.classList.add("snow");
        } else {
            document.body.className = ""
            document.body.className = "default"
        }
        weatherContainer.innerHTML = `
        <div class="weather-card">
            <h4 class="city-name">${data.name}</h4>
            <p class="time">${data.localTime}</p>
            <div>
                <strong><p>Temperature</p></strong>
                <p class="current-temp">${Math.floor(data.current_temp)}&deg F</p>
            </div>
            <div>
                <strong><p>High</p></strong>
                <p class="high-temp">${Math.floor(data.high_temp)}&deg F</p>
            </div>
            <div>
                <strong><p>Low</p></strong>
                <p class="low-temp">${Math.floor(data.low_temp)}&deg F</p>
            </div>
            <div>
                <strong><p>Humidity</p></strong>
                <p class="humitity">${data.humidity} %</p>
            </div>
            <div>
                <strong><p>Forcast</p></strong>
                <p class="forcast">${data.forcast}</p>
            </div>
        </div>
    `
    } else {
        console.log('data :>> ', data);
        weatherContainer.innerHTML = `
        <p class="warning">Please enter a valid location</p>
        `
    }
        

}