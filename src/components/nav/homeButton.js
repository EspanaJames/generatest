import { supabaseClient } from "../../api/supabaseClient.js";

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
  exPanel.contentEditable = "true";
  exPanel.style.whiteSpace = "pre-wrap";
  exPanel.style.minHeight = "200px";

  const exportButton = document.createElement("button");
  exportButton.classList.add("home-export-button");
  exportButton.textContent = "Export Docx";

  expoPanel.appendChild(checkPanel);
  expoPanel.appendChild(exPanel);
  expoPanel.appendChild(exportButton);
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

  const testBoxContainer = document.createElement("div");
  testBoxContainer.classList.add("test-textBoxContainer-div");

  exams.forEach((exam) => {
    const boxButton = document.createElement("button");
    boxButton.classList.add("home-box-button");
    boxButton.textContent = exam.exam_id;

    boxButton.addEventListener("click", async () => {
      examTitle.textContent = `${exam.exam_id}`;

      // Fetch questions
      const { data: questionsData, error } = await supabaseClient
        .from("exam_questions")
        .select("question_number, question")
        .eq("exam_id", exam.exam_id)
        .order("question_number", { ascending: true });

      if (error) {
        console.error("Error fetching questions:", error);
        exPanel.textContent = "Failed to load questions.";
      } else {
        exPanel.innerHTML = "";

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        ["No.", "Question"].forEach((text) => {
          const th = document.createElement("th");
          th.textContent = text;
          th.style.border = "1px solid #000";
          th.style.padding = "4px";
          th.style.textAlign = "left";
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        questionsData.forEach((q) => {
          const row = document.createElement("tr");

          const numberCell = document.createElement("td");
          numberCell.textContent = q.question_number;
          numberCell.style.border = "1px solid #000";
          numberCell.style.padding = "4px";

          const questionCell = document.createElement("td");
          questionCell.textContent = q.question;
          questionCell.style.border = "1px solid #000";
          questionCell.style.padding = "4px";

          row.appendChild(numberCell);
          row.appendChild(questionCell);
          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        exPanel.appendChild(table);
      }
    });

    testBoxContainer.appendChild(boxButton);
  });

  examPanel.appendChild(testBoxContainer);

  exportButton.addEventListener("click", () => {
    if (!window.docx) {
      alert("DOCX library is not loaded yet!");
      return;
    }

    const { Document, Packer, Paragraph, TextRun } = window.docx;

    const docChildren = [];

    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: examTitle.textContent || "Exam",
            bold: true,
            size: 32,
          }),
        ],
        spacing: { after: 200 },
      })
    );

    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Instructions: Answer all questions. Write your answers clearly.",
            italics: true,
          }),
        ],
        spacing: { after: 300 },
      })
    );
    exPanel.querySelectorAll("tbody tr").forEach((tr) => {
      const cells = tr.querySelectorAll("td");
      if (cells.length >= 2) {
        const questionNumber = cells[0].textContent;
        const questionText = cells[1].textContent;

        docChildren.push(
          new Paragraph({
            children: [new TextRun(`${questionNumber}. ${questionText}`)],
            spacing: { after: 200 },
          })
        );

        docChildren.push(
          new Paragraph({
            children: [
              new TextRun("___________________________________________"),
            ],
            spacing: { after: 200 },
          })
        );
      }
    });

    const doc = new Document({ sections: [{ children: docChildren }] });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${examTitle.textContent || "Exam"}.docx`);
    });
  });
}
