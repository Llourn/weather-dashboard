import { emptyElement } from "../utilities/general";
import { locationList } from "../main";

export function init() {
  console.log("Locations init");
  console.log(locationContainerEl);

  locationContainerEl.addEventListener("click", (event) => {
    const index = event.target.parentElement.dataset.locationIndex;

    if (index >= 0) {
      locationList.splice(index, 1);
      updateLocalStorage();
      renderLocationListItems();
    } else if (event.target.dataset.lon && event.target.dataset.lat) {
      getWeather(event.target);
    }
  });
}

export function renderLocationListItems() {
  emptyElement(locationContainerEl, "a");
  if (locationList.length > 0) {
    locationList.forEach((location, index) => {
      locationContainerEl.append(locationItem(location, index));
    });
  } else {
    let defaultView = document.createElement("a");
    defaultView.classList.add("panel-block", "is-active");
    defaultView.textContent = "Locations you searched for will show up here!";
    locationContainerEl.append(defaultView);
  }
}

function highlightLocationEntry(index, state) {
  let entries = locationContainerEl.querySelectorAll("[data-location-index]");
  if (entries) {
    entries.forEach((entry) => {
      entry.classList.remove(`shine-${state}`);
      setTimeout(() => {
        if (entry.dataset.locationIndex == index) {
          entry.classList.add(`shine-${state}`);
        }
      }, 1);
    });
  }
}
