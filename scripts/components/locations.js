import { emptyElement } from "../utilities/general";
import locationsData from "../models/locationsData";
import { getWeather } from "./weather";

let locationContainerEl;

// initialize Locations component.
function init() {
  console.log("初める - Locations init");
  locationContainerEl = document.getElementById("location-container");

  renderLocationListItems();

  // Use event delegation on the locationsContainer to apply actions to
  // the a tags and the delete buttons.
  locationContainerEl.addEventListener("click", (event) => {
    const index = event.target.parentElement.dataset.locationIndex;

    // if the target has an index, this means a delete button was clicked.
    // remove location from the rendered list and from the locationsData array.
    if (index >= 0) {
      let newLocationsData = locationsData.all();
      newLocationsData.splice(index, 1);
      locationsData.replace(newLocationsData);
      renderLocationListItems();

      // if the target has a longitute and lattitude, load the weather.
    } else if (event.target.dataset.lon && event.target.dataset.lat) {
      getWeather(event.target);
    }
  });
}

function renderLocationListItems() {
  emptyElement(locationContainerEl, "a");
  if (locationsData.all().length > 0) {
    locationsData.all().forEach((location, index) => {
      locationContainerEl.append(locationItem(location, index));
    });
  } else {
    let defaultView = document.createElement("a");
    defaultView.classList.add("panel-block", "is-active", "location-entry");
    defaultView.textContent = "Locations you searched for will show up here!";
    locationContainerEl.append(defaultView);
  }
}

// Highlights an entry in the locations list when a location is added.
// Or if the location is already in the list.
function highlightLocationEntry(index, state) {
  let entries = locationContainerEl.querySelectorAll("[data-location-index]");

  if (entries) {
    entries.forEach((entry) => {
      entry.classList.remove(`shine-${state}`);
      // A setTimeout is required to make sure the remove/re-add triggers the css animation.
      setTimeout(() => {
        if (entry.dataset.locationIndex == index) {
          entry.classList.add(`shine-${state}`);
        }
      }, 1);
    });
  }
}

// Build the location item used in the locations container.
function locationItem(itemData, index) {
  let item = document.createElement("a");
  item.classList.add("panel-block", "is-active", "location-entry");
  item.setAttribute("data-lon", itemData.lon);
  item.setAttribute("data-lat", itemData.lat);
  item.dataset.locationIndex = index;

  let leadingIcon = document.createElement("span");
  leadingIcon.classList.add("panel-icon");

  let leadingIconImg = document.createElement("i");
  leadingIconImg.classList.add("fa-sharp", "fa-solid", "fa-location-dot");

  leadingIcon.append(leadingIconImg);

  let itemName = document.createElement("span");
  itemName.classList.add("location-title");
  itemName.textContent = itemData.name;

  let deleteIcon = document.createElement("span");
  deleteIcon.classList.add("panel-icon", "delete");

  item.append(leadingIcon, itemName, deleteIcon);
  return item;
}

export { init, renderLocationListItems, highlightLocationEntry };
