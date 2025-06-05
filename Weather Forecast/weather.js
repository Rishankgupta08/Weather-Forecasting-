const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '43c83efa2emsh1676ece0863636bp1fe48fjsnbf8dd4b4652b',
    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
  }
};

const locationEl = document.querySelector(".location");
const tempEl = document.querySelector(".temp");
const descEl = document.querySelector(".description");
const refreshBtn = document.getElementById("refreshBtn");
const forecastContainer = document.getElementById("forecastContainer");
const themeBtn = document.getElementById("themeBtn");
const loadingEl = document.getElementById("loading");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

let city = "Delhi,IN";

// Theme switch function
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeBtn.textContent = document.body.classList.contains("light") ? "🌙 Dark Theme" : "🌓 Light Theme";
});

// Set background based on weather
function setWeatherBackground(weatherText) {
  const body = document.body;
  const text = weatherText.toLowerCase();
  if (text.includes("sun") || text.includes("clear")) {
    body.style.background = "linear-gradient(135deg, #f6d365, #fda085)";
  } else if (text.includes("rain") || text.includes("drizzle")) {
    body.style.background = "linear-gradient(135deg, #4b6cb7, #182848)";
  } else if (text.includes("cloud") || text.includes("overcast")) {
    body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
  } else {
    body.style.background = "radial-gradient(circle at top left, #2e2e2e, #121212)";
  }
}

// Search function
searchBtn.addEventListener("click", () => {
  if (searchInput.value.trim()) {
    city = searchInput.value.trim();
    fetchWeather();
  }
});

async function fetchWeather() {
  loadingEl.style.display = "block";
  try {
    const res = await fetch(`https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=5`, options);
    const data = await res.json();

    locationEl.textContent = `${data.location.name}, ${data.location.country}`;
    tempEl.textContent = `${data.current.temp_c}°C`;
    descEl.textContent = data.current.condition.text;
    humidityEl.textContent = `${data.current.humidity}%`;
    windEl.textContent = `${data.current.wind_kph} km/h`;

    setWeatherBackground(data.current.condition.text);

    forecastContainer.innerHTML = "";
    data.forecast.forecastday.forEach((day, index) => {
      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
        <p>${day.date}</p>
        <img src="https:${day.day.condition.icon}" alt="icon">
        <p>${day.day.avgtemp_c}°C</p>
      `;
      card.style.animationDelay = `${0.1 * index}s`;
      forecastContainer.appendChild(card);
    });

  } catch (err) {
    locationEl.textContent = "Error loading data";
    tempEl.textContent = "--°C";
    descEl.textContent = "Try again";
    humidityEl.textContent = "--%";
    windEl.textContent = "-- km/h";
    console.error("Fetch Error:", err);
  } finally {
    loadingEl.style.display = "none";
  }
}

refreshBtn.addEventListener("click", fetchWeather);
fetchWeather();
