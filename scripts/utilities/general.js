export function emptyElement(targetElement, selector = "*") {
  targetElement
    .querySelectorAll(selector)
    .forEach((element) => element.remove());
}

function updateLocalStorage() {
  localStorage.setItem("locationList", JSON.stringify(locationList));
}
