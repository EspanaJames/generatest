import { supabaseClient } from "./supabaseClient.js";

export async function loadSubjectsByUser() {
  try {
    const { data, error } = await supabaseClient
      .from("subjects")
      .select("*")
      .order("created_at", { ascending: true }); // RLS filters automatically

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
