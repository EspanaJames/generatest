"use strict";

export default function initButtonAction() {
  try {
    const navButtons = document.querySelectorAll(".navButton");
    if (!navButtons || !navButtons.length) return;

    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        navButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  } catch (err) {
    console.error("initButtonAction error:", err);
  }
}
