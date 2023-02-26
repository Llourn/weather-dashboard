// Utility function used to empty any element passed into it.
export function emptyElement(targetElement, selector = "*") {
  targetElement
    .querySelectorAll(selector)
    .forEach((element) => element.remove());
}
