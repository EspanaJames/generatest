import { supabaseClient } from "./supabaseClient.js";

export async function loadSubjectsByUser(username) {
  try {
    const { data, error } = await supabaseClient
      .from("subjects")
      .select("*")
      .eq("created_by", username)
      .order("id", { ascending: true });

    if (error) {
      console.error("❌ Failed to load subjects:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("❌ Unexpected error loading subjects:", err);
    return [];
  }
}
