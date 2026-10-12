import { supabase } from "@/lib/supabase";
import { getProfileById } from "./profiles";

export async function getPosts({ from, to }) {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data;
}

export async function getPostsByUser(userId, { from = 0, to = 9 } = {}) {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data;
}

export const getPostByUser = getPostsByUser;

export async function createPost(content) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  if (!sessionData.session) throw new Error("Debés iniciar sesión para publicar.");

  const { data, error } = await supabase
    .from("posts")
    .insert({ content, user_id: sessionData.session.user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePost(id, content) {
  const { data, error } = await supabase
    .from("posts")
    .update({ content })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePost(id) {
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function subscribeToPosts(callback) {
  return supabase
    .channel("posts")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "posts" },
      async (payload) => {
        if (payload.new?.user_id) {
          const profile = await getProfileById(payload.new.user_id);
          callback({
            ...payload,
            new: { ...payload.new, profiles: profile },
          });
          return;
        }

        callback(payload);
      },
    )
    .subscribe();
}

export const suscribeToPosts = subscribeToPosts;
