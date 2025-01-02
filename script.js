const apiKey = "68a9a96a0d7b3a942756b9ccdb8b025f"; // Your API Key

document.getElementById("location-btn").addEventListener("click", getWeatherForLocation);
document.getElementById("search-btn").addEventListener("click", getWeatherForCity);

async function getWeatherForLocation() {
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchWeatherData(`lat=${latitude}&lon=${longitude}`);
    }, () => showError("Unable to retrieve your location."));
}

async function getWeatherForCity() {
    const city = document.getElementById("location-input").value.trim();
    if (!city) {
        showError("Please enter a city name.");
        return;
    }
    await fetchWeatherData(`q=${city}`);
}

async function fetchWeatherData(query) {
    const apiUrl = `/weather?${query}`; // Server will proxy this request
    console.log(`Requesting: ${apiUrl}`); // Add this line to debug
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch weather data.");
        const data = await response.json();
        console.log("Weather data received:", data); // Log the response
        showWeather(data);
    } catch (error) {
        console.error("Error in fetchWeatherData:", error);
        showError("Could not fetch weather data. Please try again.");
    }
}

function showWeather(data) {
    document.getElementById("error-message").classList.add("hidden");
    const { name } = data;
    const { temp } = data.main;
    const { description } = data.weather[0];
    const { humidity } = data.main;
    const { speed: windSpeed } = data.wind;

    document.getElementById("location-name").textContent = `Location: ${name}`;
    document.getElementById("temperature").textContent = `Temperature: ${temp}°C`;
    document.getElementById("description").textContent = `Condition: ${description}`;
    document.getElementById("additional-info").textContent = `Humidity: ${humidity}%, Wind Speed: ${windSpeed} m/s`;

    document.getElementById("weather-result").classList.remove("hidden");
}

function showError(message) {
    const errorElem = document.getElementById("error-message");
    errorElem.textContent = message;
    errorElem.classList.remove("hidden");
    document.getElementById("weather-result").classList.add("hidden");
}
