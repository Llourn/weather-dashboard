import { fetchCoords, fetchForecast, fetchWeather } from "./fetchers.js";

let dayjsObj = dayjs();

let searchFormEl = document.getElementById("search-form");
let searchResultsEl = document.getElementById("search-results");
let locationContainerEl = document.getElementById("location-container");
let weatherDisplayEl = document.getElementById("weather-display");
let fiveDayDisplayEl = document.getElementById("five-day-display");
let clearSearchEl = document.getElementById("clear-search");

let locationList = [];

searchFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("SUBMIT");
  console.log(event.target);
  submitSearchForm(event.target);
});

clearSearchEl.addEventListener("click", (event) => {
  event.preventDefault();
  searchFormEl.reset();
});

searchResultsEl.addEventListener("click", (event) => {
  console.log("CLICK");
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

    getWeather(event.target);

    locationList.push(location);
    renderLocationListItems();
    // get weather info for this location
    emptyElement(searchResultsEl, ".dynamic");
    updateLocalStorage();
  }
});

locationContainerEl.addEventListener("click", (event) => {
  console.log(event.target);
  console.log("location list, 43");
  const index = event.target.dataset.locationIndex;
  console.log(index);
  if (index >= 0) {
    locationList.splice(index, 1);
    updateLocalStorage();
    renderLocationListItems();
  } else if (event.target.dataset.lon && event.target.dataset.lat) {
    console.log(event.target.dataset.lon, event.target.dataset.lat);
    getWeather(event.target);
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
  // const formData = Object.fromEntries(new FormData(form).entries());
  const formData = form.querySelector('input[name="search-field"]');
  console.log("Test complete.", formData.value);
  console.log(searchFormEl === form);
  if (containsInvalidCharacters(formData.value)) {
    console.log("Invalid Characters");
    return;
  }
  searchResults = await fetchCoords(formData.value);
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
  emptyElement(searchResultsEl, ".dynamic");

  let hr = document.createElement("hr");
  hr.classList.add("dynamic");
  searchResultsEl.append(hr);
  console.log(searchResults.length);
  if (!searchResults.length) {
    let warning = document.createElement("div");
    warning.classList.add("is-warning", "notification", "dynamic");
    warning.textContent = "No results to display. Try again.";
    searchResultsEl.append(warning);
  }

  let cleanedResults = removeDuplicateSearchResults(searchResults);
  cleanedResults.forEach((result) => {
    let locationData = locationDataObj(result);
    let button = document.createElement("button");
    button.classList.add(
      "dynamic",
      "field",
      "button",
      "is-fullwidth",
      "is-primary",
      "is-outlined"
    );
    button.type = "button";
    button.textContent = locationData.name;
    button.dataset.lon = locationData.lon;
    button.dataset.lat = locationData.lat;
    searchResultsEl.append(button);
  });
}

function renderLocationListItems() {
  emptyElement(locationContainerEl, "a");
  locationList.forEach((location, index) => {
    locationContainerEl.append(locationItem(location, index));
  });
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

function locationItem(itemData, index) {
  let item = document.createElement("a");
  item.classList.add("panel-block", "is-active");
  item.setAttribute("data-lon", itemData.lon);
  item.setAttribute("data-lat", itemData.lat);
  let leadingIcon = document.createElement("span");
  leadingIcon.classList.add("panel-icon");
  let leadingIconImg = document.createElement("i");
  leadingIconImg.classList.add("fa-sharp", "fa-solid", "fa-location-dot");
  let itemName = document.createElement("span");
  itemName.textContent = itemData.name;
  let deleteIcon = document.createElement("span");
  deleteIcon.classList.add("panel-icon", "delete");
  deleteIcon.dataset.locationIndex = index;
  // let deleteIconImg = document.createElement("i");
  // deleteIconImg.classList.add("fa-sharp", "fa-solid", "fa-xmark");

  leadingIcon.append(leadingIconImg);
  // deleteIcon.append(deleteIconImg);
  item.append(leadingIcon, itemName, deleteIcon);
  return item;
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

function buildFiveDayCard(timeslot, locationName = "") {
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

function emptyElement(targetElement, selector = "*") {
  console.log("EMPTY", targetElement, selector);
  targetElement
    .querySelectorAll(selector)
    .forEach((element) => element.remove());
}

function updateLocalStorage() {
  localStorage.setItem("locationList", JSON.stringify(locationList));
}

function locationDataObj(data) {
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
