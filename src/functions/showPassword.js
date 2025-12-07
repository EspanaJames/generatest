function show() {
  var input = document.getElementById("pass");
  var icon = document.getElementById("togglePass");

  if (input.type === "password") {
    input.type = "text";
    icon.src = "../../assets/images/view.png";
  } else {
    input.type = "password";
    icon.src = "../../assets/images/Unview.png";
  }
}
