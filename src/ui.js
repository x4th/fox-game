export function modFox(state) {
  document.querySelector(".fox").classList = `fox fox-${state}`;
}

export function modScene(state) {
  document.querySelector(".game").classList = `game ${state}`;
}

export function togglePoopBag(show) {
  document.querySelector(".poop-bag").classList.toggle("hidden", !show);
}

export function writeModal(text = "") {
  document.querySelector(
    ".modal"
  ).innerHTML = `<div class="modal-inner">${text}</div>`;
}
