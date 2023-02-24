import { emptyElement } from "../utilities/general";
// import { locationList } from "../main";

let locationContainerEl;

export function init() {
  console.log("Locations init");
  // console.log(locationContainerEl);
  locationContainerEl = document.getElementById("location-container");

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

function locationItem(itemData, index) {
  let item = document.createElement("a");
  item.classList.add("panel-block", "is-active");
  item.setAttribute("data-lon", itemData.lon);
  item.setAttribute("data-lat", itemData.lat);
  item.dataset.locationIndex = index;
  let leadingIcon = document.createElement("span");
  leadingIcon.classList.add("panel-icon");
  let leadingIconImg = document.createElement("i");
  leadingIconImg.classList.add("fa-sharp", "fa-solid", "fa-location-dot");
  let itemName = document.createElement("span");
  itemName.textContent = itemData.name;
  let deleteIcon = document.createElement("span");
  deleteIcon.classList.add("panel-icon", "delete");
  // let deleteIconImg = document.createElement("i");
  // deleteIconImg.classList.add("fa-sharp", "fa-solid", "fa-xmark");

  leadingIcon.append(leadingIconImg);
  // deleteIcon.append(deleteIconImg);
  item.append(leadingIcon, itemName, deleteIcon);
  return item;
}
