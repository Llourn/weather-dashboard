import { fetchLocationCoords } from "../utilities/fetchers";
import { emptyElement } from "../utilities/general";
import locationsData from "../models/locationsData";
import { renderLocationListItems, highlightLocationEntry } from "./locations";
import { getWeather } from "./weather";
import { modalOpen } from "./modal";

let searchFormEl;
let searchResultsEl;
let clearSearchEl;

// Initialize the search component.
export function init() {
  console.log("初める - Search init");

  searchFormEl = document.getElementById("search-form");
  searchResultsEl = document.getElementById("search-results");
  clearSearchEl = document.getElementById("clear-search");

  // Search form submit event.
  searchFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    submitSearchForm();
  });

  // Click event clears search form and search results
  clearSearchEl.addEventListener("click", (event) => {
    event.preventDefault();
    searchFormEl.reset();
    emptyElement(searchResultsEl);
  });

  // Click event, click item in search results will attempt to add
  // it to locations.
  searchResultsEl.addEventListener("click", (event) => {
    if (event.target.tagName !== "BUTTON") return;

    let location = {
      name: event.target.textContent,
      lon: event.target.dataset.lon,
      lat: event.target.dataset.lat,
    };

    // Check if the location already exists in the location list.
    let existingLocationIndex = isAlreadyInLocationData(location);

    // if the location already exists in the location list highlight it red.
    if (existingLocationIndex >= 0) {
      highlightLocationEntry(existingLocationIndex, "error");
      emptyElement(searchResultsEl, ".dynamic");

      // otherwise, add it to the locations list and highlight it green.
    } else if (event.target.dataset.lon && event.target.dataset.lat) {
      locationsData.add(location);
      renderLocationListItems();
      highlightLocationEntry(locationsData.all().length - 1, "new");
      emptyElement(searchResultsEl, ".dynamic");
    }
    // get the weather for the selected location.
    getWeather(event.target);
  });
}

// Collects data from the form, validates the data then calls the location
// coords api.
async function submitSearchForm() {
  var searchResults = [];
  const formData = searchFormEl.querySelector('input[name="search-field"]');

  // If the form contains invalid characters display error via modal.
  if (containsInvalidCharacters(formData.value)) {
    modalOpen(
      "Invalid characters entered in search field. Please clear the search field and try again."
    );

    // else make API call for location coords and render results.
  } else {
    searchResults = await fetchLocationCoords(formData.value);
    renderSearchResults(searchResults);
  }

  searchFormEl.reset();
}

// Renders search results on screen as buttons.
function renderSearchResults(searchResults) {
  // clears search results if there are any.
  emptyElement(searchResultsEl, ".dynamic");

  // If no results are returned, display error and reset form
  if (!searchResults.length) {
    modalOpen(
      "There are no results to display. Please re-enter the location and try again."
    );
    searchFormEl.reset();
    return;
  }

  // create a hr seperator for the search results.
  let hr = document.createElement("hr");
  hr.classList.add("dynamic");

  searchResultsEl.append(hr);

  // remove any duplicates in the search results.
  let cleanedResults = removeDuplicateSearchResults(searchResults);

  // Generate a button for every result.
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

// Check for invalid characters.
function containsInvalidCharacters(search) {
  return /([0-9])+|,|\.|&/.test(search);
}

// Filters duplicates from the array
function removeDuplicateSearchResults(results) {
  let newResults = results.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.name === value.name &&
          t.state === value.state &&
          t.country === value.country
      )
  );
  return newResults;
}

// Create a location data object
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

// Checks if location is already in location data.
function isAlreadyInLocationData(location) {
  return locationsData.all().findIndex((entry) => entry.name === location.name);
}
