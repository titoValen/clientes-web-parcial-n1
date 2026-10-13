<script setup>
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { getCurrentUser } from "@/services/auth";
import {
  getGlobalMessages,
  sendGlobalMessage,
  subscribeToGlobalMessages,
} from "@/services/global-messages";

const router = useRouter();
const currentUser = ref(null);
const messages = ref([]);
const messageContent = ref("");
const isLoading = ref(true);
const isSending = ref(false);
const isConnected = ref(false);
const errorMessage = ref("");
const messagesContainer = ref(null);
let messagesChannel;

function scrollToLatest() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

function getDisplayName(message) {
  return (
    message.profiles?.display_name ||
    (message.user_id === currentUser.value?.id
      ? currentUser.value.email
      : "Alguien de la comunidad")
  );
}

function getInitial(message) {
  return getDisplayName(message).slice(0, 1).toUpperCase();
}

function formatTime(date) {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function isOwnMessage(message) {
  return message.user_id === currentUser.value?.id;
}

async function loadChat() {
  try {
    currentUser.value = await getCurrentUser();

    if (!currentUser.value) {
      await router.replace("/inicio-sesion");
      return;
    }

    messages.value = await getGlobalMessages(100);
    scrollToLatest();

    messagesChannel = await subscribeToGlobalMessages((payload) => {
      messages.value.push(payload.new);
      scrollToLatest();
    });
    isConnected.value = true;
  } catch (error) {
    errorMessage.value = error?.message || "No pudimos cargar el chat global.";
  } finally {
    isLoading.value = false;
  }
}

async function handleSubmit() {
  const content = messageContent.value.trim();
  if (!content || isSending.value) return;

  errorMessage.value = "";
  isSending.value = true;

  try {
    await sendGlobalMessage(content);
    messageContent.value = "";
  } catch (error) {
    errorMessage.value = error?.message || "No pudimos enviar el mensaje.";
  } finally {
    isSending.value = false;
  }
}

onMounted(loadChat);

onUnmounted(() => {
  messagesChannel?.unsubscribe();
});
</script>

<template>
  <div class="relative isolate min-h-[calc(100vh-164px)] overflow-hidden bg-background">
    <div
      class="pointer-events-none absolute -right-40 top-16 -z-10 size-112 rounded-full bg-primary/15 blur-[110px]"
      aria-hidden="true"
    ></div>
    <div
      class="pointer-events-none absolute -bottom-48 -left-40 -z-10 size-112 rounded-full bg-secondary/10 blur-[110px]"
      aria-hidden="true"
    ></div>

    <main class="mx-auto w-[calc(100%-2.25rem)] max-w-290 py-8 sm:w-[calc(100%-4rem)] sm:py-12">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span class="flex items-center gap-2 text-[10px] font-bold tracking-[1.65px] text-[#b5b6ff]">
            <span class="size-1.75 rounded-full bg-secondary shadow-[0_0_12px_rgba(20,184,166,0.5)]"></span>
            LA COMUNIDAD
          </span>
          <h1 class="mt-3 font-heading text-4xl font-semibold tracking-[-2px]">Chat global.</h1>
          <p class="mt-2 text-sm text-muted">Una charla abierta para compartir ideas y encontrarse.</p>
        </div>
        <span class="flex items-center gap-2 text-xs text-muted">
          <span :class="isConnected ? 'bg-secondary shadow-[0_0_12px_rgba(20,184,166,0.5)]' : 'bg-slate-500'" class="size-2 rounded-full"></span>
          {{ isConnected ? "En vivo" : "Conectando..." }}
        </span>
      </div>

      <p v-if="errorMessage" class="mb-5 rounded-lg border border-danger/25 bg-danger/10 px-4 py-3 text-xs leading-5 text-red-200" role="alert">
        {{ errorMessage }}
      </p>

      <section class="overflow-hidden rounded-2xl border border-slate-400/15 bg-[linear-gradient(145deg,rgba(30,41,59,0.92),rgba(22,33,52,0.92))] shadow-[0_28px_90px_rgba(0,0,0,0.28)]" aria-labelledby="global-chat-title">
        <div class="flex items-center justify-between border-b border-slate-400/15 px-5 py-4 sm:px-7">
          <div class="flex items-center gap-3">
            <span class="grid size-10 place-items-center rounded-xl border border-primary/25 bg-primary/15 text-[#a5a6ff]" aria-hidden="true">
              <svg class="size-5" viewBox="0 0 24 24" fill="none">
                <path d="M4 5.75A2.75 2.75 0 0 1 6.75 3h10.5A2.75 2.75 0 0 1 20 5.75v7.5A2.75 2.75 0 0 1 17.25 16H11l-5 4v-4h-.25A2.75 2.75 0 0 1 3 13.25v-7.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                <path d="M8 8h8M8 11.5h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
            </span>
            <div>
              <h2 id="global-chat-title" class="font-heading text-sm font-semibold">La charla de hoy</h2>
              <p class="mt-1 text-[10px] text-muted">Conversá con todas las personas de Nexo.</p>
            </div>
          </div>
          <span class="hidden text-[10px] text-slate-500 sm:inline">{{ messages.length }} mensajes</span>
        </div>

        <div ref="messagesContainer" class="h-[min(58vh,520px)] min-h-90 overflow-y-auto px-4 py-6 sm:px-7">
          <div v-if="isLoading" class="grid h-full place-items-center text-sm text-muted">
            Cargando conversaciones...
          </div>
          <div v-else-if="!messages.length" class="grid h-full place-items-center text-center">
            <div>
              <p class="font-heading text-lg font-medium">Todavía no hay mensajes.</p>
              <p class="mt-2 text-xs text-muted">Sé la primera persona en abrir la conversación.</p>
            </div>
          </div>
          <div v-else class="space-y-5">
            <article v-for="message in messages" :key="message.id" class="flex items-start gap-3" :class="isOwnMessage(message) ? 'flex-row-reverse' : ''">
              <RouterLink
                v-if="message.user_id"
                :to="`/usuario/${message.user_id}`"
                class="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-400/20 bg-primary/20 text-xs font-semibold text-[#c5c6ff]"
                :aria-label="`Ver perfil de ${getDisplayName(message)}`"
              >
                <img v-if="message.profiles?.avatar_url" class="size-full object-cover" :src="message.profiles.avatar_url" alt="" />
                <span v-else>{{ getInitial(message) }}</span>
              </RouterLink>
              <div v-else class="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-400/20 bg-primary/20 text-xs font-semibold text-[#c5c6ff]">
                <img v-if="message.profiles?.avatar_url" class="size-full object-cover" :src="message.profiles.avatar_url" alt="" />
                <span v-else>{{ getInitial(message) }}</span>
              </div>
              <div class="min-w-0 max-w-[82%]" :class="isOwnMessage(message) ? 'items-end text-right' : ''">
                <div class="mb-1 flex items-center gap-2" :class="isOwnMessage(message) ? 'justify-end' : ''">
                  <RouterLink
                    v-if="message.user_id"
                    :to="`/usuario/${message.user_id}`"
                    class="truncate text-xs font-semibold text-slate-200"
                    :aria-label="`Ver perfil de ${getDisplayName(message)}`"
                  >
                    <strong>{{ getDisplayName(message) }}</strong>
                  </RouterLink>
                  <strong v-else class="truncate text-xs font-semibold text-slate-200">{{ getDisplayName(message) }}</strong>
                  <time class="shrink-0 text-[10px] text-slate-500" :datetime="message.created_at">{{ formatTime(message.created_at) }}</time>
                </div>
                <p class="w-fit whitespace-pre-wrap rounded-[3px_12px_12px] border border-slate-400/10 bg-[#273449] px-3 py-2 text-xs leading-5 text-slate-300" :class="isOwnMessage(message) ? 'ml-auto rounded-[12px_3px_12px_12px] border-primary/20 bg-primary/20' : ''">
                  {{ message.content }}
                </p>
              </div>
            </article>
          </div>
        </div>

        <form class="border-t border-slate-400/15 p-4 sm:p-5" @submit.prevent="handleSubmit">
          <div class="flex items-end gap-3 rounded-xl border border-slate-400/15 bg-slate-950/20 p-2">
            <label class="sr-only" for="global-message">Escribí un mensaje</label>
            <textarea id="global-message" v-model="messageContent" class="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 text-text outline-none placeholder:text-slate-500" placeholder="Escribí algo lindo..." rows="1" maxlength="500" :disabled="isSending" @keydown.enter.exact.prevent="handleSubmit"></textarea>
            <button class="grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg border-0 bg-primary text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60" type="submit" aria-label="Enviar mensaje" :disabled="isSending || !messageContent.trim()">
              <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="m3 9 13-6-4.8 14-2.1-5.1L3 9Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                <path d="m9.1 11.9 4.1-4.1" stroke="currentColor" stroke-width="1.5" />
              </svg>
            </button>
          </div>
          <p class="mt-2 text-right text-[10px] text-slate-500">Enter para enviar · {{ messageContent.length }}/500</p>
        </form>
      </section>
    </main>
  </div>
</template>
