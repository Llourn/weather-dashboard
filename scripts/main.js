import { fetchCoords, fetchForecast, fetchWeather } from "./fetchers.js";

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
    clearSearchResults();
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
  renderWeather(weatherData, forecastData);
}

function renderSearchResults(searchResults) {
  clearSearchResults();
  let cleanedResults = removeDuplicateSearchResults(searchResults);
  cleanedResults.forEach((result) => {
    let locationData = locationButtonObj(result);
    searchResultsEl.append(locationButton(locationData));
  });
}

function renderLocationListItems() {
  clearLocationContainer();
  locationList.forEach((location, index) => {
    let locationEl = document.createElement("div");
    locationEl.append(locationButton(location));
    let deleteBtn = document.createElement("button");
    deleteBtn.dataset.locationIndex = index;
    deleteBtn.textContent = "❌";
    locationEl.append(deleteBtn);
    locationContainerEl.append(locationEl);
  });
}

function renderWeather(weatherData, forecastData) {
  console.log("RENDER WEATHER");
  console.log(weatherData);
  console.log(forecastData);
  let currentDay = "";
  let container;
  forecastData.list.forEach((timeslot) => {
    let timeslotDay = timeslot.dt_txt.split(" ")[0];
    if (currentDay) weatherDisplayEl.append(container);
    if (currentDay != timeslotDay) {
      // console.log(timeslotDay);
      currentDay = timeslotDay;
      container = document.createElement("div");
      container.classList.add("day-container");
    }
    let weatherEl = document.createElement("div");
    weatherEl.textContent = timeslotDay;
    // console.log(weatherEl);
    container.append(weatherEl);
  });
}

// NOTES: So instead of just a single card for each day, I want to split the forecast into day and night.
// And then a link to load the hourly forecast

function weatherCard(data) {
  let container = document.createElement("div");
}

function locationButton(buttonData) {
  console.log(buttonData);
  let button = document.createElement("button");
  button.setAttribute("data-lon", buttonData.lon);
  button.setAttribute("data-lat", buttonData.lat);
  button.textContent = `${buttonData.name}`;
  return button;
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

function clearSearchResults() {
  searchResultsEl.querySelectorAll("*").forEach((element) => element.remove());
}

function clearLocationContainer() {
  locationContainerEl
    .querySelectorAll("*")
    .forEach((element) => element.remove());
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

function isAlreadyInLocationList(location) {
  return locationList.find((entry) => {
    return entry.name === location.name;
  });
}
