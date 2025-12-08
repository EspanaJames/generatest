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

    // ---------------- LOAD NOTES ----------------
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

        // ✅ FIX: Properly decode bytea/base64
        let fileBlob = null;
        let url = null;
        let fileObj = null;

        try {
          fileObj = book.pdf;

          if (typeof fileObj === "string") {
            fileObj = JSON.parse(fileObj);
          }

          if (fileObj?.data) {
            const binary = atob(fileObj.data);
            const bytes = new Uint8Array(binary.length);

            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }

            fileBlob = new Blob([bytes], { type: fileObj.type });
            url = URL.createObjectURL(fileBlob);
          }
        } catch (e) {
          console.error("File decode error:", e);
        }

        const fileLink = document.createElement("a");
        fileLink.href = url || "#";
        fileLink.textContent = book.title;
        fileLink.download = fileObj?.name || book.title;
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

    // ---------------- ADD NOTES BUTTON ----------------
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

      // Store file data in closure
      let selectedFileData = null;
      let selectedFileName = null;

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

      // Convert array buffer to base64
      function arrayBufferToBase64(buffer) {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      }

      // Convert base64 to blob
      function base64ToBlob(base64String, mimeType) {
        const binary = atob(base64String);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return new Blob([bytes], { type: mimeType });
      }

      // ---------------- SAVE TO DATABASE ----------------
      acceptButton.addEventListener("click", async () => {
        const noteTitle = noteText.textContent.trim();

        if (!noteTitle || !selectedFileData) {
          alert("Please provide both a title and a file before accepting.");
          return;
        }

        const { error: insertError } = await supabaseClient
          .from("subject_books")
          .insert({
            subject_code: subject.subject_code,
            subject_name: subject.subject_name,
            created_by: subject.created_by,

            pdf: JSON.stringify({
              name: selectedFileName.name,
              type: selectedFileName.type,
              data: selectedFileData,
            }),

            title: noteTitle,
          });

        if (insertError) {
          console.error("Error saving note:", insertError);
          alert("Failed to save note.");
        } else {
          alert("Note saved successfully!");
          addingNewNote = false;

          // Create download link using the stored base64 data
          const fileBlob = base64ToBlob(
            selectedFileData,
            selectedFileName.type
          );
          const url = URL.createObjectURL(fileBlob);

          const fileLink = document.createElement("a");
          fileLink.href = url;
          fileLink.textContent = noteTitle;
          fileLink.download = selectedFileName.name;
          fileLink.target = "_blank";
          fileLink.style.cursor = "pointer";

          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.classList.add("subject-note-edit");

          note.replaceChild(fileLink, uploadButton);
          note.removeChild(acceptButton);
          note.appendChild(editButton);
        }
      });

      fileInput.addEventListener("change", async () => {
        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          selectedFileName = { name: file.name, type: file.type };

          // Convert file to base64 and store
          const arrayBuffer = await file.arrayBuffer();
          selectedFileData = arrayBufferToBase64(arrayBuffer);

          const url = URL.createObjectURL(file);

          const fileLink = document.createElement("a");
          fileLink.href = url;
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

    // ---------------- CLOSE BUTTON ----------------
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
