export function renderHomePanel() {
  const parent = document.getElementById("parentId");

  const panel = document.createElement("div");
  panel.classList.add("home-main-panel");
  parent.appendChild(panel);
}
