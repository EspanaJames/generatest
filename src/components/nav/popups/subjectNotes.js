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
        fileLink.textContent = fileObj.name;
        fileLink.download = fileObj?.name || book.title;
        fileLink.target = "_blank";
        fileLink.style.cursor = "pointer";
        fileLink.classList.add("subject-note-file-link");

        let editing = false;
        let newFileBase64 = null;
        let newFileInfo = null;

        const editButton = document.createElement("button");
        editButton.textContent = "EDIT";
        editButton.classList.add("subject-note-edit");

        const dotsButton = document.createElement("button");
        dotsButton.innerHTML = "...";
        dotsButton.classList.add("subject-note-dots");
        dotsButton.style.display = "none";

        const replaceFileInput = document.createElement("input");
        replaceFileInput.type = "file";
        replaceFileInput.accept = ".pdf,.doc,.docx,.txt";
        replaceFileInput.style.display = "none";

        function arrayBufferToBase64(buffer) {
          let binary = "";
          const bytes = new Uint8Array(buffer);
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          return btoa(binary);
        }

        replaceFileInput.addEventListener("change", async () => {
          if (replaceFileInput.files.length === 0) return;

          const file = replaceFileInput.files[0];

          newFileInfo = { name: file.name, type: file.type };

          const buffer = await file.arrayBuffer();
          newFileBase64 = arrayBufferToBase64(buffer);

          fileLink.textContent = file.name;
          fileLink.href = URL.createObjectURL(
            new Blob([buffer], { type: file.type })
          );
        });

        dotsButton.addEventListener("click", () => replaceFileInput.click());

        editButton.addEventListener("click", async () => {
          if (!editing) {
            editing = true;
            editButton.textContent = "SAVE";
            noteText.contentEditable = true;

            dotsButton.style.display = "inline-block"; // show dots
            return;
          }

          // SAVE MODE
          const updatedTitle = noteText.textContent.trim();
          if (!updatedTitle) {
            alert("Title cannot be empty.");
            return;
          }

          const updateData = { title: updatedTitle };

          // If new file selected, add to update
          if (newFileBase64 && newFileInfo) {
            updateData.pdf = JSON.stringify({
              name: newFileInfo.name,
              type: newFileInfo.type,
              data: newFileBase64,
            });
          }

          const { error: updateError } = await supabaseClient
            .from("subject_books")
            .update(updateData)
            .eq("id", book.id);

          if (updateError) {
            console.error(updateError);
            alert("Failed to save.");
            return;
          }

          // Exit edit mode
          editing = false;
          editButton.textContent = "EDIT";
          noteText.contentEditable = false;

          dotsButton.style.display = "none"; // hide dots again

          newFileBase64 = null;
          newFileInfo = null;
        });
        const fileContainer = document.createElement("span");
        fileContainer.classList.add("subject-file-container");

        fileContainer.appendChild(fileLink);
        fileContainer.appendChild(dotsButton);
        fileContainer.appendChild(replaceFileInput);

        note.appendChild(noteText);
        note.appendChild(fileContainer);
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
