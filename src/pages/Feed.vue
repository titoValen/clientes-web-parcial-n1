<script setup>
import PostsFeed from "@/components/PostsFeed.vue";
</script>

<template>
  <div class="relative isolate min-h-[calc(100vh-164px)] overflow-hidden bg-background">
    <div class="pointer-events-none absolute -right-40 top-16 -z-10 size-112 rounded-full bg-primary/15 blur-[110px]" aria-hidden="true"></div>
    <div class="pointer-events-none absolute -bottom-48 -left-40 -z-10 size-112 rounded-full bg-secondary/10 blur-[110px]" aria-hidden="true"></div>

    <main class="mx-auto w-[calc(100%-2.25rem)] max-w-290 py-10 sm:w-[calc(100%-4rem)] sm:py-14">
      <header class="mb-8">
        <span class="flex items-center gap-2 text-[10px] font-bold tracking-[1.65px] text-[#b5b6ff]">
          <span class="size-1.75 rounded-full bg-secondary shadow-[0_0_12px_rgba(20,184,166,0.5)]"></span>
          LA COMUNIDAD
        </span>
        <h1 class="mt-3 font-heading text-4xl font-semibold tracking-[-2px]">Feed.</h1>
        <p class="mt-2 text-sm text-muted">Mirá lo que está compartiendo la comunidad.</p>
      </header>

      <PostsFeed :can-publish="true" />
    </main>
  </div>
</template>
