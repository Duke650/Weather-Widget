import { apiKey } from "./env.js"

const form = document.querySelector("form")
const weatherContainer = document.querySelector(".weather-container")




const fetchWeatherDataByCity = async city => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
        const data = await response.json()
        console.log('data :>> ', data);
        const weatherData = {
            name: data.name,
            current_temp: data.main.temp,
            low_temp: data.main.temp_min,
            high_temp: data.main.temp_max,
            forcast: data.weather[0].description,
            weatherId:data.weather[0].id,
            humidity: data.main.humidity
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
    const weatherId = data.weatherId
    if (data) {
        if (weatherId === 800) {
            document.body.className = ""
            document.body.classList.add("sunny");
        } else if (weatherId >= 801 && weatherId <= 804) {
            document.body.className = ""
            document.body.classList.add("clouds");
        } else if (weatherId >= 300 && weatherId <= 531) {
            document.body.className = ""
            document.body.classList.add("rain");
        } else if (weatherId >= 600 && weatherId <= 622) {
            document.body.className = ""
            document.body.classList.add("snow");
        } else {
            document.body.className = ""
            document.body.className = "default"
        }
        weatherContainer.innerHTML = `
        <div class="weather-card">
            <h4 class="city-name">${data.name}</h4>
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
        weatherContainer.innerHTML = `
        <p>Please enter a valid location</p>
        `
    }
        

}