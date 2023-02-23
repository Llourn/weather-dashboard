let loadingEl;

function init(loadingEl) {
  this.loadingEl = loadingEl;
}

function showLoading() {
  loadingEl.classList.add("is-active");
}

function hideLoading() {
  loadingEl.classList.remove("is-active");
}
