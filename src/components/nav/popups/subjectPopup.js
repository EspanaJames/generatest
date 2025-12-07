export function initSubjectPopup(button) {
  if (!button) return;

  button.addEventListener("click", () => {
    if (document.querySelector(".subject-popup-overlay")) return;

    const overlay = document.createElement("div");
    overlay.classList.add("subject-popup-overlay");

    const popup = document.createElement("div");
    popup.classList.add("subject-popup");

    const title = document.createElement("h2");
    title.classList.add("subject-popup-title");
    title.textContent = "SUBJECT EDITOR";

    const content = document.createElement("div");
    content.classList.add("subject-popup-content");
    content.innerHTML = `
      <p>Here you can edit subjects.</p>
      <ul>
        <li>Mathematics</li>
        <li>Physics</li>
        <li>Chemistry</li>
      </ul>
    `;

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
