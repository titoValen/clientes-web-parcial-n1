<script setup></script>

<template>
  <footer
    class="mx-auto mt-[27px] flex min-h-[80px] w-[calc(100%-2.25rem)] flex-wrap items-center gap-x-4 border-t border-white/10 py-[17px] sm:min-h-[92px] sm:w-[calc(100%-4rem)] sm:max-w-[1160px] sm:flex-nowrap sm:justify-between sm:py-0"
  >
    <RouterLink
      class="inline-flex items-center gap-[7px] font-heading text-[19px] font-bold tracking-[-1.4px] text-text no-underline"
      to="/"
    >
      <span
        class="grid size-[26px] place-items-center text-primary"
        aria-hidden="true"
      >
        <svg class="size-6" viewBox="0 0 32 32" fill="none">
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
    <p
      class="order-1 mt-1 w-full text-[10px] text-slate-500 sm:order-none sm:mt-0 sm:w-auto"
    >
      Un espacio para encontrarnos en las palabras.
    </p>
    <span class="ml-auto text-[9px] text-slate-500 sm:ml-0 sm:text-[10px]">
      Hecho para conectar
      <span class="ml-[5px] text-secondary" aria-hidden="true">✳</span>
    </span>
  </footer>
</template>
