const form = document.querySelector(".inputForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("user").value.trim();
  const password = document.getElementById("pass").value.trim();

  const { data, error } = await supabaseClient
    .from("adminusers")
    .select("*")
    .eq("username", username)
    .eq("password_hash", password)
    .maybeSingle();

  if (error) {
    console.log(error);
    alert(data + error.message);
    return;
  }

  if (data) {
    await fetch("./src/api/dashboardSession.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: data.username }),
    });
    window.location.href = "./src/pages/dashboard.php";
  } else if (!data) {
    alert("Invalid username or password.");
    return;
  }
});
