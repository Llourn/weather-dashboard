// export class LocationList {
//   static locations = [];

//   get locations() {
//     return this.locations;
//   }

//   set locations(newLocations) {
//     locations = newLocations;
//     this.updateStorage();
//   }

//   updateStorage() {
//     localStorage.set("locationList", JSON.stringify(locations));
//   }

//   getStorage() {
//     locations = JSON.parse(localStorage.getItem("locationList"));
//   }
// }

let locations = [];

export const locationsData = {
  all: () => locations,
  init: function () {
    console.log("初める - Init Location Data");
    locations = JSON.parse(localStorage.getItem("locationList"));
    if (!locations) locations = [];
  },
  updateStorage: function () {
    localStorage.setItem("locationList", JSON.stringify(locations));
    console.log(localStorage.getItem("locationList"));
  },
  add: function (location) {
    locations.push(location);
    console.log("Locations Check", locations);
    this.updateStorage();
  },
  replace: function (newLocations) {
    locations = newLocations;
    console.log("Locations Check", locations);
    this.updateStorage();
  },
};
