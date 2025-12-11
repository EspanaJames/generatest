import { supabaseClient } from "../api/supabaseClient.js";

export async function renderExam(exam, examTitle, exPanel) {
  if (!exam || !examTitle || !exPanel) return;

  examTitle.textContent = `${exam.exam_id}`;

  try {
    const { data: questionsData, error } = await supabaseClient
      .from("exam_questions")
      .select("question_number, question, answer") // <-- added answer
      .eq("exam_id", exam.exam_id)
      .order("question_number", { ascending: true });

    if (error) {
      console.error("Error fetching questions:", error);
      exPanel.textContent = "Failed to load questions.";
      return;
    }

    exPanel.innerHTML = "";

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    ["No.", "Question", "Answer"].forEach((text) => {
      // <-- added Answer column
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

      const answerCell = document.createElement("td");
      answerCell.textContent = q.answer ?? ""; // <-- added
      answerCell.style.border = "1px solid #000";
      answerCell.style.padding = "4px";

      row.appendChild(numberCell);
      row.appendChild(questionCell);
      row.appendChild(answerCell);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    exPanel.appendChild(table);
  } catch (err) {
    console.error("Unexpected error fetching questions:", err);
    exPanel.textContent = "Failed to load questions.";
  }
}
