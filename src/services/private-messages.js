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

export async function getRecentPrivateConversations(userId, limit = 8) {
  const { data: messages, error } = await supabase
    .from("private_messages")
    .select("id, sender_id, receiver_id, content, created_at")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) throw error;

  const latestByPartner = new Map();
  for (const message of messages) {
    const partnerId =
      message.sender_id === userId ? message.receiver_id : message.sender_id;

    if (!latestByPartner.has(partnerId)) {
      latestByPartner.set(partnerId, { ...message, partnerId });
    }

    if (latestByPartner.size >= limit) break;
  }

  const partnerIds = [...latestByPartner.keys()];
  if (!partnerIds.length) return [];

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", partnerIds);

  if (profilesError) throw profilesError;

  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
  return [...latestByPartner.values()].map((conversation) => ({
    ...conversation,
    profile: profilesById.get(conversation.partnerId),
  }));
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
