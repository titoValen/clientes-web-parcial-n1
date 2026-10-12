import { supabase } from "@/lib/supabase";

export async function getProfileById(id) {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getProfiles() {
  const { data, error } = await supabase.from("profiles").select();

  if (error) throw error;
  return data;
}

export async function updateProfile(id, { display_name, bio, avatar_url }) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ display_name, bio, avatar_url })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
