export function renderSettingsPanel() {
  const parent = document.getElementById("parentId");

  parent.innerHTML = "";

  const panel = document.createElement("div");
  panel.classList.add("settings-main-panel");

  parent.appendChild(panel);
}
