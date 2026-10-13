<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { register } from "@/services/auth";

const router = useRouter();
const displayName = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const isSubmitting = ref(false);

async function handleSubmit() {
  errorMessage.value = "";
  successMessage.value = "";

  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = "Las contraseñas no coinciden.";
    return;
  }

  isSubmitting.value = true;

  try {
    await register({
      email: email.value,
      password: password.value,
      displayName: displayName.value,
    });

    successMessage.value =
      "Tu cuenta fue creada. Revisá tu correo para confirmar el registro.";
    displayName.value = "";
    email.value = "";
    password.value = "";
    passwordConfirmation.value = "";
  } catch (error) {
    errorMessage.value =
      error?.message || "No pudimos crear tu cuenta. Intentá nuevamente.";
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
        aria-labelledby="register-title"
      >
        <div class="mb-8">
          <span class="flex items-center gap-2 text-[10px] font-bold tracking-[1.65px] text-[#b5b6ff]">
            <span class="size-1.75 rounded-full bg-secondary shadow-[0_0_12px_rgba(20,184,166,0.5)]"></span>
            SUMATE A NEXO
          </span>
          <h1 id="register-title" class="mt-4 font-heading text-3xl font-semibold tracking-[-1.5px]">
            Creá tu cuenta.
          </h1>
          <p class="mt-2 text-sm leading-6 text-muted">
            Encontrá tu lugar para conversar con la comunidad.
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div>
            <label class="mb-2 block text-xs font-medium text-slate-300" for="display-name">
              Nombre visible
            </label>
            <input
              id="display-name"
              v-model.trim="displayName"
              class="min-h-11 w-full rounded-lg border border-slate-400/20 bg-slate-950/25 px-3 text-sm text-text outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
              type="text"
              name="displayName"
              placeholder="¿Cómo te conocen?"
              autocomplete="nickname"
              :aria-describedby="errorMessage ? 'register-error' : undefined"
              required
            />
          </div>

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
              :aria-describedby="errorMessage ? 'register-error' : undefined"
              required
            />
          </div>

          <div>
            <label class="mb-2 block text-xs font-medium text-slate-300" for="password">
              Contraseña
            </label>
            <input
              id="password"
              v-model="password"
              class="min-h-11 w-full rounded-lg border border-slate-400/20 bg-slate-950/25 px-3 text-sm text-text outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
              type="password"
              name="password"
              placeholder="Al menos 6 caracteres"
              autocomplete="new-password"
              minlength="6"
              :aria-describedby="errorMessage ? 'register-error' : undefined"
              required
            />
          </div>

          <div>
            <label class="mb-2 block text-xs font-medium text-slate-300" for="password-confirmation">
              Repetí tu contraseña
            </label>
            <input
              id="password-confirmation"
              v-model="passwordConfirmation"
              class="min-h-11 w-full rounded-lg border border-slate-400/20 bg-slate-950/25 px-3 text-sm text-text outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
              type="password"
              name="passwordConfirmation"
              placeholder="Volvé a escribirla"
              autocomplete="new-password"
              minlength="6"
              :aria-describedby="errorMessage ? 'register-error' : undefined"
              required
            />
          </div>

          <p v-if="errorMessage" id="register-error" class="rounded-lg border border-danger/25 bg-danger/10 px-3 py-2 text-xs leading-5 text-red-200" role="alert">
            {{ errorMessage }}
          </p>
          <p v-if="successMessage" class="rounded-lg border border-success/25 bg-success/10 px-3 py-2 text-xs leading-5 text-green-200" role="status">
            {{ successMessage }}
          </p>

          <button
            class="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-transparent bg-primary px-4 text-sm font-semibold text-white cursor-pointer transition duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_30px_rgba(79,70,229,0.23)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            type="submit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Creando cuenta..." : "Crear mi cuenta" }}
            <span v-if="!isSubmitting" aria-hidden="true">↗</span>
          </button>
        </form>

        <p class="mt-7 text-center text-xs text-muted">
          ¿Ya tenés una cuenta?
          <RouterLink class="font-medium text-[#a5a6ff] no-underline hover:text-text" to="/inicio-sesion">
            Iniciá sesión
          </RouterLink>
        </p>
      </section>
    </main>
  </div>
</template>
