import { supabaseClient } from "../../api/supabaseClient.js";
import { openAddExamPopup } from "./popups/addExamPopup.js";
import { initAddSubjectPopup } from "./popups/addSubjectPopup.js";
import { initEditSubjectPopup } from "./popups/subjectNotes.js";
import { loadSubjectsByUser } from "../../api/loadSubjectsByUser.js";
import { initEditExamPopup } from "./popups/editExamPopup.js";
export async function renderGeneratePanel() {
  const parent = document.getElementById("parentId");

  parent.innerHTML = "";

  const panel = document.createElement("div");
  panel.classList.add("test-main-panel");
  const subjectPanel = document.createElement("div");
  subjectPanel.classList.add("test-subject-panel");
  const testAddPanel = document.createElement("div");
  testAddPanel.classList.add("test-addTest-panel");
  const testShowPanel = document.createElement("div");
  testShowPanel.classList.add("test-showTest-panel");
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
  exams.forEach((exam) => {
    const testRow = document.createElement("div");
    testRow.classList.add("test-show-row");

    const examName = document.createElement("span");
    examName.classList.add("test-exam-name");
    examName.textContent = `${exam.exam_name} - ${exam.exam_id}`;

    const subjectName = document.createElement("span");
    subjectName.classList.add("test-subject-name");
    subjectName.textContent = `${exam.subject_code} - ${exam.subject_name}`;

    const editButton = document.createElement("button");
    editButton.classList.add("edit-test-button");
    editButton.textContent = "Edit";

    testRow.appendChild(examName);
    testRow.appendChild(subjectName);
    testRow.appendChild(editButton);
    initEditExamPopup(editButton, exam);

    testShowPanel.appendChild(testRow);
  });
  const testBoxContainer = document.createElement("div");
  testBoxContainer.classList.add("test-textBoxContainer-div");

  const subjects = await loadSubjectsByUser(LOGGED_IN_USER);

  subjects.forEach((subj) => {
    const boxButton = document.createElement("button");
    boxButton.classList.add("test-box-button");
    boxButton.textContent = subj.subject_code;
    testBoxContainer.appendChild(boxButton);
    initEditSubjectPopup(boxButton, subj);
  });
  const addTestButton = document.createElement("button");
  addTestButton.textContent = "+";
  addTestButton.classList.add("add-test-button");
  const testTitleDiv = document.createElement("div");
  testTitleDiv.classList.add("test-titleDiv-panel");
  testTitleDiv.textContent = "TEST BANK";

  const addDiv = document.createElement("div");
  addDiv.classList.add("test-addSubject-div");

  subjectPanel.appendChild(testBoxContainer);
  subjectPanel.appendChild(addDiv);

  const addButton = document.createElement("button");
  addButton.textContent = "Add Subjects";
  addButton.classList.add("add-subject-button");
  addDiv.appendChild(addButton);
  initAddSubjectPopup(addButton);
  addTestButton.addEventListener("click", () => {
    openAddExamPopup();
  });
  testAddPanel.appendChild(testTitleDiv);
  testAddPanel.appendChild(addTestButton);

  panel.appendChild(subjectPanel);
  panel.appendChild(testAddPanel);
  panel.appendChild(testShowPanel);
  parent.appendChild(panel);
  const container = document.querySelector(".test-textBoxContainer-div");
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener("mousedown", (e) => {
    isDown = true;
    container.classList.add("grabbing");
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
    container.classList.remove("grabbing");
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
    container.classList.remove("grabbing");
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });
  const testShowContainer = document.querySelector(".test-showTest-panel");
  let isDownShow = false;
  let startYShow;
  let scrollTopShow;

  testShowContainer.addEventListener("mousedown", (e) => {
    isDownShow = true;
    testShowContainer.classList.add("grabbing");
    startYShow = e.pageY - testShowContainer.offsetTop;
    scrollTopShow = testShowContainer.scrollTop;
  });

  testShowContainer.addEventListener("mouseleave", () => {
    isDownShow = false;
    testShowContainer.classList.remove("grabbing");
  });

  testShowContainer.addEventListener("mouseup", () => {
    isDownShow = false;
    testShowContainer.classList.remove("grabbing");
  });

  testShowContainer.addEventListener("mousemove", (e) => {
    if (!isDownShow) return;
    e.preventDefault();
    const y = e.pageY - testShowContainer.offsetTop;
    const walk = (y - startYShow) * 1.5;
    testShowContainer.scrollTop = scrollTopShow - walk;
  });
}
