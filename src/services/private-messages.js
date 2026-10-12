import { supabase } from "@/lib/supabase";

let channelCounter = 0;

export async function getConversation(myId, otherId) {
  const { data, error } = await supabase
    .from("private_messages")
    .select()
    .or(
      `and(sender_id.eq.${myId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${myId})`,
    )
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function sendPrivateMessage(receiverId, content) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  if (!sessionData.session) {
    throw new Error("Debés iniciar sesión para enviar mensajes.");
  }

  const { data, error } = await supabase
    .from("private_messages")
    .insert({
      sender_id: sessionData.session.user.id,
      receiver_id: receiverId,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function subscribeToPrivateMessages(myId, callback) {
  channelCounter += 1;
  const channel = supabase
    .channel(`private-messages-${myId}-${channelCounter}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "private_messages",
        filter: `receiver_id=eq.${myId}`,
      },
      callback,
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

export const suscribeToPrivateMessage = subscribeToPrivateMessages;
