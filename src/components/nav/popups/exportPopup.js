import { exportExamToDocx } from "../../../functions/exportExam.js";
import { generateExamScreenshot } from "../../../functions/docxPreview.js";

export async function initExportPopup(button, exam, exPanel, examTitle) {
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

    const preview = document.createElement("div");
    preview.classList.add("export-preview-panel");
    preview.innerHTML = `<div style="padding:10px;color:#bbb;">Generating preview...</div>`;

    try {
      await generateExamScreenshot(exPanel, examTitle, preview);
    } catch (err) {
      console.error(err);
      preview.innerHTML =
        "<div style='color:red;padding:10px;'>Failed to generate preview.</div>";
    }

    const content = document.createElement("div");
    content.classList.add("export-popup-content");

    const exportButton = document.createElement("button");
    exportButton.classList.add("export-button");
    exportButton.textContent = "Export DOCX";

    exportButton.addEventListener("click", () => {
      exportExamToDocx(exPanel, examTitle);
    });

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("export-popup-close");
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", () => {
      overlay.remove();
    });

    content.appendChild(exportButton);
    popup.appendChild(title);
    popup.appendChild(preview);
    popup.appendChild(content);
    popup.appendChild(closeBtn);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  });
}
