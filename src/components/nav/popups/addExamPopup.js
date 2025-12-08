import { supabaseClient } from "../../../api/supabaseClient.js";

export function initAddExamPopup(button) {
  if (!button) return;

  button.addEventListener("click", () => {
    if (document.querySelector(".exam-popup-overlay")) return;
    openAddExamPopup();
  });
}

export async function openAddExamPopup() {
  if (document.querySelector(".exam-popup-overlay")) return;

  const overlay = document.createElement("div");
  overlay.classList.add("exam-popup-overlay");

  const popup = document.createElement("div");
  popup.classList.add("exam-add-popup");

  const title = document.createElement("h2");
  title.classList.add("exam-popup-title");
  title.textContent = "Add New Exam";

  const content = document.createElement("div");
  content.classList.add("exam-add-popup-content");

  const subjectCodeInput = document.createElement("input");
  subjectCodeInput.type = "text";
  subjectCodeInput.placeholder = "Subject Code";
  subjectCodeInput.classList.add("exam-add-popup-input");

  const subjectNameInput = document.createElement("input");
  subjectNameInput.type = "text";
  subjectNameInput.placeholder = "Subject Name";
  subjectNameInput.classList.add("exam-add-popup-input");

  const examNameInput = document.createElement("input");
  examNameInput.type = "text";
  examNameInput.placeholder = "Exam Name";
  examNameInput.classList.add("exam-add-popup-input");

  content.appendChild(subjectCodeInput);
  content.appendChild(subjectNameInput);
  content.appendChild(examNameInput);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("exam-add-popup-buttons");

  const saveBtn = document.createElement("button");
  saveBtn.classList.add("exam-add-popup-save");
  saveBtn.textContent = "Save";

  const cancelBtn = document.createElement("button");
  cancelBtn.classList.add("exam-popup-close");
  cancelBtn.textContent = "Cancel";

  buttonsContainer.appendChild(saveBtn);
  buttonsContainer.appendChild(cancelBtn);

  popup.appendChild(title);
  popup.appendChild(content);
  popup.appendChild(buttonsContainer);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  cancelBtn.addEventListener("click", () => overlay.remove());

  saveBtn.addEventListener("click", async () => {
    const subject_code = subjectCodeInput.value.trim();
    const subject_name = subjectNameInput.value.trim();
    const exam_name = examNameInput.value.trim();

    if (!subject_code || !subject_name || !exam_name) {
      alert("Please fill all fields.");
      return;
    }

    const { data: userData } = await supabaseClient.auth.getUser();
    const user = userData?.user;

    if (!user) {
      alert("You are not logged in.");
      return;
    }

    // Verify subject exists and belongs to the user
    const { data: subjectData, error: subjectError } = await supabaseClient
      .from("subjects")
      .select("*")
      .eq("subject_code", subject_code)
      .eq("subject_name", subject_name)
      .eq("created_by", user.id)
      .single();

    if (subjectError || !subjectData) {
      alert("Subject not found or you are not the owner of this subject.");
      return;
    }

    const exam_id = `${subject_code}-${Date.now()}`;

    const { error: examError } = await supabaseClient.from("exams").insert({
      exam_id,
      subject_code,
      subject_name,
      exam_name,
      created_by: user.id,
      num_items: 0,
    });

    if (examError) {
      console.error(examError);
      alert("Error saving exam: " + examError.message);
      return;
    }

    overlay.remove();
    alert("Exam successfully added!");
  });
}
