import { supabaseClient } from "../../api/supabaseClient.js";
import { exportExamToDocx } from "../../functions/exportExam.js";
import { renderExam } from "../../functions/gettingQuestions.js";
import { initExportPopup } from "./popups/exportPopup.js";

export async function renderHomePanel() {
  const parent = document.getElementById("parentId");
  parent.innerHTML = "";

  // Main panels
  const panel = document.createElement("div");
  panel.classList.add("home-main-panel");

  const examPanel = document.createElement("div");
  examPanel.classList.add("home-exam-panel");

  const examTitle = document.createElement("div");
  examTitle.classList.add("home-title-panel");

  const expoPanel = document.createElement("div");
  expoPanel.classList.add("home-expo-panel");

  const checkPanel = document.createElement("div");
  checkPanel.classList.add("home-check-panel");

  const exPanel = document.createElement("div");
  exPanel.classList.add("home-ex-panel");
  exPanel.style.display = "none";
  // exPanel.contentEditable = "true";
  // exPanel.style.whiteSpace = "pre-wrap";
  // exPanel.style.minHeight = "200px";

  const exPopBtn = document.createElement("button");
  exPopBtn.classList.add("home-export-button");
  exPopBtn.textContent = "Export Docx";

  expoPanel.appendChild(checkPanel);
  expoPanel.appendChild(exPanel);
  expoPanel.appendChild(exPopBtn);
  panel.appendChild(examTitle);
  panel.appendChild(expoPanel);
  panel.appendChild(examPanel);
  parent.appendChild(panel);

  const { data: userData } = await supabaseClient.auth.getUser();
  const user = userData?.user;

  let exams = [];
  if (user) {
    const { data, error } = await supabaseClient
      .from("exams")
      .select("*")
      .eq("created_by", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching exams:", error);
    } else {
      exams = data;
    }
  }
  let title;
  const testBoxContainer = document.createElement("div");
  testBoxContainer.classList.add("test-textBoxContainer-div");
  exams.forEach((exam) => {
    const boxButton = document.createElement("button");
    boxButton.classList.add("home-box-button");
    boxButton.textContent = exam.exam_id;
    title = exam.exam_nam;
    boxButton.addEventListener("click", async () => {
      examTitle.textContent = exam.exam_name;
      await renderExam(exam, examTitle, exPanel);
    });

    testBoxContainer.appendChild(boxButton);

    exPopBtn.addEventListener("click", () => {
      initExportPopup(exPopBtn, exam);
      // exportExamToDocx(exPanel, examTitle);
    });
  });

  examPanel.appendChild(testBoxContainer);
}
