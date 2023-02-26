let modalEl;

export function init() {
  console.log("初める - Modal init");
  modalEl = document.getElementById("modal");

  modalEl.addEventListener("click", () => {
    modalClose();
  });
}

export function modalOpen(message) {
  let textContainer = document.getElementById("modal-text");
  textContainer.textContent = message;
  modalEl.classList.add("is-active");
}

export function modalClose() {
  modalEl.classList.remove("is-active");
}
