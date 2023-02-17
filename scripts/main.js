import { getCoords, getWeather } from "./fetchers.js";

let citySearchFormEl = document.getElementById("city-search-form");
let citySearchResultsEl = document.getElementById("city-search-results");

citySearchFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  submitSearchForm(event.target);
});

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
  generateCitySearchResults(searchResults);
}

function generateCitySearchResults(searchResults) {
  citySearchResultsEl
    .querySelectorAll("*")
    .forEach((element) => element.remove());
  searchResults.forEach((result) => {
    let li = document.createElement("p");
    li.setAttribute("data-lon", result.lon);
    li.setAttribute("data-lat", result.lat);
    let span = document.createElement("span");
    span.textContent = `${result.name}, ${result.state}`;
    li.append(span);
    let button = document.createElement("button");
    button.textContent = "Select";
    li.append(button);
    citySearchResultsEl.append(li);
  });
}

function containsInvalidCharacters(search) {
  return /([0-9])+|,|\.|&/.test(search);
}
