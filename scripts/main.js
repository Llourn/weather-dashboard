import { fetchCoords, fetchForecast, fetchWeather } from "./fetchers.js";

let dayjsObj = dayjs();

let searchFormEl = document.getElementById("city-search-form");
let searchResultsEl = document.getElementById("city-search-results");
let locationContainerEl = document.getElementById("location-container");
let weatherDisplayEl = document.getElementById("weather-display");

let locationList = [];

searchFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event.target);
  submitSearchForm(event.target);
});

locationContainerEl.addEventListener("click", (event) => {
  const index = event.target.dataset.locationIndex;
  if (index >= 0) {
    locationList.splice(index, 1);
    updateLocalStorage();
    renderLocationListItems();
  } else if (event.target.dataset.lon && event.target.dataset.lat) {
    getWeather(event.target);
  }
});

searchResultsEl.addEventListener("click", (event) => {
  let location = {
    name: event.target.textContent,
    lon: event.target.dataset.lon,
    lat: event.target.dataset.lat,
  };

  if (isAlreadyInLocationList(location)) {
    console.log("ALREADY EXISTS");
    // TODO Add a modal to notify the user.
  } else if (event.target.dataset.lon && event.target.dataset.lat) {
    // Add this city to history list

    locationList.push(location);
    renderLocationListItems();
    // get weather info for this location
    emptyElement(searchResultsEl);
    updateLocalStorage();
  }
});

function init() {
  locationList = JSON.parse(localStorage.getItem("locationList"));

  if (locationList) {
    renderLocationListItems();
  } else {
    locationList = [];
  }
}

init();

async function submitSearchForm(form) {
  var searchResults = [];
  const formData = Object.fromEntries(new FormData(form).entries());
  console.log("Test complete.", formData);
  if (containsInvalidCharacters(formData.citySearch)) {
    console.log("Invalid Characters");
    return;
  }
  searchResults = await fetchCoords(formData.citySearch);
  console.log(searchResults);
  renderSearchResults(searchResults);
  form.reset();
}

async function getWeather(location) {
  let weatherData = await fetchWeather(
    location.dataset.lat,
    location.dataset.lon
  );

  let forecastData = await fetchForecast(
    location.dataset.lat,
    location.dataset.lon
  );
  renderWeather(location.textContent, weatherData, forecastData);
}

function renderSearchResults(searchResults) {
  emptyElement(searchResultsEl);
  let cleanedResults = removeDuplicateSearchResults(searchResults);
  cleanedResults.forEach((result) => {
    let locationData = locationButtonObj(result);
    searchResultsEl.append(locationButton(locationData));
  });
}

function renderLocationListItems() {
  emptyElement(locationContainerEl);
  locationList.forEach((location, index) => {
    let locationEl = document.createElement("div");
    locationEl.append(locationButton(location));
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("button", "is-danger");
    deleteBtn.dataset.locationIndex = index;
    // deleteBtn.textContent = "X";
    let icon = document.createElement("i");
    icon.classList.add("fa-sharp", "fa-solid", "fa-xmark");
    deleteBtn.append(icon);
    // deleteBtn.innerHTML = `<i class="fa-sharp fa-solid fa-xmark"></i>`;
    locationEl.append(deleteBtn);
    locationContainerEl.append(locationEl);
  });
}

function renderWeather(locationName, weatherData, forecastData) {
  weatherDisplayEl.append(buildWeatherCard(weatherData, locationName));

  forecastData.list.forEach((timeslot) => {
    let time = timeslot.dt_txt.split(" ")[1];

    if (time.includes("12")) {
      weatherDisplayEl.append(buildWeatherCard(timeslot));
    }
  });
}

function locationButton(buttonData) {
  let button = document.createElement("button");
  button.classList.add("button");
  button.setAttribute("data-lon", buttonData.lon);
  button.setAttribute("data-lat", buttonData.lat);
  button.textContent = `${buttonData.name}`;
  return button;
}

function buildWeatherCard(timeslot, locationName = "") {
  let title;
  let classNames = ["column"];
  if (locationName) {
    classNames.push("todays-weather");
    title = `${locationName} (${dayjsObj.format("dddd D MMM YYYY")})`;
  } else {
    classNames.push("five-day-weather");
    let day = timeslot.dt_txt.split(" ")[0].split("-");
    title = `${day[1]}/${day[2]}/${day[0]}`;
  }

  let weatherEl = document.createElement("div");
  weatherEl.classList.add(...classNames);
  let titleEl = document.createElement("p");
  titleEl.textContent = title;
  let weatherImgContainer = document.createElement("div");

  timeslot.weather.forEach((element) => {
    let weatherImgEl = document.createElement("img");
    weatherImgEl.src = `https://openweathermap.org/img/wn/${element.icon}@2x.png`;
    weatherImgEl.alt = element.description;
    weatherImgContainer.append(weatherImgEl);
  });
  let tempEl = document.createElement("p");
  tempEl.textContent = `Temp: ${Math.round(timeslot.main.temp)}`;
  let feelsLikeEl = document.createElement("p");
  feelsLikeEl.textContent = `Feels like: ${Math.round(
    timeslot.main.feels_like
  )}`;
  let windEl = document.createElement("div");
  windEl.textContent = `Wind: ${getCompassDirection(
    timeslot.wind.deg
  )} ${Math.round(timeslot.wind.speed * 3.6)} km/h`;
  let humidityEl = document.createElement("p");
  humidityEl.textContent = `Humidity: ${timeslot.main.humidity}%`;

  weatherEl.append(
    titleEl,
    weatherImgContainer,
    tempEl,
    feelsLikeEl,
    windEl,
    humidityEl
  );

  return weatherEl;
}

function containsInvalidCharacters(search) {
  return /([0-9])+|,|\.|&/.test(search);
}

function removeDuplicateSearchResults(arr) {
  let newArr = arr.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.name === value.name &&
          t.state === value.state &&
          t.country === value.country
      )
  );
  return newArr;
}

function emptyElement(targetElement) {
  targetElement.querySelectorAll("*").forEach((element) => element.remove());
}

function updateLocalStorage() {
  localStorage.setItem("locationList", JSON.stringify(locationList));
}

function locationButtonObj(data) {
  let name = "";
  if (data.name) name += data.name;
  if (data.state) name += `, ${data.state}`;
  if (data.country) name += `, ${data.country}`;

  return {
    name: name,
    lon: data.lon,
    lat: data.lat,
  };
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

function isAlreadyInLocationList(location) {
  return locationList.find((entry) => {
    return entry.name === location.name;
  });
}
