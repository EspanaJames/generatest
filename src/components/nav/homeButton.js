export function renderHomePanel() {
  const parent = document.getElementById("parentId");
  parent.innerHTML = "";

  const panel = document.createElement("div");
  panel.classList.add("home-main-panel");
  const exPane = document.createElement("div");
  exPane.classList.add("home-expo-panel");

  panel.appendChild(exPane);
  parent.appendChild(panel);
}
