import { supabaseClient } from "../../../api/supabaseClient.js";
export function initAddSubjectPopup(button) {
  if (!button) return;

  button.addEventListener("click", () => {
    if (document.querySelector(".subject-popup-overlay")) return;
    openAddSubjectPopup();
  });
}

export function openAddSubjectPopup() {
  if (document.querySelector(".subject-popup-overlay")) return;
  const overlay = document.createElement("div");
  overlay.classList.add("subject-popup-overlay");
  const popup = document.createElement("div");
  popup.classList.add("subject-add-popup");
  const title = document.createElement("h2");
  title.classList.add("subject-popup-title");
  title.textContent = "Add New Subject";

  const content = document.createElement("div");
  content.classList.add("subject-add-popup-content");
  const subjectNameInput = document.createElement("input");
  subjectNameInput.type = "text";
  subjectNameInput.placeholder = "Subject Name";
  subjectNameInput.classList.add("subject-add-popup-input");
  const subjectCodeInput = document.createElement("input");
  subjectCodeInput.type = "text";
  subjectCodeInput.placeholder = "Subject Code";
  subjectCodeInput.classList.add("subject-add-popup-input");
  content.appendChild(subjectCodeInput);
  content.appendChild(subjectNameInput);
  const saveBtn = document.createElement("button");
  saveBtn.classList.add("subject-add-popup-save");
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", async () => {
    const name = subjectNameInput.value.trim();
    const code = subjectCodeInput.value.trim();

    if (!name || !code) {
      alert("Please fill all fields.");
      return;
    }

    const { data: userData } = await supabaseClient.auth.getUser();
    const user = userData?.user;

    if (!user) {
      alert("You are not logged in.");
      return;
    }
    const { error } = await supabaseClient.from("subjects").insert({
      subject_name: name,
      subject_code: code,
      created_by: user.id,
    });

    if (error) {
      console.error(error);
      alert("Error saving subject: " + error.message);
      return;
    }

    document.body.removeChild(overlay);

    if (typeof renderGeneratePanel === "function") {
      renderGeneratePanel();
    }

    alert("Subject successfully added!");
  });

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("subject-popup-close");
  closeBtn.textContent = "Cancel";
  closeBtn.addEventListener("click", () => document.body.removeChild(overlay));

  popup.appendChild(title);
  popup.appendChild(content);
  popup.appendChild(saveBtn);
  popup.appendChild(closeBtn);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}
