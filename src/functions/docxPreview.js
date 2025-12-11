const letters = ["A", "B", "C", "D"];

function generateDistractors(correctAnswer) {
  return ["Distractor 1", "Distractor 2", "Distractor 3"];
}

export function generateExamPreviewElement(exPanel, examTitle, height) {
  const container = document.createElement("div");
  container.style.fontFamily = "Arial, sans-serif";
  container.style.padding = "40px";
  container.style.background = "#fff";
  container.style.color = "#000";
  container.style.width = "800px";
  container.style.height = height ? `${height}px` : "1500px";
  container.style.boxSizing = "border-box";

  const titleEl = document.createElement("h1");
  titleEl.textContent = examTitle.textContent || "Exam";
  titleEl.style.textAlign = "center";
  titleEl.style.fontWeight = "bold";
  titleEl.style.fontSize = "32px";
  titleEl.style.marginBottom = "40px";
  container.appendChild(titleEl);

  const nameDate = document.createElement("p");
  nameDate.textContent =
    "Name: __________________________   Date: ____________";
  nameDate.style.fontSize = "22px";
  nameDate.style.marginBottom = "40px";
  container.appendChild(nameDate);

  exPanel.querySelectorAll("tbody tr").forEach((tr) => {
    const cells = tr.querySelectorAll("td");
    if (cells.length >= 3) {
      const questionNumber = cells[0].textContent.trim();
      const questionText = cells[1].textContent.trim();
      const correctAnswer = cells[2].textContent.trim();

      const correctIndex = Math.floor(Math.random() * 4);
      const distractors = generateDistractors(correctAnswer);
      const options = [];
      let distractorIndex = 0;

      for (let i = 0; i < 4; i++) {
        if (i === correctIndex) {
          options.push(`${letters[i]}. ${correctAnswer}`);
        } else {
          options.push(`${letters[i]}. ${distractors[distractorIndex++]}`);
        }
      }

      const questionDiv = document.createElement("div");
      questionDiv.style.marginBottom = "30px";

      const qText = document.createElement("p");
      qText.innerHTML = `<strong>${questionNumber}.</strong> ${questionText}`;
      qText.style.fontSize = "22px";
      qText.style.marginBottom = "10px";
      questionDiv.appendChild(qText);

      const optionsRow1 = document.createElement("p");
      optionsRow1.textContent = `${options[0]}     ${options[1]}    ${options[2]}     ${options[3]}`;
      optionsRow1.style.fontSize = "22px";
      optionsRow1.style.marginBottom = "5px";
      questionDiv.appendChild(optionsRow1);

      container.appendChild(questionDiv);
    }
  });

  return container;
}

export async function generateExamScreenshot(exPanel, examTitle, targetDiv) {
  const divHeight = targetDiv.clientHeight;
  const previewEl = generateExamPreviewElement(exPanel, examTitle, divHeight);
  previewEl.style.position = "absolute";
  previewEl.style.left = "-9999px";
  document.body.appendChild(previewEl);

  const canvas = await html2canvas(previewEl, { scale: 2 });
  const dataUrl = canvas.toDataURL("image/png");

  targetDiv.innerHTML = "";
  const img = document.createElement("img");
  img.src = dataUrl;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "contain";
  img.style.display = "block";
  targetDiv.appendChild(img);

  previewEl.remove();
}
