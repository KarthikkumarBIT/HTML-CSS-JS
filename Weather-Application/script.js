const weatherCodeMap = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    61: "Light rain",
    71: "Snow fall",
    95: "Thunderstorm",
};

const apiKey = "b78020823bc140ebefea8e1a63a598b8";
const city = "dharapuram";

let isCelcius = true;

let hourlyData = [];
let dailyData = [];
let place="Dharapuram";

let cur_hour=document.querySelector(".now");
let cur_day=document.querySelector(".today");

function getWeatherIconClass(code) {
    const iconMap = {
        0: "wi wi-day-sunny",
        1: "wi wi-day-sunny-overcast",
        2: "wi wi-day-cloudy",
        3: "wi wi-cloudy",
        45: "wi wi-fog",
        48: "wi wi-fog",
        51: "wi wi-showers",
        61: "wi wi-rain",
        71: "wi wi-snow",
        95: "wi wi-thunderstorm"
    };
    return iconMap[code] || "wi wi-na";
}

async function getlocation(lat,lon){
    const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    
    const geores=await fetch(geoUrl);
    const location = await geores.json();
    
    place = location.city;
    console.log(location);
}

async function getCoordinates(city) {
    try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

        const response = await fetch(geoUrl);
        const data = await response.json();
        console.log(data);

        if (data.length === 0) throw new Error("City not found");
        place = data[0].name;
        getWeather(data[0].lat, data[0].lon);
    }
    catch (error) {
        if (error.message === "City not found") 
            alert("City not found. Please enter a valid city name.");
        else  
            alert("Failed to get coordinates. Please check your internet or try again.");
    }
}

async function getWeather(lat,lon) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,weathercode,windspeed_10m_max&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm&timezone=auto`;

    let Result;
    try{
        Result=await fetch(weatherUrl);
    }
    catch(err){

        let retryCount=prompt("Request failed how many shall i retry.")

        let temp=trying(weatherUrl,0,retryCount);
        if(temp=="error"){
            console.log(err);
            return;
        }
        else 
            Result=temp;
    }

    console.log(Result);

    const data = await Result.json();

    console.log(data);
    
    hourlyData = [];
    dailyData = [];
    const now = new Date();

    
    now.setMinutes(0,0,0);

    for (let i = 0, count = 0; i < data.hourly.time.length && count < 12; i++) {
        
        const timeISO = new Date(data.hourly.time[i]);
        
        if (timeISO >= now) {
            const timeLabel = count === 0 ? "Now" : timeISO.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            
            hourlyData.push({
                time: timeLabel,
                feelslikeC: `${data.hourly.apparent_temperature[i]}°C`,
                feelslikeF: `${celToFah(data.hourly.apparent_temperature[i])}°F`,
                humidity: `${data.hourly.relative_humidity_2m[i]}%`,
                precipitation: `${data.hourly.precipitation_probability[i]}%`,
                windspeed: `${data.hourly.windspeed_10m[i]}km/hr`,
                tempC: `${data.hourly.temperature_2m[i]}°C`,
                tempF: `${celToFah(data.hourly.temperature_2m[i])}°F`,
                weatherCode: data.hourly.weathercode[i],
            });
            count++;
        }
    }

    for (let i = 0; i < 7; i++) {

        const dateObj = new Date(data.daily.time[i]);
        const day = i === 0 ? "Today" : dateObj.toLocaleDateString("en-in", { weekday: "short" });

        const dateStr = dateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit" });
        dailyData.push({
            day,
            date: dateStr,
            tempC: `${data.daily.temperature_2m_max[i]}°C`,
            tempF: `${celToFah(data.daily.temperature_2m_max[i])}°F`,
            
            feelslikeC: `${data.daily.apparent_temperature_max[i]}°C`,
            feelslikeF: `${celToFah(data.daily.apparent_temperature_max[i])}°F`,
            humidity: `${data.hourly.relative_humidity_2m[i]}%`,
            precipitation: `${data.daily.precipitation_probability_max[i]}%`,
            windspeed: `${data.daily.windspeed_10m_max[i]}km/hr`,
            weatherCode: data.daily.weathercode[i],
            description: weatherCodeMap[data.daily.weathercode[i]] || "Unknown"
        });
    }

    updateMainPanel(dailyData[0]);
    updateForecast("hourly", hourlyData);
    updateForecast("daily", dailyData);
}

function updateForecast(type,data){
    const container = document.querySelector(type === "hourly" ? ".hourly-scroll" : ".daily-scroll");
    const allCards = container.children;

    for (let i = 0; i < data.length; i++) {
        const current = data[i];
        const card = allCards[i];

        if (type === "hourly") {
            card.className = "timely-update" + (i === 0 ? " now" : "");
            card.querySelector(".time").textContent = current.time;
            card.querySelector(".temp").textContent = isCelcius ? current.tempC : current.tempF;
            card.querySelector("i").className = getWeatherIconClass(current.weatherCode);
        } else {
            card.className = "daily-update" + (i === 0 ? " today" : "");

            const left = card.querySelector(".daily-update-left");
            left.querySelector(".day").textContent = current.day;
            left.querySelector(".date").textContent = current.date;
            left.querySelector(".temp").textContent = isCelcius ? current.tempC : current.tempF;

            const right = card.querySelector(".daily-update-right");
            right.querySelector(".situation").textContent = current.description;
            right.querySelector("i").className = getWeatherIconClass(current.weatherCode);
        }
    }
}

function toggleUpdateForecast(type,data){
    const container = document.querySelector(type === "hourly" ? ".hourly-scroll" : ".daily-scroll");
    const allCards = container.children;

    for (let i = 0; i < data.length; i++) {
        const current = data[i];
        const card = allCards[i];

        if (type === "hourly") {
            card.querySelector(".temp").textContent = isCelcius ? current.tempC : current.tempF;
        }
        else {
            const left = card.querySelector(".daily-update-left");
            left.querySelector(".temp").textContent = isCelcius ? current.tempC : current.tempF;
        }
    }
}  

function updateMainPanel(current) {
    const dateInfo = current.date ? current.date : dailyData[0].date;
    document.getElementById("temperature-data").textContent = isCelcius ? current.tempC : current.tempF;
    document.getElementById("description-data").textContent = weatherCodeMap[current.weatherCode];
    document.getElementById("detailed-desc").textContent = place+"  "+dateInfo;
    document.getElementById("feelslike").textContent = isCelcius ? current.feelslikeC : current.feelslikeF;
    document.getElementById("humidity").textContent = current.humidity;
    document.getElementById("precipitation").textContent = current.precipitation;
    document.getElementById("windspeed").textContent = current.windspeed;
}

function toggleUpdateMainPanel(current) {
    document.getElementById("temperature-data").textContent = isCelcius ? current.tempC : current.tempF;
    document.getElementById("feelslike").textContent = isCelcius ? current.feelslikeC : current.feelslikeF;
}

function celToFah(c) {
    return (c * 9/5 + 32).toFixed(1);
}

document.addEventListener("DOMContentLoaded", () => {
    getCoordinates("dharapuram");

    const input = document.querySelector(".search-bar");
    input.addEventListener("keydown", (event) => {
        const city = input.value.trim();
        if (event.key === "Enter") getCoordinates(city);
    });

    document.getElementById("unitToggle").addEventListener("change", () => {
        isCelcius = !isCelcius;
        toggleUpdateForecast("hourly", hourlyData);
        toggleUpdateForecast("daily", dailyData);
        toggleUpdateMainPanel(hourlyData[0]);
    });

    document.getElementById("get-location").addEventListener("click", () => {
        
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                await getlocation(lat, lon);
                getWeather(lat, lon);
            });
        }
    });

    const hourlyCards = document.querySelectorAll(".timely-update");
    hourlyCards.forEach((card, index) => {
        card.addEventListener("click", () => {
            cur_hour.classList.remove("now");
            card.classList.add("now");
            cur_hour = card;
            updateMainPanel(hourlyData[index]);
        });
    });

    const dailyCards = document.querySelectorAll(".daily-update");
    dailyCards.forEach((card, index) => {
        card.addEventListener("click", () => {
            cur_day.classList.remove("today");
            card.classList.add("today");
            cur_day = card;
            updateMainPanel(dailyData[index]);
        });
    });
});