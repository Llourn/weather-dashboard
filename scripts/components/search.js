import { fetchCoords } from "../utilities/fetchers";
import { emptyElement } from "../utilities/general";

let searchFormEl;
let searchResultsEl;
let clearSearchEl;

export function init() {
  console.log("Search init");
  searchFormEl = document.getElementById("search-form");
  searchResultsEl = document.getElementById("search-results");
  clearSearchEl = document.getElementById("clear-search");
  console.log("searchFormEl", searchFormEl);
  searchFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("sdjkldhs");
    submitSearchForm(event.target);
  });

  clearSearchEl.addEventListener("click", (event) => {
    event.preventDefault();
    searchFormEl.reset();
    emptyElement(searchResultsEl);
  });

  searchResultsEl.addEventListener("click", (event) => {
    let location = {
      name: event.target.textContent,
      lon: event.target.dataset.lon,
      lat: event.target.dataset.lat,
    };

    let existingLocationIndex = isAlreadyInLocationList(location);
    console.log(existingLocationIndex);
    if (existingLocationIndex >= 0) {
      highlightLocationEntry(existingLocationIndex, "error");
      emptyElement(searchResultsEl, ".dynamic");
    } else if (event.target.dataset.lon && event.target.dataset.lat) {
      // Add this city to history list
      locationList.push(location);
      renderLocationListItems();
      highlightLocationEntry(locationList.length - 1, "new");
      // get weather info for this location
      emptyElement(searchResultsEl, ".dynamic");
      updateLocalStorage();
    }
    getWeather(event.target);
  });
}

async function submitSearchForm(form) {
  var searchResults = [];
  // const formData = Object.fromEntries(new FormData(form).entries());
  const formData = form.querySelector('input[name="search-field"]');

  if (containsInvalidCharacters(formData.value)) {
    return;
  }
  searchResults = await fetchCoords(formData.value);

  renderSearchResults(searchResults);
  form.reset();
}

function renderSearchResults(searchResults) {
  emptyElement(searchResultsEl, ".dynamic");

  if (!searchResults.length) {
    modalOpen(
      "There are no results to display. Please re-enter the location and try again."
    );
    return;
  }

  let hr = document.createElement("hr");
  hr.classList.add("dynamic");
  searchResultsEl.append(hr);

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

// TODO: Maybe this should be in locations.js?
function isAlreadyInLocationList(location) {
  return locationList.findIndex((entry) => entry.name === location.name);
}
