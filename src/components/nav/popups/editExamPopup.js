import { supabaseClient } from "../../../api/supabaseClient.js";

export async function initEditExamPopup(button, exam) {
  if (!button) return;

  button.addEventListener("click", async () => {
    if (document.querySelector(".exams-popup-overlay")) return;

    const overlay = document.createElement("div");
    overlay.classList.add("exams-popup-overlay");

    const popup = document.createElement("div");
    popup.classList.add("exams-popup");

    const title = document.createElement("h2");
    title.classList.add("exams-popup-title");
    title.textContent = `${exam.subject_code} - ${exam.subject_name}`;

    const content = document.createElement("div");
    content.classList.add("exams-popup-content");
    let isDragging = false;
    let startY;
    let scrollTop;

    content.addEventListener("mousedown", (e) => {
      isDragging = true;
      startY = e.pageY - content.offsetTop;
      scrollTop = content.scrollTop;
      content.style.cursor = "grabbing";
    });

    content.addEventListener("mouseleave", () => {
      isDragging = false;
      content.style.cursor = "grab";
    });

    content.addEventListener("mouseup", () => {
      isDragging = false;
      content.style.cursor = "grab";
    });

    content.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const y = e.pageY - content.offsetTop;
      const walk = (y - startY) * 1.5;
      content.scrollTop = scrollTop - walk;
    });
    const addQuestionButton = document.createElement("button");
    addQuestionButton.classList.add("exams-popup-add-question-button");
    addQuestionButton.textContent = "+";

    const generateBtn = document.createElement("button");
    generateBtn.classList.add("exams-popup-generate");
    generateBtn.textContent = "Generate Question";
    generateBtn.addEventListener("click", () => {
      alert("Generate question clicked!");
    });

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("exams-popup-close");
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    let isEditingNew = false;

    const createQuestionRow = (questionData = null, isNew = false) => {
      const examContainer = document.createElement("div");
      examContainer.classList.add("exams-question-row");

      const questionCount = document.createElement("span");
      questionCount.classList.add("exams-question-number");
      questionCount.textContent = questionData
        ? questionData.question_number
        : content.querySelectorAll(".exams-question-row").length + 1;

      const questionText = document.createElement("div");
      questionText.classList.add("exams-question-text");
      questionText.contentEditable = isNew;
      questionText.textContent = questionData
        ? questionData.question
        : "Enter QUESTION";

      const answerText = document.createElement("div");
      answerText.classList.add("exams-answer-text");
      answerText.contentEditable = isNew;
      answerText.textContent = questionData
        ? questionData.answer
        : "Enter ANSWER";

      const modifyButton = document.createElement("button");
      modifyButton.classList.add("exams-question-modify");
      modifyButton.textContent = isNew ? "ACCEPT" : "EDIT";

      let editing = isNew;

      modifyButton.addEventListener("click", async () => {
        const qValue = questionText.textContent.trim();
        const aValue = answerText.textContent.trim();

        if (editing) {
          if (!qValue || !aValue) {
            alert("Please fill in both question and answer!");
            return;
          }

          if (isNew) {
            const { data: inserted, error } = await supabaseClient
              .from("exam_questions")
              .insert({
                exam_id: exam.exam_id,
                question_number: parseInt(questionCount.textContent),
                question: qValue,
                answer: aValue,
                created_by: exam.created_by,
              })
              .select("*")
              .single();

            if (error) {
              console.error(error);
              alert("Failed to save question.");
              return;
            }

            questionText.contentEditable = false;
            answerText.contentEditable = false;
            modifyButton.textContent = "EDIT";
            editing = false;
            isEditingNew = false;
          } else {
            await supabaseClient
              .from("exam_questions")
              .update({
                question: qValue,
                answer: aValue,
              })
              .eq("id", questionData.id);

            questionText.contentEditable = false;
            answerText.contentEditable = false;
            modifyButton.textContent = "EDIT";
            editing = false;
          }
        } else {
          questionText.contentEditable = true;
          answerText.contentEditable = true;
          modifyButton.textContent = "SAVE";
          editing = true;
        }
      });

      examContainer.appendChild(questionCount);
      examContainer.appendChild(questionText);
      examContainer.appendChild(answerText);
      examContainer.appendChild(modifyButton);

      return examContainer;
    };

    const { data: questions, error } = await supabaseClient
      .from("exam_questions")
      .select("*")
      .eq("exam_id", exam.exam_id)
      .order("question_number", { ascending: true });

    if (error) {
      console.error(error);
      alert("Failed to load questions.");
    } else {
      questions.forEach((q) => {
        const row = createQuestionRow(q, false);
        content.appendChild(row);
      });
    }

    content.appendChild(generateBtn);

    addQuestionButton.addEventListener("click", () => {
      if (isEditingNew) return;
      const newRow = createQuestionRow(null, true);
      content.appendChild(newRow);
      content.appendChild(generateBtn);
      isEditingNew = true;
    });

    popup.appendChild(title);
    popup.appendChild(content);
    popup.appendChild(addQuestionButton);
    popup.appendChild(closeBtn);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  });
}
