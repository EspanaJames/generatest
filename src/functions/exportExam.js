export async function exportExamToDocx(exPanel, examTitle) {
  if (!window.docx) {
    alert("DOCX library is not loaded yet!");
    return;
  }

  const { Document, Packer, Paragraph, TextRun, AlignmentType } = window.docx;

  const letters = ["A", "B", "C", "D"];

  function generateDistractors(correctAnswer) {
    return ["Distractor 1", "Distractor 2", "Distractor 3"];
  }

  const questionChildren = [];
  const answerChildren = [];

  questionChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: examTitle.textContent || "Exam",
          bold: true,
          size: 32,
          font: "Arial",
        }),
      ],
      spacing: { after: 300 },
    })
  );

  questionChildren.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "Name: __________________________   Date: ____________",
          size: 24,
          font: "Arial",
        }),
      ],
      spacing: { after: 300 },
    })
  );

  answerChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${examTitle.textContent} - Answer Sheet`,
          bold: true,
          size: 32,
          font: "Arial",
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

      questionChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${questionNumber}. ${questionText}`,
              font: "Arial",
              size: 22,
            }),
          ],
          spacing: { after: 100 },
        })
      );

      questionChildren.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFY,
          children: [
            new TextRun({
              text: `${options[0]}     ${options[1]}    ${options[2]}     ${options[3]}`,
              font: "Arial",
              size: 22,
            }),
          ],
          spacing: { after: 50 },
        })
      );

      answerChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${questionNumber}. `,
              bold: true,
              font: "Arial",
              size: 24,
            }),
            new TextRun({
              text: letters
                .map((l, i) => (i === correctIndex ? "⬤" : "◯"))
                .join("  "),
              font: "Arial",
              size: 22,
            }),
          ],
          spacing: { after: 150 },
        })
      );
    }
  });

  const questionDoc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 24 },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
    sections: [{ children: questionChildren }],
  });

  const answerDoc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 24 } } },
    },
    sections: [{ children: answerChildren }],
  });

  Packer.toBlob(questionDoc).then((blob) => {
    saveAs(blob, `${examTitle.textContent || "Exam"}.docx`);
  });
  Packer.toBlob(answerDoc).then((blob) => {
    saveAs(blob, `${examTitle.textContent || "Exam"} - Answers.docx`);
  });
}
