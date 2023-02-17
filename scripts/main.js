import { getCoords, getWeather } from "./fetchers.js";

let searchFormEl = document.getElementById("city-search-form");
let searchResultsEl = document.getElementById("city-search-results");
let locationContainerEl = document.getElementById("location-container");

let locationList = [];

searchFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  submitSearchForm(event.target);
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
    locationContainerEl.append(event.target);
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
  searchResults = await getCoords(formData.citySearch);
  console.log(searchResults);
  renderSearchResults(searchResults);
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
  console.log(locationList);
  locationList.forEach((location) => {
    locationContainerEl.append(locationButton(location));
  });
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
