<script setup>
import { ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { login } from "@/services/auth";

const router = useRouter();
const route = useRoute();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);

async function handleSubmit() {
  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    await login({
      email: email.value,
      password: password.value,
    });
    const redirect = route.query.redirect;
    const destination =
      typeof redirect === "string" && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : "/chat";
    await router.push(destination);
  } catch (error) {
    errorMessage.value =
      error?.message || "No pudimos iniciar sesión. Revisá tus datos.";
  } finally {
    isSubmitting.value = false;
  }
}
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

    <main class="mx-auto flex w-[calc(100%-2.25rem)] max-w-290 justify-center px-0 py-12 sm:w-[calc(100%-4rem)] sm:py-16">
      <section
        class="w-full max-w-117.5 rounded-2xl border border-slate-400/15 bg-[linear-gradient(145deg,rgba(30,41,59,0.92),rgba(22,33,52,0.92))] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-9"
        aria-labelledby="login-title"
      >
        <div class="mb-8">
          <span class="flex items-center gap-2 text-[10px] font-bold tracking-[1.65px] text-[#b5b6ff]">
            <span class="size-1.75 rounded-full bg-secondary shadow-[0_0_12px_rgba(20,184,166,0.5)]"></span>
            QUÉ BUENO VERTE
          </span>
          <h1 id="login-title" class="mt-4 font-heading text-3xl font-semibold tracking-[-1.5px]">
            Volvé a la charla.
          </h1>
          <p class="mt-2 text-sm leading-6 text-muted">
            Iniciá sesión para seguir conectado con tu comunidad.
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div>
            <label class="mb-2 block text-xs font-medium text-slate-300" for="email">
              Correo electrónico
            </label>
            <input
              id="email"
              v-model.trim="email"
              class="min-h-11 w-full rounded-lg border border-slate-400/20 bg-slate-950/25 px-3 text-sm text-text outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
              type="email"
              name="email"
              placeholder="vos@ejemplo.com"
              autocomplete="email"
              :aria-describedby="errorMessage ? 'login-error' : undefined"
              required
            />
          </div>

          <div>
            <div class="mb-2 flex items-center justify-between gap-3">
              <label class="block text-xs font-medium text-slate-300" for="password">
                Contraseña
              </label>
            </div>
            <input
              id="password"
              v-model="password"
              class="min-h-11 w-full rounded-lg border border-slate-400/20 bg-slate-950/25 px-3 text-sm text-text outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
              type="password"
              name="password"
              placeholder="Tu contraseña"
              autocomplete="current-password"
              :aria-describedby="errorMessage ? 'login-error' : undefined"
            />
          </div>

          <p v-if="errorMessage" id="login-error" class="rounded-lg border border-danger/25 bg-danger/10 px-3 py-2 text-xs leading-5 text-red-200" role="alert">
            {{ errorMessage }}
          </p>

          <button
            class="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-transparent bg-primary px-4 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_30px_rgba(79,70,229,0.23)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            type="submit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Iniciando sesión..." : "Iniciar sesión" }}
            <span v-if="!isSubmitting" aria-hidden="true">↗</span>
          </button>
        </form>

        <p class="mt-7 text-center text-xs text-muted">
          ¿Todavía no tenés una cuenta?
          <RouterLink class="font-medium text-[#a5a6ff] no-underline hover:text-text" to="/registrarse">
            Creala acá
          </RouterLink>
        </p>
      </section>
    </main>
  </div>
</template>
