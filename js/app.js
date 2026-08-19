// ============================================
// MAIN APP - Entry point and orchestration
// ============================================

const RECENT_STORAGE_KEY = "weatherRecentCities";
const MAX_RECENT = 5;

// Get DOM elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

/**
 * Main search function
 * @param {string} city - City name to search
 */
async function searchCity(city) {
    if (!city || city.trim() === "") {
        showError("Please enter a city name.");
        return;
    }

    city = city.trim();

    // Show loader
    showLoader();

    try {
        // Fetch weather and forecast in parallel
        const [weatherData, forecastData] = await Promise.all([
            fetchWeather(city),
            fetchForecast(city),
        ]);

        // Display data
        displayWeather(weatherData);
        displayForecast(forecastData);

        // Save to recent searches
        saveRecentCity(city);

        // Hide error
        document.getElementById("errorMessage").style.display = "none";
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoader();
    }
}

/**
 * Save city to recent searches (localStorage)
 * @param {string} city - City name
 */
function saveRecentCity(city) {
    let recent = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY)) || [];

    // Remove if already exists
    recent = recent.filter((c) => c.toLowerCase() !== city.toLowerCase());

    // Add to beginning
    recent.unshift(city);

    // Limit to MAX_RECENT
    if (recent.length > MAX_RECENT) {
        recent = recent.slice(0, MAX_RECENT);
    }

    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recent));
    updateRecentSearches(recent);
}

/**
 * Load recent searches from localStorage
 */
function loadRecentSearches() {
    const recent = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY)) || [];
    updateRecentSearches(recent);
    return recent;
}

/**
 * Get user's current location and fetch weather
 */
function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }

    showLoader();

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Use reverse geocoding or fetch by coordinates
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
                const response = await fetch(url);
                const data = await response.json();

                if (response.ok) {
                    const city = data.name;
                    document.getElementById("cityInput").value = city;
                    await searchCity(city);
                } else {
                    throw new Error("Unable to get weather for your location.");
                }
            } catch (error) {
                showError(error.message);
                hideLoader();
            }
        },
        (error) => {
            showError("Unable to access your location. Please search manually.");
            hideLoader();
        }
    );
}

// ============================================
// EVENT LISTENERS
// ============================================

// Search button click
searchBtn.addEventListener("click", () => {
    searchCity(cityInput.value);
});

// Enter key press in input
cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchCity(cityInput.value);
    }
});

// Auto-focus input on page load
window.addEventListener("load", () => {
    cityInput.focus();
    loadRecentSearches();

    // Optional: Auto-detect location on first load
    // Uncomment the line below to enable auto-location on load
    // getCurrentLocationWeather();
});

// ============================================
// EXPOSE FUNCTIONS FOR TESTING
// ============================================

// For debugging in browser console
window.test = {
    searchCity,
    fetchWeather,
    fetchForecast,
    displayWeather,
    displayForecast,
};
