<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <header v-if="!route.meta.hideLayout">Header</header>
  <main>
    <RouterView />
  </main>
  <footer v-if="!route.meta.hideLayout">Footer</footer>
</template>
