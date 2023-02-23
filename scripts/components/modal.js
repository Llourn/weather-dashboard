export function init() {
  console.log("Modal init");

  modalEl.addEventListener("click", () => {
    modalClose();
  });
}

function modalOpen(message) {
  let textContainer = document.getElementById("modal-text");
  console.log(textContainer);
  textContainer.textContent = message;
  modalEl.classList.add("is-active");
}

function modalClose() {
  modalEl.classList.remove("is-active");
}
