let loadingEl;

function init() {
  console.log("Loading init");
  loadingEl = document.getElementById("loading");
}

function showLoading() {
  loadingEl.classList.add("is-active");
}

function hideLoading() {
  loadingEl.classList.remove("is-active");
}
