<script setup>
import { onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { getCurrentUser } from "@/services/auth";
import { getProfileById } from "@/services/profiles";

const route = useRoute();
const router = useRouter();
const targetId = route.params.id;
const currentUser = ref(null);
const profile = ref(null);
const isOwnProfile = ref(false);
const isLoading = ref(true);
const errorMessage = ref("");

function getInitial() {
  return (profile.value?.display_name || "U").slice(0, 1).toUpperCase();
}

async function loadProfile() {
  try {
    profile.value = await getProfileById(targetId);

    try {
      currentUser.value = await getCurrentUser();
      isOwnProfile.value = currentUser.value?.id === targetId;
    } catch {
      currentUser.value = null;
      isOwnProfile.value = false;
    }
  } catch (error) {
    errorMessage.value = error?.message || "No pudimos cargar este perfil.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadProfile);
</script>

<template>
  <div class="relative isolate min-h-[calc(100vh-164px)] overflow-hidden bg-background">
    <div class="pointer-events-none absolute -right-40 top-16 -z-10 size-112 rounded-full bg-primary/15 blur-[110px]" aria-hidden="true"></div>
    <div class="pointer-events-none absolute -bottom-48 -left-40 -z-10 size-112 rounded-full bg-secondary/10 blur-[110px]" aria-hidden="true"></div>

    <main class="mx-auto w-[calc(100%-2.25rem)] max-w-290 py-10 sm:w-[calc(100%-4rem)] sm:py-14">
      <div class="mb-8 flex items-center justify-between gap-4">
        <div>
          <span class="flex items-center gap-2 text-[10px] font-bold tracking-[1.65px] text-[#b5b6ff]"><span class="size-1.75 rounded-full bg-secondary shadow-[0_0_12px_rgba(20,184,166,0.5)]"></span>LA COMUNIDAD</span>
          <h1 class="mt-3 font-heading text-4xl font-semibold tracking-[-2px]">Perfil público.</h1>
        </div>
        <button class="cursor-pointer border-0 bg-transparent text-xs font-semibold text-[#b5b6ff] transition hover:text-white" type="button" @click="router.push('/chat')">Volver al chat</button>
      </div>

      <div v-if="isLoading" class="py-16 text-center text-sm text-muted">Cargando perfil...</div>
      <p v-else-if="errorMessage" class="rounded-lg border border-danger/25 bg-danger/10 px-4 py-3 text-xs leading-5 text-red-200" role="alert">{{ errorMessage }}</p>
      <section v-else class="mx-auto max-w-2xl rounded-2xl border border-slate-400/15 bg-[linear-gradient(145deg,rgba(30,41,59,0.92),rgba(22,33,52,0.92))] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-10" aria-labelledby="public-profile-title">
        <div class="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <div class="grid size-24 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-primary/40 bg-primary/20 font-heading text-3xl font-semibold text-[#c5c6ff]">
            <img v-if="profile.avatar_url" class="size-full object-cover" :src="profile.avatar_url" alt="Avatar del perfil" />
            <span v-else>{{ getInitial() }}</span>
          </div>
          <div class="mt-5 min-w-0 sm:ml-6 sm:mt-2">
            <h2 id="public-profile-title" class="font-heading text-2xl font-semibold">{{ profile.display_name || "Usuario de la comunidad" }}</h2>
            <p class="mt-3 whitespace-pre-line text-sm leading-6 text-muted">{{ profile.bio || "Todavía no agregó una biografía." }}</p>
          </div>
        </div>
        <div class="mt-8 flex flex-col gap-3 border-t border-slate-400/15 pt-6 sm:flex-row sm:justify-end">
          <RouterLink v-if="currentUser && !isOwnProfile" class="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark" :to="`/chat/${targetId}`">Enviar mensaje</RouterLink>
          <RouterLink v-else-if="!currentUser" class="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-400/20 px-5 text-sm font-semibold text-slate-300 transition hover:border-primary/50 hover:text-white" to="/inicio-sesion">Iniciá sesión para enviar mensaje</RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>