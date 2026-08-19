// ============================================
// API CONFIGURATION
// ============================================

const API_KEY = "YOUR KEY"
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Fetch current weather data for a given city
 * @param {string} city - City name
 * @returns {Promise<object>} Weather data
 */
async function fetchWeather(city) {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("City not found. Please check the spelling.");
        } else {
            throw new Error("Something went wrong. Please try again.");
        }
    }

    return await response.json();
}

/**
 * Fetch 5-day forecast for a given city
 * @param {string} city - City name
 * @returns {Promise<object>} Forecast data
 */
async function fetchForecast(city) {
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to fetch forecast data.");
    }

    return await response.json();
}
