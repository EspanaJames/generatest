import { supabaseClient } from "../api/supabaseClient.js";

export async function loadFirstName(username, elementId) {
  if (!username) return;

  try {
    const { data, error } = await supabaseClient
      .from("adminusers")
      .select("first_name, last_name")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error("Error fetching full_name:", error);
      return;
    }

    const element = document.getElementById(elementId);
    if (element) {
      const full_name = data?.first_name
        ? data.first_name + (data?.last_name ? " " + data.last_name : "")
        : username;

      element.textContent = `Welcome, ${full_name}!`;
    }
  } catch (err) {
    console.error("Unexpected error fetching full_name:", err);
  }
}
