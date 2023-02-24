let weatherDisplayEl;
let fiveDayDisplayEl;

export function init() {
  console.log("Weather init");
  weatherDisplayEl = document.getElementById("weather-display");
  fiveDayDisplayEl = document.getElementById("five-day-display");
}

async function getWeather(location) {
  emptyElement(weatherDisplayEl);
  emptyElement(fiveDayDisplayEl);
  showLoading();
  let weatherData = await fetchWeather(
    location.dataset.lat,
    location.dataset.lon
  );

  let forecastData = await fetchForecast(
    location.dataset.lat,
    location.dataset.lon
  );

  setTimeout(() => {
    // I only did this so people could admire the rain cloud I made. 🌧️
    renderWeather(location.textContent, weatherData, forecastData);
    hideLoading();
  }, 1000);
}

function renderWeather(locationName, weatherData, forecastData) {
  emptyElement(weatherDisplayEl);
  emptyElement(fiveDayDisplayEl);
  let currentConditionsEl = document.createElement("h2");
  currentConditionsEl.classList.add("tile", "is-child");
  currentConditionsEl.textContent = "Current Conditions";

  let fiveDayEl = document.createElement("h2");
  // fiveDayEl.classList.add("tile", "is-child");
  fiveDayEl.textContent = "Five Day Forecast";

  weatherDisplayEl.append(
    currentConditionsEl,
    buildWeatherCard(weatherData, locationName)
  );

  let appendCounter = 0;
  forecastData.list.forEach((timeslot) => {
    let time = timeslot.dt_txt.split(" ")[1];

    if (time.includes("12")) {
      if (appendCounter === 0) {
        appendCounter++;
        fiveDayDisplayEl.append(fiveDayEl, buildWeatherCard(timeslot));
      } else {
        fiveDayDisplayEl.append(buildWeatherCard(timeslot));
      }
    }
  });
}

function buildWeatherCard(timeslot, locationName = "") {
  let title;
  let classNames = [];
  if (locationName) {
    classNames.push("todays-weather");
    title = `${locationName} (${dayjsObj.format("dddd D MMM YYYY")})`;
  } else {
    classNames.push("five-day-weather");
    let day = timeslot.dt_txt.split(" ")[0].split("-");
    title = `${day[1]}/${day[2]}/${day[0]}`;
  }

  let weatherCardEl = document.createElement("div");
  weatherCardEl.classList.add("tile", "is-child", "card", ...classNames);
  // card header
  let cardHeaderEl = document.createElement("header");
  cardHeaderEl.classList.add("card-header");
  let headerTitleEl = document.createElement("div");
  headerTitleEl.classList.add("card-header-title");
  headerTitleEl.textContent = title;
  let headerIconEl = document.createElement("div");
  if (locationName) {
    headerIconEl.classList.add("card-header-icon");
    let iconEl = document.createElement("span");
    iconEl.classList.add("icon");
    let iconImgEl = document.createElement("i");
    iconImgEl.classList.add("fa-sharp", "fa-solid", "fa-location-dot");
    iconEl.append(iconImgEl);
    headerIconEl.append(iconEl);
  }
  cardHeaderEl.append(headerTitleEl, headerIconEl);

  // card content
  let cardContentEl = document.createElement("div");
  cardContentEl.classList.add("card-content");
  let contentEl = document.createElement("div");
  contentEl.classList.add("content");
  let weatherImgContainer = document.createElement("div");
  timeslot.weather.forEach((element) => {
    let weatherImgEl = document.createElement("img");
    weatherImgEl.src = `https://openweathermap.org/img/wn/${element.icon}@4x.png`;
    weatherImgEl.alt = element.description;
    weatherImgContainer.append(weatherImgEl);
  });
  let tempEl = document.createElement("div");
  tempEl.textContent = `Temp: ${Math.round(timeslot.main.temp)}°C`;
  let feelsLikeEl = document.createElement("div");
  feelsLikeEl.textContent = `Feels like: ${Math.round(
    timeslot.main.feels_like
  )}°C`;
  let windEl = document.createElement("div");
  windEl.textContent = `Wind: ${getCompassDirection(
    timeslot.wind.deg
  )} ${Math.round(timeslot.wind.speed * 3.6)} km/h`;
  let humidityEl = document.createElement("div");
  humidityEl.textContent = `Humidity: ${timeslot.main.humidity}%`;
  let textContainer = document.createElement("div");
  textContainer.append(tempEl, feelsLikeEl, windEl, humidityEl);
  cardContentEl.append(weatherImgContainer, textContainer);

  weatherCardEl.append(cardHeaderEl, cardContentEl);

  if (locationName) {
    return weatherCardEl;
  } else {
    let parentEl = document.createElement("div");
    parentEl.classList.add("tile", "is-parent");
    parentEl.append(weatherCardEl);
    return parentEl;
  }
}

function getCompassDirection(directionInDegrees) {
  let directionCodes = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
    "N",
  ];
  let index = Math.round(directionInDegrees / 22.5);
  return directionCodes[index];
}
