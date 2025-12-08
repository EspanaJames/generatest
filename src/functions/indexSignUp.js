// indexSignUp.js
import { supabaseClient } from "../api/supabaseClient.js";

const signupForm = document.querySelector(".signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const username = signupForm.username.value.trim();
  const email = signupForm.email.value.trim();
  const password = signupForm.password.value.trim();
  const confirmPassword = signupForm.confirmPassword.value.trim();
  const firstName = signupForm.firstName.value.trim();
  const lastName = signupForm.lastName.value.trim();
  const gender = signupForm.gender.value;

  // Validate password match
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (!email || !password || !username) {
    alert("Username, email, and password are required.");
    return;
  }

  try {
    const { data: authData, error: authError } =
      await supabaseClient.auth.signUp({
        email,
        password,
      });

    if (authError) {
      alert("Signup error: " + authError.message);
      return;
    }

    const { error: profileError } = await supabaseClient
      .from("adminusers")
      .insert([
        {
          id: authData.user.id,
          username,
          email,
          first_name: firstName,
          last_name: lastName,
          gender,
        },
      ]);

    if (profileError) {
      alert("Profile creation error: " + profileError.message);
      return;
    }

    alert("Registration successful!");
    signupForm.reset();
  } catch (err) {
    console.error(err);
    alert("An unexpected error occurred. Check console.");
  }
});
