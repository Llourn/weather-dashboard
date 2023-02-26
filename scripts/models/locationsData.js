let locations = [];

// Locations Data state used throughout the app.
const locationsData = {
  all: () => locations,
  init: function () {
    console.log("初める - Location Data init");
    locations = JSON.parse(localStorage.getItem("locationList"));
    if (!locations) locations = [];
  },
  updateStorage: function () {
    localStorage.setItem("locationList", JSON.stringify(locations));
  },
  add: function (location) {
    locations.push(location);
    this.updateStorage();
  },
  replace: function (newLocations) {
    locations = newLocations;
    this.updateStorage();
  },
};

export default locationsData;
