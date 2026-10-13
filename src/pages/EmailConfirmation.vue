<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { getSession, onAuthChange } from "@/services/auth";

const route = useRoute();
const isLoading = ref(true);
const isConfirmed = ref(false);
const hasSession = ref(false);
const errorMessage = ref("");
let authSubscription;

onMounted(async () => {
  const queryError = route.query.error_description || route.query.error;

  if (queryError) {
    errorMessage.value = String(queryError).replace(/\+/g, " ");
    isLoading.value = false;
    return;
  }

  const { data } = onAuthChange((_event, session) => {
    hasSession.value = Boolean(session);
  });
  authSubscription = data.subscription;

  try {
    const session = await getSession();
    hasSession.value = Boolean(session);
    isConfirmed.value = true;
  } catch (error) {
    errorMessage.value = error?.message || "No pudimos confirmar tu cuenta.";
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  authSubscription?.unsubscribe();
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

    <main class="mx-auto flex w-[calc(100%-2.25rem)] max-w-290 justify-center px-0 py-12 sm:w-[calc(100%-4rem)] sm:py-20">
      <section class="w-full max-w-117.5 rounded-2xl border border-slate-400/15 bg-[linear-gradient(145deg,rgba(30,41,59,0.92),rgba(22,33,52,0.92))] p-7 text-center shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-10" aria-labelledby="confirmation-title">
        <div v-if="isLoading" class="py-8 text-sm text-muted">
          Verificando tu confirmación...
        </div>

        <template v-else-if="isConfirmed">
          <div class="mx-auto grid size-16 place-items-center rounded-full border border-secondary/30 bg-secondary/15 text-secondary">
            <svg class="size-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m5 12 4.5 4.5L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <span class="mt-6 block text-[10px] font-bold tracking-[1.65px] text-secondary">CUENTA CONFIRMADA</span>
          <h1 id="confirmation-title" class="mt-3 font-heading text-3xl font-semibold tracking-[-1.5px]">
            Ya sos parte de Nexo.
          </h1>
          <p class="mx-auto mt-3 max-w-82.5 text-sm leading-6 text-muted">
            Tu correo fue confirmado correctamente. La comunidad ya está lista para recibirte.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <RouterLink v-if="hasSession" class="inline-flex min-h-11 items-center justify-center gap-3 rounded-lg bg-primary px-5 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:bg-primary-dark" to="/chat">
              Ir al chat <span aria-hidden="true">↗</span>
            </RouterLink>
            <RouterLink v-else class="inline-flex min-h-11 items-center justify-center gap-3 rounded-lg bg-primary px-5 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:bg-primary-dark" to="/inicio-sesion">
              Iniciar sesión <span aria-hidden="true">↗</span>
            </RouterLink>
            <RouterLink class="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-400/25 px-5 text-sm font-semibold text-slate-200 no-underline transition hover:border-primary/50 hover:text-white" to="/perfil">
              Ver mi perfil
            </RouterLink>
          </div>
        </template>

        <template v-else>
          <div class="mx-auto grid size-16 place-items-center rounded-full border border-danger/30 bg-danger/10 text-red-300">
            <span class="font-heading text-2xl" aria-hidden="true">!</span>
          </div>
          <h1 id="confirmation-title" class="mt-6 font-heading text-3xl font-semibold tracking-[-1.5px]">
            No pudimos confirmar tu cuenta.
          </h1>
          <p class="mx-auto mt-3 max-w-85 text-sm leading-6 text-muted">
            El enlace puede haber vencido o ya fue utilizado. Volvé a iniciar sesión o solicitá un nuevo correo.
          </p>
          <RouterLink class="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white no-underline transition hover:bg-primary-dark" to="/inicio-sesion">
            Volver al inicio de sesión
          </RouterLink>
          <p class="mt-4 text-xs text-red-200/70" role="alert">{{ errorMessage }}</p>
        </template>
      </section>
    </main>
  </div>
</template>
