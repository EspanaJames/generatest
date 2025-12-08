export function initEditExamPopup(button, exam) {
  if (!button) return;

  button.addEventListener("click", () => {
    if (document.querySelector(".exams-popup-overlay")) return;

    const overlay = document.createElement("div");
    overlay.classList.add("exams-popup-overlay");

    const popup = document.createElement("div");
    popup.classList.add("exams-popup");

    const title = document.createElement("h2");
    title.classList.add("exams-popup-title");
    title.textContent = `${exam.subject_code} - ${exam.subject_name}`;

    const addQuestionButton = document.createElement("button");
    addQuestionButton.classList.add("exams-popup-add-question-button");
    addQuestionButton.textContent = "+";

    const content = document.createElement("div");
    content.classList.add("exams-popup-content");

    const addBtn = document.createElement("button");
    addBtn.classList.add("exams-popup-add-notes");
    addBtn.textContent = "Generate Question";

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("exams-popup-close");
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });
    addBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });
    popup.appendChild(title);
    popup.appendChild(content);
    content.appendChild(addBtn);
    popup.appendChild(addQuestionButton);
    popup.appendChild(closeBtn);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  });
}
