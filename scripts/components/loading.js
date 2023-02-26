let loadingEl;

// Initialize the loading component.
export function init() {
  console.log("初める - Loading init");
  loadingEl = document.getElementById("loading");
}

export function showLoading() {
  loadingEl.classList.add("is-active");
}

export function hideLoading() {
  loadingEl.classList.remove("is-active");
}
