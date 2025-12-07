export function renderGradesPanel() {
  const parent = document.getElementById("parentId");

  parent.innerHTML = "";

  const panel = document.createElement("div");
  panel.classList.add("grades-main-panel");

  parent.appendChild(panel);
}
