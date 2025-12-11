import { supabaseClient } from "../api/supabaseClient.js";

const form = document.querySelector(".inputForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("user").value.trim();
  const password = document.getElementById("pass").value.trim();

  if (!username || !password) {
    alert("Please enter username and password.");
    return;
  }

  try {
    const { data: userProfile, error: profileError } = await supabaseClient
      .from("adminusers")
      .select("email,id")
      .eq("username", username)
      .maybeSingle();

    if (profileError || !userProfile) {
      alert("Invalid username or password.");
      return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: userProfile.email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
      return;
    }

    if (data.user) {
      const { data: profileData } = await supabaseClient
        .from("adminusers")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      await fetch("./src/api/dashboardSession.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: profileData?.username || username,
        }),
      });

      window.location.href = "./src/pages/dashboard.php";
    }
  } catch (err) {
    console.error(err);
    alert("An unexpected error occurred. Check console.");
  }
});
