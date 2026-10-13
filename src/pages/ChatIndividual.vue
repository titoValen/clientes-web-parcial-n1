<script setup>
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCurrentUser } from "@/services/auth";
import { getProfileById } from "@/services/profiles";
import {
	getConversation,
	sendPrivateMessage,
	subscribeToPrivateMessages,
} from "@/services/private-messages";

const route = useRoute();
const router = useRouter();
const otherUserId = route.params.id;
const currentUser = ref(null);
const otherProfile = ref(null);
const messages = ref([]);
const messageContent = ref("");
const isLoading = ref(true);
const isSending = ref(false);
const isConnected = ref(false);
const errorMessage = ref("");
const messagesContainer = ref(null);
let cleanupSubscription;

function scrollToLatest() {
	nextTick(() => {
		if (messagesContainer.value) {
			messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
		}
	});
}

function addMessage(message) {
	if (message?.id && messages.value.some((item) => item.id === message.id)) return;
	messages.value.push(message);
	scrollToLatest();
}

function getDisplayName() {
	return otherProfile.value?.display_name || "Usuario de la comunidad";
}

function getInitial() {
	return getDisplayName().slice(0, 1).toUpperCase();
}

function formatTime(date) {
	return new Intl.DateTimeFormat("es-AR", {
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

function isOwnMessage(message) {
	return message.sender_id === currentUser.value?.id;
}

async function loadChat() {
	try {
		try {
			currentUser.value = await getCurrentUser();
		} catch {
			await router.replace("/inicio-sesion");
			return;
		}

		if (!currentUser.value) {
			await router.replace("/inicio-sesion");
			return;
		}

		if (currentUser.value.id === otherUserId) {
			await router.replace("/chat");
			return;
		}

		const [profile, conversation] = await Promise.all([
			getProfileById(otherUserId),
			getConversation(currentUser.value.id, otherUserId),
		]);
		otherProfile.value = profile;
		messages.value = conversation;
		scrollToLatest();

		cleanupSubscription = subscribeToPrivateMessages(currentUser.value.id, (payload) => {
			const message = payload.new;
			if (message.sender_id === otherUserId && message.receiver_id === currentUser.value.id) {
				addMessage(message);
			}
		});
		isConnected.value = true;
	} catch (error) {
		errorMessage.value = error?.message || "No pudimos cargar la conversación.";
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
		const message = await sendPrivateMessage(otherUserId, content);
		addMessage(message);
		messageContent.value = "";
	} catch (error) {
		errorMessage.value = error?.message || "No pudimos enviar el mensaje.";
	} finally {
		isSending.value = false;
	}
}

onMounted(loadChat);

onUnmounted(() => {
	cleanupSubscription?.();
});
</script>

<template>
	<div class="relative isolate min-h-[calc(100vh-164px)] overflow-hidden bg-background">
		<div class="pointer-events-none absolute -right-40 top-16 -z-10 size-112 rounded-full bg-primary/15 blur-[110px]" aria-hidden="true"></div>
		<div class="pointer-events-none absolute -bottom-48 -left-40 -z-10 size-112 rounded-full bg-secondary/10 blur-[110px]" aria-hidden="true"></div>

		<main class="mx-auto w-[calc(100%-2.25rem)] max-w-290 py-8 sm:w-[calc(100%-4rem)] sm:py-12">
			<div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<span class="flex items-center gap-2 text-[10px] font-bold tracking-[1.65px] text-[#b5b6ff]"><span class="size-1.75 rounded-full bg-secondary shadow-[0_0_12px_rgba(20,184,166,0.5)]"></span>MENSAJES PRIVADOS</span>
					<h1 class="mt-3 font-heading text-4xl font-semibold tracking-[-2px]">Conversación.</h1>
					<p class="mt-2 text-sm text-muted">Un espacio para hablar con {{ getDisplayName() }}.</p>
				</div>
				<RouterLink class="text-xs font-semibold text-[#b5b6ff] transition hover:text-white" to="/chat">Volver al chat global</RouterLink>
			</div>

			<p v-if="errorMessage" class="mb-5 rounded-lg border border-danger/25 bg-danger/10 px-4 py-3 text-xs leading-5 text-red-200" role="alert">{{ errorMessage }}</p>

			<section class="overflow-hidden rounded-2xl border border-slate-400/15 bg-[linear-gradient(145deg,rgba(30,41,59,0.92),rgba(22,33,52,0.92))] shadow-[0_28px_90px_rgba(0,0,0,0.28)]" aria-labelledby="private-chat-title">
				<header class="flex items-center justify-between border-b border-slate-400/15 px-5 py-4 sm:px-7">
					<RouterLink class="flex min-w-0 items-center gap-3" :to="`/usuario/${otherUserId}`">
						<span class="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-primary/30 bg-primary/20 text-sm font-semibold text-[#c5c6ff]"><img v-if="otherProfile?.avatar_url" class="size-full object-cover" :src="otherProfile.avatar_url" alt="" /><span v-else>{{ getInitial() }}</span></span>
						<span class="min-w-0"><strong id="private-chat-title" class="block truncate font-heading text-sm font-semibold text-slate-200">{{ getDisplayName() }}</strong><span class="mt-1 block text-[10px] text-muted">Ver perfil público</span></span>
					</RouterLink>
					<span class="flex shrink-0 items-center gap-2 text-xs text-muted"><span :class="isConnected ? 'bg-secondary shadow-[0_0_12px_rgba(20,184,166,0.5)]' : 'bg-slate-500'" class="size-2 rounded-full"></span>{{ isConnected ? "En vivo" : "Conectando..." }}</span>
				</header>

				<div ref="messagesContainer" class="h-[min(58vh,520px)] min-h-90 overflow-y-auto px-4 py-6 sm:px-7">
					<div v-if="isLoading" class="grid h-full place-items-center text-sm text-muted">Cargando conversación...</div>
					<div v-else-if="!messages.length" class="grid h-full place-items-center text-center"><div><p class="font-heading text-lg font-medium">Todavía no hay mensajes.</p><p class="mt-2 text-xs text-muted">Abrí la conversación con un saludo.</p></div></div>
					<div v-else class="space-y-5">
						<article v-for="message in messages" :key="message.id" class="flex items-start gap-3" :class="isOwnMessage(message) ? 'flex-row-reverse' : ''">
							<div class="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-400/20 bg-primary/20 text-xs font-semibold text-[#c5c6ff]"><img v-if="(isOwnMessage(message) ? currentUser?.user_metadata?.avatar_url : otherProfile?.avatar_url)" class="size-full object-cover" :src="isOwnMessage(message) ? currentUser?.user_metadata?.avatar_url : otherProfile?.avatar_url" alt="" /><span v-else>{{ isOwnMessage(message) ? (currentUser?.email || "U").slice(0, 1).toUpperCase() : getInitial() }}</span></div>
							<div class="min-w-0 max-w-[82%]" :class="isOwnMessage(message) ? 'items-end text-right' : ''"><div class="mb-1 flex items-center gap-2" :class="isOwnMessage(message) ? 'justify-end' : ''"><strong class="truncate text-xs font-semibold text-slate-200">{{ isOwnMessage(message) ? "Vos" : getDisplayName() }}</strong><time class="shrink-0 text-[10px] text-slate-500" :datetime="message.created_at">{{ formatTime(message.created_at) }}</time></div><p class="w-fit whitespace-pre-wrap rounded-[3px_12px_12px] border border-slate-400/10 bg-[#273449] px-3 py-2 text-xs leading-5 text-slate-300" :class="isOwnMessage(message) ? 'ml-auto rounded-[12px_3px_12px_12px] border-primary/20 bg-primary/20' : ''">{{ message.content }}</p></div>
						</article>
					</div>
				</div>

				<form class="border-t border-slate-400/15 p-4 sm:p-5" @submit.prevent="handleSubmit"><div class="flex items-end gap-3 rounded-xl border border-slate-400/15 bg-slate-950/20 p-2"><label class="sr-only" for="private-message">Escribí un mensaje</label><textarea id="private-message" v-model="messageContent" class="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 text-text outline-none placeholder:text-slate-500" placeholder="Escribí un mensaje..." rows="1" maxlength="500" :disabled="isSending" @keydown.enter.exact.prevent="handleSubmit"></textarea><button class="grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg border-0 bg-primary text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60" type="submit" aria-label="Enviar mensaje" :disabled="isSending || !messageContent.trim()"><svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m3 9 13-6-4.8 14-2.1-5.1L3 9Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" /><path d="m9.1 11.9 4.1-4.1" stroke="currentColor" stroke-width="1.5" /></svg></button></div><p class="mt-2 text-right text-[10px] text-slate-500">Enter para enviar · Shift+Enter para saltar de línea · {{ messageContent.length }}/500</p></form>
			</section>
		</main>
	</div>
</template>
