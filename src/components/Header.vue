<script setup>
import { onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";

const { user, isAuthReady, initAuth } = useAuth();

onMounted(() => {
  initAuth();
});
</script>

<template>
  <header
    class="relative z-10 mx-auto flex h-[72px] w-[calc(100%-2.25rem)] max-w-[1160px] items-center justify-between border-b border-white/10 sm:h-[88px] sm:w-[calc(100%-4rem)]"
  >
    <RouterLink
      class="inline-flex items-center gap-[9px] font-heading text-2xl font-bold tracking-[-1.4px] text-text no-underline"
      to="/"
      aria-label="Nexo, ir al inicio"
    >
      <span
        class="grid size-8 place-items-center text-primary"
        aria-hidden="true"
      >
        <svg class="size-[29px]" viewBox="0 0 32 32" fill="none">
          <path
            d="M7 8.5A4.5 4.5 0 0 1 11.5 4h13A4.5 4.5 0 0 1 29 8.5v8a4.5 4.5 0 0 1-4.5 4.5H18l-6.5 5v-5h0A4.5 4.5 0 0 1 7 16.5v-8Z"
            fill="currentColor"
          />
          <path
            d="M3 13v8.5A4.5 4.5 0 0 0 7.5 26H9"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>
      </span>
      <span>nexo<span class="text-secondary">.</span></span>
    </RouterLink>

    <nav
      class="ml-[52px] hidden items-center gap-[34px] md:flex"
      aria-label="Navegación principal"
    >
      <a
        class="text-[13px] font-medium text-muted no-underline transition-colors hover:text-text"
        href="#como-funciona"
      >
        Cómo funciona
      </a>
      <a
        class="text-[13px] font-medium text-muted no-underline transition-colors hover:text-text"
        href="#comunidad"
      >
        La comunidad
      </a>
    </nav>

    <div class="flex items-center gap-2 sm:gap-6">
      <RouterLink
        v-if="isAuthReady && user"
        class="hidden text-[13px] font-medium text-muted no-underline transition-colors hover:text-text sm:inline"
        to="/feed"
      >
        Feed
      </RouterLink>
      <RouterLink
        v-if="isAuthReady && user"
        class="inline-flex min-h-[37px] items-center justify-center rounded-[7px] border border-slate-400/25 px-4 text-xs font-semibold text-slate-200 no-underline transition duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:text-white sm:min-h-10"
        to="/chat"
      >
        Chat
      </RouterLink>
      <RouterLink
        v-if="isAuthReady && user"
        class="inline-flex min-h-[37px] items-center justify-center rounded-[7px] border border-transparent bg-primary px-5 text-xs font-semibold text-white no-underline transition duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_30px_rgba(79,70,229,0.23)] sm:min-h-10"
        to="/perfil"
      >
        Perfil
      </RouterLink>
      <RouterLink
        v-if="isAuthReady && !user"
        class="mr-0 hidden text-[13px] font-medium text-muted no-underline transition-colors hover:text-text sm:mr-1 sm:inline"
        to="/inicio-sesion"
      >
        Iniciar sesión
      </RouterLink>
      <RouterLink
        v-if="isAuthReady && !user"
        class="inline-flex min-h-[37px] items-center justify-center gap-3 rounded-[7px] border border-transparent bg-primary px-4 text-xs font-semibold text-white no-underline transition duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_30px_rgba(79,70,229,0.23)] sm:min-h-10"
        to="/registarse"
      >
        Crear cuenta <span aria-hidden="true">↗</span>
      </RouterLink>
    </div>
  </header>
</template>
