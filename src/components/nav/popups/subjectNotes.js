export function initEditSubjectPopup(button, subject) {
  if (!button) return;

  button.addEventListener("click", () => {
    if (document.querySelector(".subject-popup-overlay")) return;

    const overlay = document.createElement("div");
    overlay.classList.add("subject-popup-overlay");

    const popup = document.createElement("div");
    popup.classList.add("subject-popup");

    const title = document.createElement("h2");
    title.classList.add("subject-popup-title");
    title.textContent = `${subject.subject_code} - ${subject.subject_name}`;

    const content = document.createElement("div");
    content.classList.add("subject-popup-content");

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("subject-popup-close");
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    popup.appendChild(title);
    popup.appendChild(content);
    popup.appendChild(closeBtn);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  });
}
