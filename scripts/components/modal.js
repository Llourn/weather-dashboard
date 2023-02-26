let modalEl;

// Initialize modal component.
export function init() {
  console.log("初める - Modal init");
  modalEl = document.getElementById("modal");

  // click event closes the modal. Regardless where the user clicks.
  modalEl.addEventListener("click", () => {
    modalClose();
  });
}

// Load message then display the modal.
export function modalOpen(message) {
  let textContainer = document.getElementById("modal-text");
  textContainer.textContent = message;
  modalEl.classList.add("is-active");
}

export function modalClose() {
  modalEl.classList.remove("is-active");
}
