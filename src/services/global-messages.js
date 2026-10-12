import { supabase } from "@/lib/supabase";
import { getProfileById, getProfiles } from "./profiles";

export async function getGlobalMessages(limit) {
  const { data, error } = await supabase
    .from("global_messages")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data.reverse();
}

export async function sendGlobalMessage(content) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  if (!sessionData.session) throw new Error("Debés iniciar sesión para enviar mensajes.");

  const { data, error } = await supabase
    .from("global_messages")
    .insert({ content, user_id: sessionData.session.user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function subscribeToGlobalMessages(callback) {
  const profiles = Object.fromEntries(
    (await getProfiles()).map((profile) => [profile.id, profile]),
  );

  return supabase
    .channel("global_messages")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "global_messages",
      },
      async (payload) => {
        const userId = payload.new.user_id;
        if (userId && !profiles[userId]) {
          profiles[userId] = await getProfileById(userId);
        }

        callback({
          ...payload,
          new: {
            ...payload.new,
            profiles: profiles[userId] ?? null,
          },
        });
      },
    )
    .subscribe();
}

export const suscribeToGlobalMessage = subscribeToGlobalMessages;
