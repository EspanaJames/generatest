import { supabaseClient } from "../../../api/supabaseClient.js";

export function initEditSubjectPopup(button, subject) {
  if (!button) return;

  button.addEventListener("click", async () => {
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

    let addingNewNote = false;

    const { data: notes, error } = await supabaseClient
      .from("subject_books")
      .select("*")
      .eq("subject_code", subject.subject_code)
      .eq("subject_name", subject.subject_name)
      .eq("created_by", subject.created_by)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading subject notes:", error);
    } else if (notes) {
      notes.forEach((book) => {
        const note = document.createElement("div");
        note.classList.add("subject-note");

        const noteText = document.createElement("span");
        noteText.classList.add("subject-note-text");
        noteText.textContent = book.title;
        noteText.contentEditable = "true";

        const fileBlob = new Blob([book.pdf], { type: "application/pdf" });
        const fileLink = document.createElement("a");
        fileLink.href = URL.createObjectURL(fileBlob);
        fileLink.textContent = book.title;
        fileLink.download = `${book.title}.pdf`;
        fileLink.target = "_blank";
        fileLink.style.cursor = "pointer";
        fileLink.classList.add("subject-note-file-link");

        const editButton = document.createElement("button");
        editButton.textContent = "EDIT";
        editButton.classList.add("subject-note-edit");
        editButton.addEventListener("click", () => {
          console.log("Edit note:", noteText.textContent.trim());
        });

        note.appendChild(noteText);
        note.appendChild(fileLink);
        note.appendChild(editButton);

        content.appendChild(note);
      });
    }
    const addBtn = document.createElement("button");
    addBtn.classList.add("subject-popup-add-notes");
    addBtn.textContent = "ADD NOTES";

    addBtn.addEventListener("click", () => {
      if (addingNewNote) return;
      addingNewNote = true;

      const note = document.createElement("div");
      note.classList.add("subject-note");

      const noteText = document.createElement("span");
      noteText.classList.add("subject-note-text");
      noteText.textContent = "Enter TITLE";
      noteText.contentEditable = "true";

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".pdf,.doc,.docx,.txt";
      fileInput.style.display = "none";

      const uploadButton = document.createElement("button");
      uploadButton.textContent = "UPLOAD FILE";
      uploadButton.classList.add("subject-note-upload");
      uploadButton.addEventListener("click", () => fileInput.click());

      const acceptButton = document.createElement("button");
      acceptButton.classList.add("subject-note-accept");
      acceptButton.textContent = "Accept";

      acceptButton.addEventListener("click", async () => {
        const noteTitle = noteText.textContent.trim();
        const file = fileInput.files[0];

        if (!noteTitle || !file) {
          alert("Please provide both a title and a file before accepting.");
          return;
        }

        const arrayBuffer = await file.arrayBuffer();

        const { error: insertError } = await supabaseClient
          .from("subject_books")
          .insert({
            subject_code: subject.subject_code,
            subject_name: subject.subject_name,
            created_by: subject.created_by,
            pdf: new Uint8Array(arrayBuffer),
            title: noteTitle,
          });

        if (insertError) {
          console.error("Error saving note:", insertError);
          alert("Failed to save note.");
        } else {
          alert("Note saved successfully!");
          addingNewNote = false;

          const fileLink = document.createElement("a");
          fileLink.href = URL.createObjectURL(file);
          fileLink.textContent = noteTitle;
          fileLink.download = noteTitle;
          fileLink.target = "_blank";
          fileLink.style.cursor = "pointer";

          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.classList.add("subject-note-edit");
          editButton.addEventListener("click", () => {
            console.log("Edit note:", noteText.textContent.trim());
          });

          note.replaceChild(fileLink, uploadButton);
          note.removeChild(acceptButton);
          note.appendChild(editButton);
        }
      });

      fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          const fileLink = document.createElement("a");
          fileLink.href = URL.createObjectURL(file);
          fileLink.textContent = file.name;
          fileLink.download = file.name;
          fileLink.target = "_blank";
          fileLink.style.cursor = "pointer";

          note.replaceChild(fileLink, uploadButton);
        }
      });

      note.appendChild(noteText);
      note.appendChild(uploadButton);
      note.appendChild(fileInput);
      note.appendChild(acceptButton);

      content.insertBefore(note, addBtn);
    });

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("subject-popup-close");
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    popup.appendChild(title);
    popup.appendChild(content);
    content.appendChild(addBtn);
    popup.appendChild(closeBtn);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  });
}
