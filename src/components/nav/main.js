"use strict";

import initButtonAction from "./buttonAction.js";
import { renderSettingsPanel } from "./settingsButton.js";
import { renderHomePanel } from "./homeButton.js";
import { renderGeneratePanel } from "./generatestButton.js";
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
          if (!page) return;
          e.preventDefault();
          if (page.toLowerCase() === "setting") renderSettingsPanel();
          else if (page.toLowerCase() === "home") renderHomePanel();
          else if (page.toLowerCase() === "generatest") renderGeneratePanel();
          else if (page.toLowerCase() === "grades") renderGradesPanel();
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
