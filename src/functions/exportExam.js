export async function exportExamToDocx(exPanel, examTitle) {
  if (!window.docx) {
    alert("DOCX library is not loaded yet!");
    return;
  }

  const { Document, Packer, Paragraph, TextRun } = window.docx;

  const letters = ["A", "B", "C", "D"];

  // Dummy AI distractor generator
  function generateDistractors(correctAnswer) {
    return ["Distractor 1", "Distractor 2", "Distractor 3"];
  }

  const questionChildren = [];
  const answerChildren = [];

  // Add exam title
  questionChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: examTitle.textContent || "Exam",
          bold: true,
          size: 32,
        }),
      ],
      spacing: { after: 300 },
    })
  );

  answerChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: examTitle.textContent + " - Answer Sheet",
          bold: true,
          size: 32,
        }),
      ],
      spacing: { after: 300 },
    })
  );

  exPanel.querySelectorAll("tbody tr").forEach((tr) => {
    const cells = tr.querySelectorAll("td");
    if (cells.length >= 3) {
      const questionNumber = cells[0].textContent;
      const questionText = cells[1].textContent;
      const correctAnswer = cells[2].textContent;

      // Randomize answer placement
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

      // Add to question sheet
      questionChildren.push(
        new Paragraph({
          children: [new TextRun(`${questionNumber}. ${questionText}`)],
          spacing: { after: 100 },
        })
      );

      // Add options in two rows A/C and B/D
      questionChildren.push(
        new Paragraph({
          children: [new TextRun(`${options[0]}     ${options[2]}`)],
          spacing: { after: 50 },
        })
      );
      questionChildren.push(
        new Paragraph({
          children: [new TextRun(`${options[1]}     ${options[3]}`)],
          spacing: { after: 150 },
        })
      );

      // Add to answer sheet
      answerChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${questionNumber}. `,
              bold: true,
            }),
            new TextRun(
              letters.map((l, i) => (i === correctIndex ? "⬤" : "◯")).join("  ")
            ),
          ],
          spacing: { after: 150 },
        })
      );
    }
  });

  const questionDoc = new Document({
    sections: [{ children: questionChildren }],
  });
  const answerDoc = new Document({ sections: [{ children: answerChildren }] });

  // Export both
  Packer.toBlob(questionDoc).then((blob) => {
    saveAs(blob, `${examTitle.textContent || "Exam"}.docx`);
  });
  Packer.toBlob(answerDoc).then((blob) => {
    saveAs(blob, `${examTitle.textContent || "Exam"} - Answers.docx`);
  });
}
