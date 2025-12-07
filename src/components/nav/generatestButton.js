export function renderGeneratestPanel() {
  const parent = document.getElementById("parentId");

  parent.innerHTML = "";

  const panel = document.createElement("div");
  panel.classList.add("charts-main-panel");

  parent.appendChild(panel);
}
