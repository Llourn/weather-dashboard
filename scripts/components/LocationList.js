export class LocationList {
  static locations = [];

  get locations() {
    return this.locations;
  }

  set locations(newLocations) {
    locations = newLocations;
    this.updateStorage();
  }

  updateStorage() {
    localStorage.set("locationList", JSON.stringify(locations));
  }

  getStorage() {
    locations = JSON.parse(localStorage.getItem("locationList"));
  }
}
