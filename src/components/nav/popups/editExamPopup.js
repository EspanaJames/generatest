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

    const generateBtn = document.createElement("button");
    generateBtn.classList.add("exams-popup-generate");
    generateBtn.textContent = "Add Question";

    const editor = document.createElement("div");
    editor.classList.add("exams-question-editor");

    editor.innerHTML = `
  <label class="editor-label">Question</label>
  <textarea class="editor-question"></textarea>
  <label class="editor-label">Answer</label>
  <textarea class="editor-answer"></textarea>
  <span class="buttonArea">
    <button class="editor-save" style="display:none;">Save</button>
    <button class="editor-remove">Remove</button>
  </span>
`;

    const buttonArea = editor.querySelector(".buttonArea");
    const editorQuestion = editor.querySelector(".editor-question");
    const editorAnswer = editor.querySelector(".editor-answer");
    const editorSave = editor.querySelector(".editor-save");
    const editorRemove = editor.querySelector(".editor-remove");

    let selectedQuestion = null;
    let selectedRow = null;

    const loadEditor = (rowElement, questionData) => {
      selectedQuestion = questionData;
      selectedRow = rowElement;
      editorQuestion.value = questionData.question;
      editorAnswer.value = questionData.answer;
      editorSave.style.display = "none";
    };

    const showSaveWhenEdited = () => {
      if (!selectedQuestion) return;
      if (
        editorQuestion.value.trim() !== selectedQuestion.question ||
        editorAnswer.value.trim() !== selectedQuestion.answer
      ) {
        editorSave.style.display = "block";
      } else {
        editorSave.style.display = "none";
      }
    };

    editorQuestion.addEventListener("input", showSaveWhenEdited);
    editorAnswer.addEventListener("input", showSaveWhenEdited);

    editorSave.addEventListener("click", async () => {
      if (!selectedQuestion) return;

      const newQ = editorQuestion.value.trim();
      const newA = editorAnswer.value.trim();

      if (!newQ || !newA) {
        alert("Please fill out both fields.");
        return;
      }

      if (!selectedQuestion.id) {
        const { data, error } = await supabaseClient
          .from("exam_questions")
          .insert({
            exam_id: exam.exam_id,
            question_number: selectedQuestion.question_number,
            question: newQ,
            answer: newA,
            created_by: exam.created_by,
          })
          .select("*")
          .single();

        if (error) {
          alert("Failed to save new question.");
          return;
        }

        selectedQuestion = data;
        selectedRow.querySelector(".exams-question-text").textContent = newQ;
        selectedRow.querySelector(".exams-answer-text").textContent = newA;
        selectedRow.dataset.id = data.id;
      } else {
        const { error } = await supabaseClient
          .from("exam_questions")
          .update({
            question: newQ,
            answer: newA,
          })
          .eq("id", selectedQuestion.id);

        if (error) {
          alert("Failed to update question.");
          return;
        }

        selectedRow.querySelector(".exams-question-text").textContent = newQ;
        selectedRow.querySelector(".exams-answer-text").textContent = newA;
        selectedQuestion.question = newQ;
        selectedQuestion.answer = newA;
      }

      editorSave.style.display = "none";
    });

    editorRemove.addEventListener("click", async () => {
      if (!selectedQuestion) return;
      if (!selectedQuestion.id) return;

      const confirmDelete = confirm("Delete this question?");
      if (!confirmDelete) return;

      await supabaseClient
        .from("exam_questions")
        .delete()
        .eq("id", selectedQuestion.id);

      const { data: remaining, error } = await supabaseClient
        .from("exam_questions")
        .select("*")
        .eq("exam_id", exam.exam_id)
        .order("question_number", { ascending: true });

      if (error) {
        alert("Failed to reorder questions.");
        return;
      }

      const reordered = remaining.map((q, index) => ({
        id: q.id,
        new_num: index + 1,
      }));

      for (let r of reordered) {
        await supabaseClient
          .from("exam_questions")
          .update({ question_number: r.new_num })
          .eq("id", r.id);
      }

      content
        .querySelectorAll(".exams-question-row")
        .forEach((e) => e.remove());

      reordered.forEach((r) => {
        const qData = remaining.find((q) => q.id === r.id);
        qData.question_number = r.new_num;
        const newRow = createQuestionRow(qData);
        content.insertBefore(newRow, generateBtn);
      });

      editorQuestion.value = "";
      editorAnswer.value = "";
      editorSave.style.display = "none";
      selectedQuestion = null;
      selectedRow = null;
    });

    const createQuestionRow = (questionData) => {
      const examContainer = document.createElement("div");
      examContainer.classList.add("exams-question-row");

      const questionCount = document.createElement("span");
      questionCount.classList.add("exams-question-number");
      questionCount.textContent = questionData.question_number;

      const questionText = document.createElement("div");
      questionText.classList.add("exams-question-text");
      questionText.textContent = questionData.question;

      const answerText = document.createElement("div");
      answerText.classList.add("exams-answer-text");
      answerText.textContent = questionData.answer;

      examContainer.addEventListener("click", () => {
        loadEditor(examContainer, questionData);
      });

      examContainer.appendChild(questionCount);
      examContainer.appendChild(questionText);
      examContainer.appendChild(answerText);
      return examContainer;
    };

    const { data: questions, error } = await supabaseClient
      .from("exam_questions")
      .select("*")
      .eq("exam_id", exam.exam_id)
      .order("question_number", { ascending: true });

    if (questions) {
      questions.forEach((q) => {
        const row = createQuestionRow(q);
        content.appendChild(row);
      });
    }

    content.appendChild(generateBtn);

    generateBtn.addEventListener("click", () => {
      const newQ = {
        id: null,
        question_number:
          content.querySelectorAll(".exams-question-row").length + 1,
        question: "Enter QUESTION",
        answer: "Enter ANSWER",
        exam_id: exam.exam_id,
        created_by: exam.created_by,
      };

      const newRow = createQuestionRow(newQ);
      content.insertBefore(newRow, generateBtn);
      loadEditor(newRow, newQ);
    });

    const notesPanel = document.createElement("div");
    notesPanel.classList.add("exams-notes-panel");

    const notesListDiv = document.createElement("div");
    notesListDiv.classList.add("notes-list-div");

    const notesMiddleSpacer = document.createElement("div");
    notesMiddleSpacer.classList.add("notes-middle-spacer");

    const notesDetailDiv = document.createElement("div");
    notesDetailDiv.classList.add("notes-detail-div");
    notesDetailDiv.textContent = "Select a note to view details.";

    const notesTitle = document.createElement("h3");
    notesTitle.textContent = "NOTES";
    notesListDiv.appendChild(notesTitle);

    const { data: notes } = await supabaseClient
      .from("subject_books")
      .select("*")
      .eq("subject_code", exam.subject_code)
      .eq("subject_name", exam.subject_name)
      .eq("created_by", exam.created_by)
      .order("created_at", { ascending: true });

    let selectedNoteRow = null;

    const highlightNoteRow = (rowElement) => {
      if (selectedNoteRow) {
        selectedNoteRow.classList.remove("selected-note");
      }
      selectedNoteRow = rowElement;
      selectedNoteRow.classList.add("selected-note");
    };

    function loadNoteDetails(note, chapters) {
      notesDetailDiv.innerHTML = "";

      const title = document.createElement("span");
      title.textContent = note.title;

      const chapterSelect = document.createElement("select");
      chapterSelect.classList.add("note-chapter-select");

      chapters.forEach((ch) => {
        const opt = document.createElement("option");
        opt.value = ch;
        opt.textContent = ch;
        chapterSelect.appendChild(opt);
      });

      const questionCountInput = document.createElement("input");
      questionCountInput.type = "number";
      questionCountInput.min = 1;
      questionCountInput.value = 5;

      const generateBtn = document.createElement("button");
      generateBtn.textContent = "Generate Questions";

      generateBtn.addEventListener("click", async () => {
        const chapter = chapterSelect.value;
        const count = parseInt(questionCountInput.value);

        const ai = await generateQuestionsAI(note, chapter, count);

        ai.questions.forEach((q, idx) => {
          const newQ = {
            id: null,
            question_number:
              content.querySelectorAll(".exams-question-row").length + 1,
            question: q.question,
            answer: q.answer,
            exam_id: exam.exam_id,
            created_by: exam.created_by,
          };

          const newRow = createQuestionRow(newQ);
          content.insertBefore(newRow, generateBtn);
        });
      });

      notesDetailDiv.appendChild(title);
      notesDetailDiv.appendChild(chapterSelect);
      notesDetailDiv.appendChild(questionCountInput);
      notesDetailDiv.appendChild(generateBtn);
    }

    if (notes && notes.length > 0) {
      notes.forEach((note) => {
        const noteRow = document.createElement("div");
        noteRow.classList.add("exams-note-row");
        noteRow.textContent = note.title;

        noteRow.addEventListener("click", async () => {
          highlightNoteRow(noteRow);

          // Show loading
          notesMiddleSpacer.textContent = "Analyzing chapters...";

          const chapters = await fetchChaptersFromAI(note);

          // Render chapters in note-middle-spacer
          notesMiddleSpacer.innerHTML = "";
          chapters.forEach((ch) => {
            const c = document.createElement("div");
            c.textContent = ch;
            c.classList.add("chapter-item");
            notesMiddleSpacer.appendChild(c);
          });

          // Load detail panel with AI chapters
          loadNoteDetails(note, chapters);
        });

        notesListDiv.appendChild(noteRow);
      });
    }

    notesPanel.appendChild(notesListDiv);
    notesPanel.appendChild(notesMiddleSpacer);
    notesPanel.appendChild(notesDetailDiv);

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("exams-popup-close");
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", () => {
      overlay.remove();
    });

    popup.appendChild(title);
    popup.appendChild(content);
    popup.appendChild(editor);
    popup.appendChild(closeBtn);
    popup.appendChild(notesPanel);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  });
}

async function fetchChaptersFromAI(note) {
  try {
    const response = await fetch("http://127.0.0.1:5000/extract_chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: note.title,
        pdf: note.pdf,
      }),
    });

    const result = await response.json();
    return result.chapters || [];
  } catch (e) {
    console.error("AI chapter extraction failed:", e);
    return [];
  }
}

async function generateQuestionsAI(note, chapter, count) {
  try {
    const response = await fetch("http://127.0.0.1:5000/generate_questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: note.title,
        chapter,
        count,
      }),
    });

    return await response.json();
  } catch (e) {
    console.error("AI generate questions failed:", e);
    return { questions: [] };
  }
}
