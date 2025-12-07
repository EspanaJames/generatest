"use strict";

import initButtonAction from "./buttonAction.js";
import { renderSettingsPanel } from "./settingsButton.js";
import { renderHomePanel } from "./homeButton.js";
import { renderGeneratestPanel } from "./generatestButton.js";
import { renderGradesPanel } from "./gradesButton.js";

function runInit() {
  try {
    initButtonAction();
    renderHomePanel();
    const navButtons = document.querySelectorAll(".navButton");
    if (navButtons && navButtons.length) {
      navButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const page =
            btn.dataset && btn.dataset.page ? btn.dataset.page : null;
          if (page && page.toLowerCase() === "setting") {
            e.preventDefault();
            renderSettingsPanel();
          } else if (page && page.toLowerCase() === "home") {
            e.preventDefault();
            renderHomePanel();
          } else if (page && page.toLowerCase() === "generatest") {
            e.preventDefault();
            renderGeneratestPanel();
          } else if (page && page.toLowerCase() === "grades") {
            e.preventDefault();
            renderGradesPanel();
          }
        });
      });
    }
  } catch (err) {
    console.error("Error initializing button actions:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runInit);
} else {
  runInit();
}
