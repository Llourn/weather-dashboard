import dayjs from "dayjs";
import {
  fetchCurrentConditions,
  fetchFiveDayForecast,
} from "../utilities/fetchers";
import { emptyElement } from "../utilities/general";
import { hideLoading, showLoading } from "./loading";

let dayjsObj = dayjs();

let weatherDisplayEl;
let fiveDayDisplayEl;

// Initialize weather component
export function init() {
  console.log("初める - Weather init");
  weatherDisplayEl = document.getElementById("current-conditions");
  fiveDayDisplayEl = document.getElementById("five-day-forecast");
}

// Makes api calls for weather data and renders on screen.
export async function getWeather(location) {
  // clear containers for the weather and five day forecast.
  emptyElement(weatherDisplayEl);
  emptyElement(fiveDayDisplayEl);
  showLoading();

  const currentConditionsData = await fetchCurrentConditions(
    location.dataset.lat,
    location.dataset.lon
  );

  const fiveDayForecastData = await fetchFiveDayForecast(
    location.dataset.lat,
    location.dataset.lon
  );

  // I only added the setTimeout so people could admire the rain cloud I made. 🌧️
  setTimeout(() => {
    renderWeather(
      location.textContent,
      currentConditionsData,
      fiveDayForecastData
    );
    hideLoading();
  }, 1000);
}

// renders current conditions and the five day forecast on the screen.
function renderWeather(locationName, weatherData, forecastData) {
  let currentConditionsEl = document.createElement("h2");
  currentConditionsEl.classList.add("tile", "is-child");
  currentConditionsEl.textContent = "Current Conditions";

  let fiveDayEl = document.createElement("h2");
  fiveDayEl.textContent = "Five Day Forecast";

  weatherDisplayEl.append(
    currentConditionsEl,
    buildWeatherCard(weatherData, locationName)
  );

  let needsHeader = true;
  forecastData.list.forEach((timeslot) => {
    let time = timeslot.dt_txt.split(" ")[1];

    // If this timeslot is 12:00 append element
    if (time.includes("12")) {
      if (needsHeader) {
        needsHeader = !needsHeader;
        fiveDayDisplayEl.append(fiveDayEl, buildWeatherCard(timeslot));
      } else {
        fiveDayDisplayEl.append(buildWeatherCard(timeslot));
      }
    }
  });
}

// Build out the card containing the weather.
function buildWeatherCard(timeslot, locationName = "") {
  let title;
  let classNames = [];

  // If a location name is provided, build the card for current conditions.
  if (locationName) {
    // classNames.push("todays-weather");
    title = `${locationName} (${dayjsObj.format("dddd D MMM YYYY")})`;
  } else {
    // classNames.push("five-day-weather");
    let day = timeslot.dt_txt.split(" ")[0].split("-");
    title = `${day[1]}/${day[2]}/${day[0]}`;
  }

  // Build the card
  let weatherCardEl = document.createElement("div");
  weatherCardEl.classList.add("tile", "is-child", "card", ...classNames);

  let cardHeaderEl = document.createElement("header");
  cardHeaderEl.classList.add("card-header");

  let headerTitleEl = document.createElement("div");
  headerTitleEl.classList.add("card-header-title");
  headerTitleEl.textContent = title;

  cardHeaderEl.append(headerTitleEl);

  // if a location name was provided add elements for the current conditions card.
  if (locationName) {
    let headerIconEl = document.createElement("div");
    headerIconEl.classList.add("card-header-icon");

    let iconEl = document.createElement("span");
    iconEl.classList.add("icon");

    let iconImgEl = document.createElement("i");
    iconImgEl.classList.add("fa-sharp", "fa-solid", "fa-location-dot");
    iconEl.append(iconImgEl);

    headerIconEl.append(iconEl);
    cardHeaderEl.append(headerIconEl);
  }

  // Add card content
  let cardContentEl = document.createElement("div");
  cardContentEl.classList.add("card-content");

  let contentEl = document.createElement("div");
  contentEl.classList.add("content");

  let weatherImgContainer = document.createElement("div");

  let weatherImgEl = document.createElement("img");
  weatherImgEl.src = `https://openweathermap.org/img/wn/${timeslot.weather[0].icon}@4x.png`;
  weatherImgEl.alt = timeslot.weather[0].description;
  weatherImgContainer.append(weatherImgEl);

  let temperatureEl = document.createElement("div");
  temperatureEl.textContent = `Temp: ${Math.round(timeslot.main.temp)}°C`;

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
  textContainer.append(temperatureEl, feelsLikeEl, windEl, humidityEl);

  cardContentEl.append(weatherImgContainer, textContainer);

  weatherCardEl.append(cardHeaderEl, cardContentEl);

  // if the location name is provided return the card
  // otherwise wrap the card in another div for css layout.
  if (locationName) {
    return weatherCardEl;
  } else {
    let parentEl = document.createElement("div");
    parentEl.classList.add("tile", "is-parent", "five-day-forecast-card");
    parentEl.append(weatherCardEl);
    return parentEl;
  }
}

// convert wind direction in degrees to compass direction.
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
