function show() {
  var input = document.getElementById("pass");
  var icon = document.getElementById("togglePass");

  if (input.type === "password") {
    input.type = "text";
    icon.src = "../../assets/images/View.png";
  } else {
    input.type = "password";
    icon.src = "../../assets/images/Unview.png";
  }
}
const registerBar = document.querySelector(".registerBar");
const registerForm = document.querySelector(".registerForm");

registerBar.addEventListener("click", () => {
  registerForm.classList.toggle("active");
});

function toggleRegisterPassword() {
  const input = document.getElementById("registerPass");
  const icon = document.getElementById("toggleRegisterPass");
  if (input.type === "password") {
    input.type = "text";
    icon.src = "./assets/images/View.png";
  } else {
    input.type = "password";
    icon.src = "./assets/images/Unview.png";
  }
}

function toggleConfirmPassword() {
  const input = document.getElementById("confirmPass");
  const icon = document.getElementById("toggleConfirmPass");
  if (input.type === "password") {
    input.type = "text";
    icon.src = "./assets/images/View.png";
  } else {
    input.type = "password";
    icon.src = "./assets/images/Unview.png";
  }
}
