import { supabaseClient } from "../../../api/supabaseClient.js";

export async function initExportPopup(button, exam) {
  if (!button) return;

  button.addEventListener("click", async () => {
    if (document.querySelector(".export-popup-overlay")) return;

    const overlay = document.createElement("div");
    overlay.classList.add("export-popup-overlay");

    const popup = document.createElement("div");
    popup.classList.add("export-popup");

    const title = document.createElement("h2");
    title.classList.add("export-popup-title");
    title.textContent = `${exam.subject_code} - ${exam.subject_name}`;

    const content = document.createElement("div");
    content.classList.add("export-popup-content");

    const exportButton = document.createElement("button");
    exportButton.classList.add("export-button");
    exportButton.textContent = "Export DOCX";

    exportButton.addEventListener("click", () => {
      exportExamToDocx(exPanel, examTitle);
    });

    content.appendChild(exportButton);
    popup.appendChild(title);
    popup.appendChild(content);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  });
}
